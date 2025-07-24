import React, { useState, useCallback } from 'react';
import VirtualizedTable from './VirtualizedTable';

// Simple example data
const generateSimpleData = () => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    salary: 50000 + (i * 1000),
  }));
};

// Simple column configuration with formatters
const SIMPLE_COLUMNS = [
  { 
    key: 'id', 
    title: 'ID', 
    width: 80, 
    sortable: true,
    rowCellFormat: (row, column, index) => (
      <span style={{
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: '#4f46e5',
      }}>
        #{row.id}
      </span>
    ),
  },
  { 
    key: 'name', 
    title: 'Name', 
    width: 150, 
    sortable: true,
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>👤</span>
        <span>{column.title}</span>
        {isSortable && (
          <span style={{ 
            fontSize: '10px', 
            color: sortDirection ? '#4f46e5' : '#999' 
          }}>
            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    ),
  },
  { 
    key: 'email', 
    title: 'Email', 
    width: 200, 
    sortable: true,
    rowCellFormat: (row, column, index) => (
      <a 
        href={`mailto:${row.email}`}
        style={{
          color: '#4f46e5',
          textDecoration: 'none',
          fontSize: '12px',
        }}
        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
      >
        {row.email}
      </a>
    ),
  },
  { 
    key: 'department', 
    title: 'Department', 
    width: 120, 
    sortable: true,
  },
  { 
    key: 'status', 
    title: 'Status', 
    width: 100, 
    sortable: true,
    // This will be handled by rowRenderer for demo
  },
  { 
    key: 'salary', 
    title: 'Salary', 
    width: 120, 
    sortable: true,
    rowCellFormat: (row, column, index) => (
      <span style={{
        fontWeight: '600',
        color: '#059669',
      }}>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(row.salary)}
      </span>
    ),
  },
];

// Custom styles
const simpleStyles = {
  headerCell: {
    background: '#4f46e5',
    color: 'white',
    fontWeight: '600',
  },
  stickyColumn: {
    borderRight: '2px solid #4f46e5',
  },
  dataRowEven: {
    background: '#ffffff',
  },
  dataRowOdd: {
    background: '#f8fafc',
  },
};

function SimpleExample() {
  const [data, setData] = useState(() => generateSimpleData());
  const [sortConfig, setSortConfig] = useState(null);

  // Handle sorting
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  }, [data, sortConfig]);

  // Handle row drag and drop
  const handleDragEnd = useCallback((result) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    const newData = Array.from(data);
    const [removed] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, removed);
    
    setData(newData);
  }, [data]);

  // Handle cell drag and drop
  const handleCellDragEnd = useCallback((result) => {
    const { source, destination } = result;
    
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    // Parse source and destination cell IDs
    const [sourceRowId, sourceColumnKey] = source.droppableId.split('-');
    const [destRowId, destColumnKey] = destination.droppableId.split('-');
    
    const sourceRowIndex = parseInt(sourceRowId);
    const destRowIndex = parseInt(destRowId);
    
    // Create new data array
    const newData = Array.from(data);
    
    // Get the cell values
    const sourceValue = newData[sourceRowIndex][sourceColumnKey];
    const destValue = newData[destRowIndex][destColumnKey];
    
    // Swap the values
    newData[sourceRowIndex][sourceColumnKey] = destValue;
    newData[destRowIndex][destColumnKey] = sourceValue;
    
    setData(newData);
  }, [data]);

  // Custom row renderer for status column
  const rowRenderer = useCallback((row, column, index) => {
    if (column.key === 'status') {
      const statusColors = {
        'Active': '#22c55e',
        'Inactive': '#ef4444',
        'Pending': '#f59e0b',
      };
      
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          color: 'white',
          background: statusColors[row.status] || '#6b7280',
        }}>
          {row.status}
        </span>
      );
    }
    
    if (column.key === 'salary') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.salary);
    }
    
    return row[column.key];
  }, []);

  return (
    <div style={{ height: '100vh', padding: '20px', background: '#f1f5f9' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px', 
          color: '#1e293b',
        }}>
          Simple Employee Table Example
        </h1>
        <p style={{ 
          margin: 0, 
          color: '#64748b', 
          fontSize: '14px',
        }}>
          A simple implementation with {data.length} employees • Custom cell & header formatters • Click headers to sort • Drag rows to reorder • Drag cells to swap data
        </p>
      </div>
      
      <div style={{ 
        height: 'calc(100vh - 120px)', 
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}>
        <VirtualizedTable
          columns={SIMPLE_COLUMNS}
          data={data}
          onSort={handleSort}
          onDragEnd={handleDragEnd}
          onCellDragEnd={handleCellDragEnd}
          sortConfig={sortConfig}
          styles={simpleStyles}
          height="100%"
          estimatedRowHeight={60}
          overscan={3}
          stickyFirstColumn={true}
          enableDragDrop={true}
          enableCellDragDrop={true}
          rowRenderer={rowRenderer}
          emptyMessage="No employees found"
        />
      </div>
    </div>
  );
}

export default SimpleExample; 