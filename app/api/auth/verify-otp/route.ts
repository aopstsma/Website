import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';
import { createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mobile, otp, role = 'school', schoolName, authorityName, zone } = body;

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and OTP code are required' },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const verification = verifyOTP(cleanMobile, otp);

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.reason || 'Invalid OTP code' },
        { status: 401 }
      );
    }

    const metadata = verification.metadata || {};
    const finalSchoolName = (metadata.schoolName as string) || schoolName || 'Authorized Institution';
    const finalAuthority = (metadata.authorityName as string) || authorityName || 'Headmaster / Secretary';
    const finalZone = (metadata.zone as string) || zone || 'bhubaneswar';

    const token = createSessionToken({
      role: role as 'school' | 'student',
      id: role === 'school' ? finalSchoolName : cleanMobile,
      name: finalSchoolName,
      zone: finalZone,
      mobile: cleanMobile,
      authorityName: finalAuthority,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        role,
        id: finalSchoolName,
        name: finalSchoolName,
        authorityName: finalAuthority,
        zone: finalZone,
        mobile: cleanMobile,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set('aopstsma_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: unknown) {
    console.error('Error in verify-otp API:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
