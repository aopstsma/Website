import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();
    const {
      transactionId,
      studentId,
      studentName,
      mobileNumber,
      schoolName,
      zoneName,
      amount,
      paymentMethod,
      timestamp,
    } = paymentData;

    // Google Apps Script Webhook URL (Can be set in process.env.GOOGLE_SHEET_WEBHOOK_URL)
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    let syncedToGoogleSheets = false;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: timestamp || new Date().toISOString(),
            transactionId,
            studentId,
            studentName,
            mobileNumber,
            schoolName,
            zoneName,
            amount: amount || 2500,
            paymentMethod: paymentMethod || 'UPI / Online Gateway',
            status: 'SUCCESS',
          }),
        });
        if (response.ok) {
          syncedToGoogleSheets = true;
        }
      } catch (err) {
        console.warn('Google Sheets Webhook fetch failed, logging locally:', err);
      }
    }

    console.log('--- AOPSTSMA PAYMENT LOGGED ---');
    console.log(`Txn ID: ${transactionId} | Student: ${studentName} (${studentId}) | Amount: ₹${amount}`);

    return NextResponse.json({
      success: true,
      syncedToGoogleSheets,
      message: 'Transaction logged and synced to Google Sheets registry.',
      data: paymentData,
    });
  } catch (error) {
    console.error('Error logging payment to Google Sheets:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record transaction.' },
      { status: 500 }
    );
  }
}
