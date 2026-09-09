'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

interface ParsedStudent {
  rollNo: string;
  name: string;
  fatherName: string;
  dob: string;
  course: string;
  session: string;
  phone: string;
  status: 'valid' | 'invalid';
  error?: string;
}

export default function StudentUploadGuidePage() {
  const [parsedRows, setParsedRows] = useState<ParsedStudent[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Standard Template Definition
  const sampleHeaders = [
    'Roll_Number',
    'Student_Name',
    'Father_Name',
    'Date_Of_Birth_DDMMYYYY',
    'Gender',
    'Course_DElEd_BEd',
    'Academic_Session',
    'Mobile_Number',
    'Fee_Amount_INR'
  ];

  const sampleRows = [
    ['2024-DEL-001', 'Rajesh Kumar Pradhan', 'Bichitrananda Pradhan', '15/07/2002', 'Male', 'D.El.Ed', '2024-2026', '9876543210', '500'],
    ['2024-DEL-002', 'Priyanka Mohapatra', 'Debabrata Mohapatra', '22/03/2003', 'Female', 'D.El.Ed', '2024-2026', '9876543211', '500'],
    ['2024-BED-003', 'Subrat Jena', 'Narayan Jena', '10/11/2001', 'Male', 'B.Ed', '2024-2026', '9876543212', '500'],
  ];

  // Function to download pre-formatted CSV template
  const downloadSampleTemplate = () => {
    const csvContent = [
      sampleHeaders.join(','),
      ...sampleRows.map((r) => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AOPSTSMA_Student_Batch_Upload_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to parse uploaded Excel / CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadStatus('Reading and validating file...');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { header: 1 }) as unknown as string[][];

        if (data.length < 2) {
          setUploadStatus('Error: The uploaded file is empty or missing data rows.');
          return;
        }

        const rows: ParsedStudent[] = [];
        const rollSet = new Set<string>();

        // Skip header row
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length === 0 || !row[0]) continue;

          const rollNo = String(row[0] || '').trim();
          const name = String(row[1] || '').trim();
          const fatherName = String(row[2] || '').trim();
          const dob = String(row[3] || '').trim();
          const course = String(row[5] || 'D.El.Ed').trim();
          const session = String(row[6] || '2024-2026').trim();
          const phone = String(row[7] || '').trim();

          let status: 'valid' | 'invalid' = 'valid';
          let error = '';

          if (!rollNo) {
            status = 'invalid';
            error = 'Missing roll number';
          } else if (rollSet.has(rollNo)) {
            status = 'invalid';
            error = 'Duplicate roll number in batch';
          } else if (!name) {
            status = 'invalid';
            error = 'Missing candidate name';
          }

          rollSet.add(rollNo);
          rows.push({ rollNo, name, fatherName, dob, course, session, phone, status, error });
        }

        setParsedRows(rows);
        const validCount = rows.filter((r) => r.status === 'valid').length;
        setUploadStatus(`File verified: ${rows.length} total rows, ${validCount} valid and ready for enrollment.`);
      } catch (err) {
        console.error('File parsing error:', err);
        setUploadStatus('Failed to parse file. Please use the standard .xlsx or .csv template.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <section className="page-head" style={{ backgroundColor: '#0B2545', borderBottom: '3px solid #D97706' }}>
        <div className="wrap">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(217, 119, 6, 0.2)', border: '1px solid #D97706', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', color: '#FBBF24', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
            School Administration Protocol
          </div>
          <h1 style={{ color: '#FFFFFF' }}>Student Batch Upload Architecture &amp; Guide</h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', maxWidth: '64ch', marginTop: '0.5rem' }}>
            Affiliated institutions can enroll full candidate trainee batches at once using our
            standardized Excel format. The system verifies records automatically before saving to database.
          </p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="wrap">
          {/* 3 Step Workflow Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '2.5rem 2rem',
              marginBottom: '2.5rem',
              boxShadow: '0 2px 10px rgba(11,37,69,0.06)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', color: '#0B2545', marginBottom: '1.5rem', fontWeight: 600 }}>
              How the Batch Enrollment System Works
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div style={{ borderLeft: '3px solid #133E87', paddingLeft: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#133E87', textTransform: 'uppercase' }}>Step 1</span>
                <h4 style={{ fontSize: '1.05rem', color: '#0F172A', margin: '0.3rem 0 0.5rem 0' }}>Download Format</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                  Download the official AOPSTSMA pre-formatted Excel / CSV template with predefined column headers.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #D97706', paddingLeft: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>Step 2</span>
                <h4 style={{ fontSize: '1.05rem', color: '#0F172A', margin: '0.3rem 0 0.5rem 0' }}>Fill Student Rolls</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                  Enter student names, roll numbers, DOB, course (D.El.Ed / B.Ed) without altering the column names.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #059669', paddingLeft: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Step 3</span>
                <h4 style={{ fontSize: '1.05rem', color: '#0F172A', margin: '0.3rem 0 0.5rem 0' }}>Upload &amp; Verify</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                  Upload file. The system checks duplicates and generates the student registration database and demands.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="btn btn--primary"
              >
                📥 Download Official Excel/CSV Template
              </button>
              <Link href="/pay" className="btn btn--ghost">
                &larr; Back to Payment Gateway
              </Link>
            </div>
          </div>

          {/* Interactive Live Upload & Validation Sandbox */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px dashed #CBD5E1',
              borderRadius: '8px',
              padding: '2.5rem 2rem',
              marginBottom: '2.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#0B2545', marginBottom: '0.5rem' }}>
              Test Batch File Upload &amp; Preview Sandbox
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Select any .xlsx, .xls or .csv file to test the parsing engine and validation rules.
            </p>

            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileUpload}
              style={{
                display: 'block',
                padding: '0.85rem 1rem',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#F8FAFC',
                marginBottom: '1rem',
                cursor: 'pointer',
              }}
            />

            {uploadStatus && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: uploadStatus.includes('Error') ? '#FEE2E2' : '#EFF6FF',
                  color: uploadStatus.includes('Error') ? '#991B1B' : '#1E40AF',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                }}
              >
                {fileName ? `[${fileName}] ` : ''}{uploadStatus}
              </div>
            )}

            {/* Parsed Students Table Preview */}
            {parsedRows.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>
                  Parsed Student Preview ({parsedRows.length} Trainees Detected)
                </h4>
                <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                      <tr>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Roll No</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Candidate Name</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Father Name</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>DOB</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Course</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Session</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Validation Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 8).map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{row.rollNo}</td>
                          <td style={{ padding: '0.65rem 1rem' }}>{row.name}</td>
                          <td style={{ padding: '0.65rem 1rem' }}>{row.fatherName}</td>
                          <td style={{ padding: '0.65rem 1rem' }}>{row.dob}</td>
                          <td style={{ padding: '0.65rem 1rem' }}>{row.course}</td>
                          <td style={{ padding: '0.65rem 1rem' }}>{row.session}</td>
                          <td style={{ padding: '0.65rem 1rem' }}>
                            {row.status === 'valid' ? (
                              <span style={{ color: '#059669', fontWeight: 700 }}>✓ Ready</span>
                            ) : (
                              <span style={{ color: '#DC2626', fontWeight: 700 }}>⚠ {row.error}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedRows.length > 8 && (
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#64748B', backgroundColor: '#F8FAFC' }}>
                      Showing first 8 of {parsedRows.length} trainees.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
