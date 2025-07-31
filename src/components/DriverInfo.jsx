import React from 'react';

// Driver component
const DriverInfo = React.memo(({ driver }) => (
  <div style={{ 
    padding: '12px', 
    height: '100%', 
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#6c757d',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
      }}>
        {driver.id}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
          {driver.id} {driver.name}
        </div>
      </div>
      <div style={{
        width: '16px',
        height: '16px',
        background: '#007bff',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        borderRadius: '2px',
      }}>
        {driver.status}
      </div>
    </div>
    
    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
      <div>ETA -</div>
      <div>Truck # {driver.truckNumber || '-'}</div>
      <div>Chassis # -</div>
      <div>Size -</div>
    </div>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '4px',
      fontSize: '11px',
      color: '#721c24'
    }}>
      <div style={{ fontSize: '11px', color: '#721c24' }}>Drive: -</div>
      <div style={{ fontSize: '11px', color: '#721c24' }}>Break: -</div>
    </div>
  </div>
));

DriverInfo.displayName = 'DriverInfo';

export default DriverInfo;