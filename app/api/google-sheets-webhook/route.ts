import { NextResponse } from 'next/server';

/**
 * Google Sheets live sync endpoint.
 * Syncs student registrations, school renewals, and fee payment transactions
 * to the Association's Central Google Spreadsheet.
 */
export async function POST(request: Request) {
  try {
    const paymentData = await request.json();
    const {
      transactionId = `TXN-${Date.now()}`,
      orderId = '',
      studentId = 'N/A',
      studentName = 'Registered Member / Candidate',
      mobileNumber = '',
      schoolName = 'All Orissa Private Secondary Training Schools',
      zoneName = 'Odisha State Jurisdiction',
      amount = 2500,
      feeType = 'Student Registration & Examination Fee',
      paymentMethod = 'UPI / NetBanking / Razorpay',
      timestamp = new Date().toISOString(),
      status = 'SUCCESS',
    } = paymentData;

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let syncedToGoogleSheets = false;
    let responseData = null;

    if (webhookUrl && !webhookUrl.includes('placeholder')) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            transactionId,
            orderId,
            studentId,
            studentName,
            mobileNumber,
            schoolName,
            zoneName,
            amount,
            feeType,
            paymentMethod,
            status,
          }),
        });

        if (response.ok) {
          syncedToGoogleSheets = true;
          try {
            responseData = await response.json();
          } catch {
            // response was not JSON
          }
        }
      } catch (err) {
        console.warn('[Google Sheets] Webhook POST error (will log locally):', err);
      }
    }

    console.log('=== [AOPSTSMA GOOGLE REGISTRY TRANSACTION] ===');
    console.log(`[Google Sync] Txn: ${transactionId} | Student: ${studentName} (${studentId}) | Amount: ₹${amount} | Synced: ${syncedToGoogleSheets}`);

    return NextResponse.json({
      success: true,
      syncedToGoogleSheets,
      message: syncedToGoogleSheets
        ? 'Successfully synchronized to Association Central Google Spreadsheet.'
        : 'Logged locally. Set GOOGLE_SHEET_WEBHOOK_URL in .env.local to sync directly with Google Drive.',
      transaction: {
        transactionId,
        studentId,
        studentName,
        schoolName,
        amount,
        timestamp,
      },
    });
  } catch (error) {
    console.error('[Google Sheets] Internal error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record transaction.' },
      { status: 500 }
    );
  }
}
