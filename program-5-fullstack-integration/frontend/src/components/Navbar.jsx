import React from 'react';

export default function Navbar({ onRefresh, isConnected }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-box">
          <div className="brand-icon">FS</div>
          <div>
            <div className="brand-title">
              ApexInventory <span>Full Stack</span>
            </div>
            <div className="brand-tag">React Frontend &bull; Express API &bull; Sequelize ORM</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10b981' : '#ef4444',
                display: 'inline-block'
              }}
            ></span>
            <span style={{ color: isConnected ? '#a7f3d0' : '#fca5a5' }}>
              {isConnected ? 'Backend Connected' : 'Connecting to API...'}
            </span>
          </div>

          <div className="student-tag">
            <span>Yash Prasanna Bhandari</span>
            <strong>Roll 08</strong>
            <span>(D11ADA)</span>
          </div>
        </div>
      </div>
    </header>
  );
}

