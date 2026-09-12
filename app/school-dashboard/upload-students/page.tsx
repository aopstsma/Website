'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

interface StudentRecord {
  rollNo: string;
  name: string;
  fatherName: string;
  mobile: string;
  course: string;
  session: string;
  status: 'valid' | 'duplicate' | 'missing_fields';
  issue?: string;
}

export default function StudentBatchUploadPage() {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [schoolCode, setSchoolCode] = useState('OD-CTC-001');
  const [academicSession, setAcademicSession] = useState('2025-2027');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate and download official Excel template for schools
  const downloadTemplate = () => {
    const templateData = [
      {
        'Roll_Number': 'OD2501001',
        'Student_Full_Name': 'Rajesh Kumar Das',
        'Father_Name': 'Bikram Das',
        'Date_of_Birth_DDMMYYYY': '15/06/2002',
        'Gender_M_F_O': 'M',
        'Mobile_Number': '9861012345',
        'Course_DElEd_BEd': 'D.El.Ed',
        'Academic_Session': '2025-2027',
      },
      {
        'Roll_Number': 'OD2501002',
        'Student_Full_Name': 'Priyanka Mohapatra',
        'Father_Name': 'Debasis Mohapatra',
        'Date_of_Birth_DDMMYYYY': '22/09/2003',
        'Gender_M_F_O': 'F',
        'Mobile_Number': '9437098765',
        'Course_DElEd_BEd': 'D.El.Ed',
        'Academic_Session': '2025-2027',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student_Roster');
    XLSX.writeFile(wb, 'AOPSTSMA_Student_Batch_Template.xlsx');
  };

  // Handle file drop or selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadSuccess(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        // Validate and map rows
        const seenRolls = new Set<string>();
        const parsed: StudentRecord[] = data.map((row) => {
          const roll = String(row['Roll_Number'] || row['Roll_No'] || row['roll_no'] || '').trim();
          const name = String(row['Student_Full_Name'] || row['Name'] || row['name'] || '').trim();
          const father = String(row['Father_Name'] || row['father_name'] || '').trim();
          const mobile = String(row['Mobile_Number'] || row['Mobile'] || row['phone'] || '').trim();
          const course = String(row['Course_DElEd_BEd'] || row['Course'] || 'D.El.Ed').trim();
          const session = String(row['Academic_Session'] || row['Session'] || academicSession).trim();

          if (!roll || !name) {
            return {
              rollNo: roll || 'EMPTY',
              name: name || 'MISSING',
              fatherName: father,
              mobile,
              course,
              session,
              status: 'missing_fields',
              issue: 'Roll number or name is empty',
            };
          }

          if (seenRolls.has(roll.toUpperCase())) {
            return {
              rollNo: roll,
              name,
              fatherName: father,
              mobile,
              course,
              session,
              status: 'duplicate',
              issue: 'Duplicate roll number in uploaded batch',
            };
          }

          seenRolls.add(roll.toUpperCase());
          return {
            rollNo: roll,
            name,
            fatherName: father,
            mobile,
            course,
            session,
            status: 'valid',
          };
        });

        setRecords(parsed);
      } catch (err) {
        alert('Could not parse Excel/CSV file. Please use the official AOPSTSMA template format.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const validCount = records.filter((r) => r.status === 'valid').length;
  const issueCount = records.length - validCount;

  const handleUploadToDatabase = async () => {
    if (validCount === 0) return;
    setUploading(true);

    // Simulate batch insertion delay and sync with API
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
    }, 1200);
  };

  return (
    <div className="school-dashboard-page" style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: '80vh' }}>
      <div className="wrap" style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Top Breadcrumb & Title */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748B' }}>
              <Link href="/school-dashboard" style={{ color: '#0B2545', fontWeight: 600, textDecoration: 'none' }}>School Portal</Link>
              <span>/</span>
              <span>Student Batch Roster Upload</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', color: '#0B2545', marginTop: '0.25rem' }}>
              Upload Enrolled Candidates Batch (Excel / CSV)
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Submit registered candidates for examination fee verification, certificate processing, and association records.
            </p>
          </div>

          <button
            type="button"
            onClick={downloadTemplate}
            className="btn btn--secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.1rem' }}
          >
            📥 Download Official Excel Template (.xlsx)
          </button>
        </div>

        {/* Instructions Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#0B2545', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📋</span> Batch Upload Requirements &amp; Verification Rules
          </h3>
          <ul style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', margin: 0, paddingLeft: '1.2rem' }}>
            <li><b>Roll Number:</b> Must be unique per student. Duplicates within the sheet are automatically flagged.</li>
            <li><b>Fee Rate:</b> Enrolled student examination &amp; course verification fee is standardized at ₹2,500 per candidate.</li>
            <li><b>Google Sheets Live Sync:</b> Once approved, candidate roster syncs directly with the Association's Central Registry spreadsheet.</li>
          </ul>
        </div>

        {/* Upload Box */}
        <div style={{ background: '#FFFFFF', border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '2.5rem 1.5rem', textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📂</div>
          <h4 style={{ fontSize: '1.15rem', color: '#0B2545', marginBottom: '0.25rem' }}>
            {fileName ? `Selected File: ${fileName}` : 'Drag & Drop your Excel/CSV file here, or browse'}
          </h4>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
            Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
          </p>
          <button type="button" className="btn btn--primary" style={{ marginTop: '0.75rem', pointerEvents: 'none' }}>
            Select Spreadsheet File
          </button>
        </div>

        {/* Success Alert */}
        {uploadSuccess && (
          <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✓</span>
            <div>
              <b>Batch Successfully Submitted to Association Registry!</b>
              <div style={{ fontSize: '0.85rem' }}>{validCount} candidate records have been staged. Students can now verify their details and pay via the online portal.</div>
            </div>
          </div>
        )}

        {/* Preview Table */}
        {records.length > 0 && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <div>
                <b style={{ color: '#0B2545', fontSize: '1rem' }}>Pre-Upload Roster Preview</b>
                <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', background: '#E2E8F0', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                  Total: {records.length} | Valid: {validCount} {issueCount > 0 && `| Issues: ${issueCount}`}
                </span>
              </div>

              <button
                type="button"
                className="btn btn--primary"
                onClick={handleUploadToDatabase}
                disabled={uploading || validCount === 0}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
              >
                {uploading ? 'Processing Batch...' : `🚀 Confirm & Upload ${validCount} Students`}
              </button>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead style={{ background: '#0B2545', color: '#FFFFFF', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem' }}>Sl</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Roll Number</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Candidate Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Father's Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Course</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Session</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Mobile</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Validation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        background: r.status !== 'valid' ? '#FEF2F2' : idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                      }}
                    >
                      <td style={{ padding: '0.65rem 1rem', color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#0B2545' }}>{r.rollNo}</td>
                      <td style={{ padding: '0.65rem 1rem' }}>{r.name}</td>
                      <td style={{ padding: '0.65rem 1rem', color: '#475569' }}>{r.fatherName || '—'}</td>
                      <td style={{ padding: '0.65rem 1rem' }}>{r.course}</td>
                      <td style={{ padding: '0.65rem 1rem' }}>{r.session}</td>
                      <td style={{ padding: '0.65rem 1rem', color: '#475569' }}>{r.mobile || '—'}</td>
                      <td style={{ padding: '0.65rem 1rem' }}>
                        {r.status === 'valid' ? (
                          <span style={{ color: '#059669', background: '#D1FAE5', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                            ✓ Ready to Sync
                          </span>
                        ) : (
                          <span style={{ color: '#DC2626', background: '#FEE2E2', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                            ⚠ {r.issue}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
