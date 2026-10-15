import { NextResponse } from 'next/server';
import { saveUploadedStudents, StudentRecord } from '@/lib/data/students';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { students } = body;

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No student records provided for upload.' },
        { status: 400 }
      );
    }

    const formattedRecords: StudentRecord[] = students.map((s: any, idx: number) => ({
      studentId: s.studentId || s.rollNo || `STU-${Date.now().toString().slice(-6)}-${idx + 1}`,
      studentName: String(s.studentName || s.name || '').trim(),
      mobileNumber: String(s.mobileNumber || s.mobile || '').trim().replace(/\D/g, ''),
      zoneId: String(s.zoneId || s.zone || 'bhubaneswar').toLowerCase(),
      zoneName: String(s.zoneName || 'Association Zone'),
      schoolId: String(s.schoolId || 'SCH-UPLOAD'),
      schoolName: String(s.schoolName || s.school || 'Member School').trim(),
      district: String(s.district || 'Odisha'),
      feeAmount: Number(s.feeAmount || s.fee) || 2500,
      paymentStatus: 'Pending',
    }));

    saveUploadedStudents(formattedRecords);

    return NextResponse.json({
      success: true,
      count: formattedRecords.length,
      message: `Successfully uploaded and synced ${formattedRecords.length} student records for fee verification!`,
    });
  } catch (error) {
    console.error('Error uploading students:', error);
    return NextResponse.json(
      { success: false, message: 'Server error uploading student records.' },
      { status: 500 }
    );
  }
}
