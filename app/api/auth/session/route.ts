import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('aopstsma_session')?.value;
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const verification = verifySessionToken(token);
    if (!verification.valid || !verification.payload) {
      return NextResponse.json({ authenticated: false, error: verification.error }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: verification.payload,
    });
  } catch (error: unknown) {
    console.error('Error checking session:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('aopstsma_session');
  return response;
}
