import React from 'react';

const NoDataMessage = () => {
  return (
    <div
      style={{
        height: '200px',
        padding: '40px 20px',
        textAlign: 'center',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderBottom: '1px solid #e9ecef',
      }}
    >
      <div style={{ 
        fontSize: '48px', 
        color: '#dee2e6', 
        marginBottom: '16px' 
      }}>
        📋
      </div>
      <div style={{ 
        fontSize: '18px', 
        color: '#6c757d', 
        fontWeight: '500',
        marginBottom: '8px'
      }}>
        No Data Found
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#adb5bd' 
      }}>
        There are no rows to display at the moment
      </div>
    </div>
  );
};

export default NoDataMessage;