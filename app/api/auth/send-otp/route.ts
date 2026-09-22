import { NextRequest, NextResponse } from 'next/server';
import { createAndStoreOTP, sendSMSOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mobile, schoolName, role = 'school', authorityName, zone } = body;

    if (!mobile || typeof mobile !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      );
    }

    // Generate & cache OTP
    const { otp, expiresAt } = createAndStoreOTP(cleanMobile, 300, {
      role,
      schoolName,
      authorityName,
      zone,
      mobile: cleanMobile,
    });

    // Send SMS (or log in dev mode)
    const result = await sendSMSOTP(cleanMobile, otp);

    return NextResponse.json({
      success: true,
      message: result.mode === 'dev' 
        ? `OTP generated successfully. (Dev mode: check console or use code shown)`
        : '6-digit OTP has been dispatched to your mobile number.',
      expiresAt,
      // Provide demoCode if dev/test environment to allow seamless manual evaluation
      demoOtp: result.mode === 'dev' ? result.demoCode : undefined,
    });
  } catch (error: unknown) {
    console.error('Error in send-otp API:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
