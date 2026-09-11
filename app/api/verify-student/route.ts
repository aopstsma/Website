import { NextResponse } from 'next/server';
import { INITIAL_STUDENTS } from '@/lib/data/students';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, mobileNumber, zoneId } = body;

    if (!studentId || !mobileNumber) {
      return NextResponse.json(
        { success: false, message: 'Please enter Student ID and Mobile Number.' },
        { status: 400 }
      );
    }

    const cleanId = String(studentId).trim().toLowerCase();
    const cleanMobile = String(mobileNumber).trim().replace(/\D/g, '');

    // Match student record against database
    const matchedStudent = INITIAL_STUDENTS.find((s) => {
      const matchId = s.studentId.toLowerCase() === cleanId || s.studentId.toLowerCase().endsWith(cleanId);
      const matchPhone = s.mobileNumber.endsWith(cleanMobile) || cleanMobile.endsWith(s.mobileNumber);
      const matchZone = !zoneId || zoneId === 'all' || s.zoneId === zoneId;
      return matchId && matchPhone && matchZone;
    });

    if (matchedStudent) {
      return NextResponse.json({
        success: true,
        verified: true,
        student: matchedStudent,
        message: 'Student record verified successfully!',
      });
    }

    return NextResponse.json(
      {
        success: false,
        verified: false,
        message:
          'No verified student record found for this Student ID and Mobile Number in the selected zone. Please check your details or contact your institution.',
      },
      { status: 444 }
    );
  } catch (error) {
    console.error('Error verifying student details:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during verification.' },
      { status: 500 }
    );
  }
}
