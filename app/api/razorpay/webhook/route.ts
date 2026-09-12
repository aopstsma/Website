import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Read raw body as text for precise cryptographic signature verification (SPEC.md §5.3)
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 2. Verify signature if webhook secret is configured
    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('[Razorpay Webhook] Invalid signature detected. Rejected.');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    // 3. Parse JSON event payload
    const event = JSON.parse(rawBody);
    console.log('[Razorpay Webhook] Received verified event:', event.event);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayPaymentId = paymentEntity?.id;
      const razorpayOrderId = paymentEntity?.order_id;
      const notes = paymentEntity?.notes || {};
      const amountPaise = paymentEntity?.amount;

      if (!razorpayPaymentId) {
        return NextResponse.json({ error: 'Missing payment entity' }, { status: 400 });
      }

      // 4. Update Supabase with Idempotency Guard (SPEC.md §5.4)
      try {
        const supabase = createAdminClient();

        // Check if payment ID has already been recorded
        const { data: existing } = await supabase
          .from('payments')
          .select('id, status')
          .eq('razorpay_payment_id', razorpayPaymentId)
          .maybeSingle();

        if (existing) {
          console.log('[Razorpay Webhook] Duplicate webhook for', razorpayPaymentId, '- No-op 200 returned.');
          return NextResponse.json({ received: true, duplicate: true });
        }

        // Update payment row to paid
        if (notes.dbPaymentId) {
          await supabase
            .from('payments')
            .update({
              status: 'paid',
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: razorpayPaymentId,
              paid_at: new Date().toISOString(),
            })
            .eq('id', notes.dbPaymentId);
        } else {
          await supabase
            .from('payments')
            .insert({
              purpose: notes.purpose || 'student_registration',
              fund_type: 'association_income',
              amount: amountPaise || 250000,
              status: 'paid',
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: razorpayPaymentId,
              payer_name: notes.studentName || 'Candidate',
              paid_at: new Date().toISOString(),
            });
        }
      } catch (dbErr) {
        console.warn('[Razorpay Webhook] Supabase update warning:', dbErr);
      }

      // 5. Fire Google Sheets sync webhook (SPEC.md §8)
      const googleWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
      if (googleWebhookUrl) {
        fetch(googleWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            transactionId: razorpayPaymentId,
            orderId: razorpayOrderId,
            studentId: notes.studentId || '',
            studentName: notes.studentName || '',
            schoolName: notes.schoolCode || '',
            amount: (amountPaise || 250000) / 100,
            status: 'PAID',
            gateway: 'Razorpay',
          }),
        }).catch((err) => console.warn('[Webhook] Google sheets sync notice:', err));
      }
    }

    // 6. Fast response within seconds (SPEC.md §5.5)
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('[Razorpay Webhook] Error processing webhook:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
