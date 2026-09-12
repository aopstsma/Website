import { NextResponse } from 'next/server';
import { razorpay, isRazorpayConfigured } from '@/lib/razorpay';
import { createAdminClient } from '@/lib/supabase/server';

// Official standard fees in paise (SPEC.md Section 4 & 6)
const FEE_RATES_PAISE: Record<string, number> = {
  student: 250000,      // ₹2,500
  renewal: 250000,      // ₹2,500 (School renewal)
  dir_deposit: 2500000, // ₹25,000 (DIR deposit)
  affiliation: 1500000, // ₹15,000
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      purpose = 'student_registration',
      schoolCode,
      studentId,
      studentName,
      payerPhone,
      feeCategory = 'student',
    } = body;

    // Determine amount on server side strictly (SPEC.md Section 5.1)
    let amountInPaise = FEE_RATES_PAISE[feeCategory] || 250000;
    const receiptNo = `REC-${Date.now().toString().slice(-8)}`;

    // Try to record in Supabase if configured
    let dbPaymentId: string | null = null;
    try {
      const supabase = createAdminClient();
      const fundType = ['legal_assistance', 'court_expenses', 'dir_deposit'].includes(purpose)
        ? 'case_fund'
        : 'association_income';

      const { data, error } = await supabase
        .from('payments')
        .insert({
          purpose: purpose === 'student' ? 'student_registration' : purpose,
          fund_type: fundType,
          amount: amountInPaise,
          status: 'created',
          payer_name: studentName || 'Candidate',
          payer_phone: payerPhone || '',
          receipt_no: receiptNo,
        })
        .select('id')
        .single();

      if (!error && data) {
        dbPaymentId = data.id;
      }
    } catch (dbErr) {
      console.warn('[Order Create] Supabase payment logging note:', dbErr);
    }

    // Call Razorpay Orders API if configured
    if (isRazorpayConfigured) {
      try {
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptNo,
          notes: {
            purpose,
            schoolCode: schoolCode || 'AOPSTSMA',
            studentId: studentId || '',
            studentName: studentName || '',
            dbPaymentId: dbPaymentId || '',
          },
        });

        return NextResponse.json({
          success: true,
          isLiveGateway: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          receiptNo,
        });
      } catch (rzpErr) {
        console.error('[Order Create] Razorpay API error:', rzpErr);
      }
    }

    // If Razorpay keys are not yet configured in local dev, provide simulated gateway response
    const mockOrderId = `order_sim_${Date.now()}`;
    return NextResponse.json({
      success: true,
      isLiveGateway: false,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: 'rzp_test_simulation',
      receiptNo,
      message: 'Simulated order created for local testing without live API keys.',
    });
  } catch (error) {
    console.error('[Order Create] Fatal error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create payment order.' },
      { status: 500 }
    );
  }
}
