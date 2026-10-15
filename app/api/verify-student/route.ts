import { NextResponse } from 'next/server';
import { getAllStudents, StudentRecord } from '@/lib/data/students';
import { createAndStoreOTP, sendSMSOTP } from '@/lib/otp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, mobileNumber, zoneId, schoolName, studentId } = body;

    // Student Name & Mobile Number are required
    const cleanName = String(studentName || '').trim().toLowerCase();
    const cleanMobile = String(mobileNumber || '').trim().replace(/\D/g, '').slice(-10);

    if (!cleanName || cleanMobile.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'Please provide both Student Full Name and a valid 10-digit registered Mobile Number.',
        },
        { status: 400 }
      );
    }

    const normSchool = String(schoolName || '').trim().toLowerCase();
    const normZone = String(zoneId || '').trim().toLowerCase();
    const cleanId = String(studentId || '').trim().toLowerCase();

    const allStudents = getAllStudents();

    // Match against uploaded roster and database
    let matchedStudent: StudentRecord | undefined = allStudents.find((s) => {
      const sMobile = s.mobileNumber.replace(/\D/g, '').slice(-10);
      const phoneMatches = sMobile === cleanMobile;

      const sNameNorm = s.studentName.trim().toLowerCase();
      // Exact or partial name match (e.g. "Rajesh Das" in "Rajesh Kumar Das")
      const nameMatches =
        sNameNorm === cleanName ||
        sNameNorm.includes(cleanName) ||
        cleanName.includes(sNameNorm) ||
        (cleanId && (s.studentId.toLowerCase() === cleanId || s.studentId.toLowerCase().endsWith(cleanId)));

      // School match
      const sSchoolNorm = s.schoolName.trim().toLowerCase();
      const schoolMatches = !normSchool || sSchoolNorm.includes(normSchool) || normSchool.includes(sSchoolNorm);

      // Zone match
      const zoneMatches = !normZone || normZone === 'all' || s.zoneId.toLowerCase() === normZone;

      return phoneMatches && nameMatches && schoolMatches && zoneMatches;
    });

    // If exact school match didn't find, try matching by phone and name within zone
    if (!matchedStudent) {
      matchedStudent = allStudents.find((s) => {
        const sMobile = s.mobileNumber.replace(/\D/g, '').slice(-10);
        const phoneMatches = sMobile === cleanMobile;
        const sNameNorm = s.studentName.trim().toLowerCase();
        const nameMatches = sNameNorm === cleanName || sNameNorm.includes(cleanName) || cleanName.includes(sNameNorm);
        return phoneMatches && nameMatches;
      });
    }

    if (!matchedStudent) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: `Record not found! Student "${studentName}" with mobile +91-${cleanMobile} is not listed in ${schoolName ? schoolName : 'this school'}'s uploaded roster. Please verify details or ask your school to upload your record.`,
        },
        { status: 404 }
      );
    }

    // Generate & Dispatch OTP directly on verification
    const { otp, expiresAt } = createAndStoreOTP(cleanMobile, 300, {
      role: 'student',
      studentName: matchedStudent.studentName,
      schoolName: matchedStudent.schoolName,
      zone: matchedStudent.zoneId,
      mobile: cleanMobile,
    });

    const smsResult = await sendSMSOTP(cleanMobile, otp);

    return NextResponse.json({
      success: true,
      verified: true,
      otpSent: true,
      student: matchedStudent,
      expiresAt,
      demoOtp: smsResult.mode === 'dev' ? smsResult.demoCode : undefined,
      message: `Verified successfully! A 6-digit OTP has been sent to +91 ******${cleanMobile.slice(-4)}.`,
    });
  } catch (error) {
    console.error('Error verifying student details:', error);
    return NextResponse.json(
      { success: false, verified: false, message: 'Server error during student verification.' },
      { status: 500 }
    );
  }
}
