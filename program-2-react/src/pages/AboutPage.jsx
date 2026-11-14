import React from 'react';

export default function AboutPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Candidate & Project Documentation</h1>
          <p className="page-desc">Academic submission details for Full Stack Development CA3.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '850px' }}>
        <div className="card-header">
          <h3 className="card-title">Student Information & Submission Metadata</h3>
        </div>
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 600, width: '220px', color: '#64748b' }}>Student Name</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Yash Prasanna Bhandari</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#64748b' }}>Roll Number</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#2563eb' }}>08</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#64748b' }}>Division</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>D11ADA</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#64748b' }}>Semester / Academic Year</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Semester V / Final Year Cycle</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#64748b' }}>Degree Program</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>B.E. Artificial Intelligence and Data Science</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#64748b' }}>Subject</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Full Stack Development (FSD)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#64748b' }}>Course Outcome (Program 2)</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#059669' }}>CO3: Modern Component Frameworks & Single Page Architecture</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#64748b' }}>GitHub Repository</td>
                <td style={{ padding: '0.75rem' }}>
                  <a
                    href="https://github.com/yashbhandari0929/fsd-ca3"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                  >
                    https://github.com/yashbhandari0929/fsd-ca3
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

