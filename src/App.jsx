import React, { useState, useCallback } from 'react';
import VirtualizedTable from './VirtualizedTable';

// Sample description components
const DescriptionComponents = {
  ProductFeatures: ({ features }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ fontWeight: '500', marginBottom: '2px' }}>Features:</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {features.map((feature, idx) => (
          <span
            key={idx}
            style={{
              background: '#e3f2fd',
              color: '#1976d2',
              padding: '2px 6px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500',
            }}
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  ),

  StatusWithProgress: ({ text, progress, color = '#4caf50' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ fontSize: '13px' }}>{text}</div>
      <div style={{ 
        width: '100%', 
        height: '4px', 
        background: '#f0f0f0', 
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: color,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ fontSize: '11px', color: '#666' }}>{progress}% complete</div>
    </div>
  ),

  ImageWithText: ({ image, text, alt }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        background: `linear-gradient(135deg, ${image.color1}, ${image.color2})`,
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0,
      }}>
        {image.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', lineHeight: '1.3' }}>{text}</div>
      </div>
    </div>
  ),

  InteractiveRating: ({ rating, maxRating = 5, onRate }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span
            key={i}
            style={{
              cursor: 'pointer',
              fontSize: '14px',
              color: i < rating ? '#ffc107' : '#e0e0e0',
              transition: 'color 0.2s ease',
            }}
            onClick={() => onRate && onRate(i + 1)}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ★
          </span>
        ))}
        <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
          {rating}/{maxRating}
        </span>
      </div>
    </div>
  ),

  ActionButtons: ({ actions }) => (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={action.onClick}
          style={{
            padding: '4px 8px',
            border: `1px solid ${action.color || '#ddd'}`,
            borderRadius: '4px',
            background: action.primary ? (action.color || '#2196f3') : 'transparent',
            color: action.primary ? 'white' : (action.color || '#333'),
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!action.primary) {
              e.target.style.background = action.color || '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (!action.primary) {
              e.target.style.background = 'transparent';
            }
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
};

// Generate sample data with React components
const generateTableData = () => {
  const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'David Wilson', 'Sarah Brown', 'Chris Lee', 'Amanda Taylor'];
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Health', 'Automotive'];
  const statuses = ['Active', 'Pending', 'Completed', 'On Hold', 'Cancelled'];
  
  const descriptionTypes = ['features', 'progress', 'image', 'rating', 'actions', 'text'];
  const sampleFeatures = [
    ['Wireless', 'Bluetooth', 'Waterproof'],
    ['Organic', 'Fair Trade', 'Eco-Friendly'],
    ['Premium', 'Limited Edition', 'Handcrafted'],
    ['Smart', 'Voice Control', 'App Connected'],
    ['Lightweight', 'Durable', 'Portable'],
  ];
  const sampleImages = [
    { icon: '📱', color1: '#e3f2fd', color2: '#bbdefb' },
    { icon: '👕', color1: '#f3e5f5', color2: '#ce93d8' },
    { icon: '📚', color1: '#e8f5e8', color2: '#a5d6a7' },
    { icon: '🏠', color1: '#fff3e0', color2: '#ffcc02' },
    { icon: '⚽', color1: '#ffebee', color2: '#ef5350' },
  ];

  return Array.from({ length: 1000 }, (_, i) => {
    const descType = descriptionTypes[i % descriptionTypes.length];
    let description;

    switch (descType) {
      case 'features':
        description = <DescriptionComponents.ProductFeatures features={sampleFeatures[i % sampleFeatures.length]} />;
        break;
      case 'progress':
        description = (
          <DescriptionComponents.StatusWithProgress 
            text="Project completion status"
            progress={Math.floor(Math.random() * 100)}
            color={['#4caf50', '#ff9800', '#2196f3', '#9c27b0'][i % 4]}
          />
        );
        break;
      case 'image':
        description = (
          <DescriptionComponents.ImageWithText 
            image={sampleImages[i % sampleImages.length]}
            text="This is a detailed description with an icon and comprehensive information about the item"
            alt="Product image"
          />
        );
        break;
      case 'rating':
        description = (
          <DescriptionComponents.InteractiveRating 
            rating={Math.floor(Math.random() * 5) + 1}
            onRate={(rating) => console.log('Rated:', rating)}
          />
        );
        break;
      case 'actions':
        description = (
          <DescriptionComponents.ActionButtons 
            actions={[
              { label: 'Edit', color: '#2196f3', onClick: () => console.log('Edit clicked') },
              { label: 'Delete', color: '#f44336', onClick: () => console.log('Delete clicked') },
              { label: 'Share', onClick: () => console.log('Share clicked') },
            ]}
          />
        );
        break;
      default:
        description = 'This is a standard text description that provides basic information about the item without any interactive components.';
    }

    return {
      id: `ITM-${String(i + 1).padStart(3, '0')}`,
      name: names[i % names.length] + (i > 7 ? ` ${Math.floor(i / 8)}` : ''),
      description,
      category: categories[i % categories.length],
      status: statuses[i % statuses.length],
      date: new Date(2023, (i % 12), (i % 28) + 1).toLocaleDateString(),
      priority: Math.floor(Math.random() * 10) + 1, // For sorting demo
    };
  });
};

// Custom hook for sorting functionality
const useSorting = (initialData) => {
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle React components by extracting text content
      if (React.isValidElement(aValue)) {
        aValue = key; // Fallback to key name for components
      }
      if (React.isValidElement(bValue)) {
        bValue = key; // Fallback to key name for components
      }

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

  const updateData = useCallback((newData) => {
    setData(newData);
  }, []);

  return { data, sortConfig, handleSort, updateData };
};

// Table column configuration with custom formatters
const COLUMNS = [
  { 
    key: 'id', 
    title: 'ID', 
    width: 100,
    sortable: true,
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '16px' }}>🏷️</span>
        <span>{column.title}</span>
        {isSortable && (
          <span style={{ 
            fontSize: '10px', 
            color: sortDirection ? '#1976d2' : '#666',
            fontWeight: 'bold'
          }}>
            {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '↕'}
          </span>
        )}
      </div>
    ),
    rowCellFormat: (row, column, index) => (
      <span style={{
        fontFamily: 'monospace',
        background: '#e8f5e9',
        color: '#2e7d32',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600',
      }}>
        {row.id}
      </span>
    ),
  },
  { 
    key: 'name', 
    title: 'Name', 
    width: 200,
    sortable: true,
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '16px' }}>👤</span>
        <span>{column.title}</span>
        {isSortable && (
          <span style={{ 
            fontSize: '10px', 
            color: sortDirection ? '#1976d2' : '#666',
            fontWeight: 'bold'
          }}>
            {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '↕'}
          </span>
        )}
      </div>
    ),
    rowCellFormat: (row, column, index) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index % 5]}, ${['#FF8E53', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E'][index % 5]})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
        }}>
          {row.name.charAt(0)}
        </div>
        <span style={{ fontWeight: '500' }}>{row.name}</span>
      </div>
    ),
  },
  { 
    key: 'description', 
    title: 'Description ⚡', 
    width: 400,
    sortable: false, // Can't sort interactive components easily
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '16px' }}>📄</span>
        <span>{column.title}</span>
        <span style={{ 
          fontSize: '9px', 
          background: '#ff9800',
          color: 'white',
          padding: '1px 4px',
          borderRadius: '6px',
          fontWeight: '600'
        }}>
          INTERACTIVE
        </span>
      </div>
    ),
  },
  { 
    key: 'category', 
    title: 'Category', 
    width: 150,
    sortable: true,
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '16px' }}>📂</span>
        <span>{column.title}</span>
        {isSortable && (
          <span style={{ 
            fontSize: '10px', 
            color: sortDirection ? '#1976d2' : '#666',
            fontWeight: 'bold'
          }}>
            {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '↕'}
          </span>
        )}
      </div>
    ),
    rowCellFormat: (row, column, index) => {
      const categoryColors = {
        'Electronics': '#2196F3',
        'Clothing': '#E91E63',
        'Books': '#4CAF50',
        'Home & Garden': '#FF9800',
        'Sports': '#9C27B0',
        'Health': '#00BCD4',
        'Automotive': '#FF5722',
      };
      
      return (
        <span style={{
          background: categoryColors[row.category] || '#757575',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
        }}>
          {row.category}
        </span>
      );
    },
  },
  { 
    key: 'status', 
    title: 'Status', 
    width: 120,
    sortable: true,
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '16px' }}>🚦</span>
        <span>{column.title}</span>
        {isSortable && (
          <span style={{ 
            fontSize: '10px', 
            color: sortDirection ? '#1976d2' : '#666',
            fontWeight: 'bold'
          }}>
            {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '↕'}
          </span>
        )}
      </div>
    ),
    rowCellFormat: (row, column, index) => {
      const statusConfig = {
        'Active': { color: '#4CAF50', icon: '✅' },
        'Pending': { color: '#FF9800', icon: '⏳' },
        'Completed': { color: '#2196F3', icon: '🎉' },
        'On Hold': { color: '#9E9E9E', icon: '⏸️' },
        'Cancelled': { color: '#F44336', icon: '❌' },
      };
      
      const config = statusConfig[row.status] || { color: '#757575', icon: '❓' };
      
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{config.icon}</span>
          <span style={{
            color: config.color,
            fontWeight: '600',
            fontSize: '12px',
          }}>
            {row.status}
          </span>
        </div>
      );
    },
  },
  { 
    key: 'date', 
    title: 'Date', 
    width: 150,
    sortable: true,
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '16px' }}>📅</span>
        <span>{column.title}</span>
        {isSortable && (
          <span style={{ 
            fontSize: '10px', 
            color: sortDirection ? '#1976d2' : '#666',
            fontWeight: 'bold'
          }}>
            {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '↕'}
          </span>
        )}
      </div>
    ),
    rowCellFormat: (row, column, index) => (
      <span style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#1976d2',
        fontWeight: '500',
      }}>
        {row.date}
      </span>
    ),
  },
  { 
    key: 'priority', 
    title: 'Priority', 
    width: 100,
    sortable: true,
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '16px' }}>⭐</span>
        <span>{column.title}</span>
        {isSortable && (
          <span style={{ 
            fontSize: '10px', 
            color: sortDirection ? '#1976d2' : '#666',
            fontWeight: 'bold'
          }}>
            {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '↕'}
          </span>
        )}
      </div>
    ),
    rowCellFormat: (row, column, index) => {
      const priority = row.priority;
      const color = priority <= 3 ? '#4CAF50' : priority <= 6 ? '#FF9800' : '#F44336';
      const stars = '★'.repeat(Math.min(priority, 10));
      
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color, fontSize: '12px' }}>{stars}</span>
          <span style={{ fontSize: '11px', color: '#666' }}>({priority})</span>
        </div>
      );
    },
  },
];

// Custom styles for the table
const customStyles = {
  container: {
    background: '#f5f5f5',
  },
  headerCell: {
    background: '#e3f2fd',
    color: '#1565c0',
    fontWeight: '700',
    borderBottom: '3px solid #1976d2',
  },
  stickyColumn: {
    borderRight: '3px solid #1976d2',
    boxShadow: '4px 0 8px rgba(25, 118, 210, 0.15)',
  },
  dataRowEven: {
    background: '#ffffff',
  },
  dataRowOdd: {
    background: '#fafafa',
  },
};

function App() {
  const initialData = generateTableData();
  const { data, sortConfig, handleSort, updateData } = useSorting(initialData);

  // Handle row drag and drop
  const handleDragEnd = useCallback((result) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    const newData = Array.from(data);
    const [removed] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, removed);
    
    updateData(newData);
  }, [data, updateData]);

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
    
    updateData(newData);
  }, [data, updateData]);

  // Custom row renderer (optional - you can also just use the default)
  const rowRenderer = useCallback((row, column, index) => {
    // You can customize how specific cells are rendered here
    // For now, just return the default content
    return row[column.key];
  }, []);

  return (
    <div style={{ 
      height: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f5f5f5',
    }}>
      <div style={{
        padding: '20px',
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div>
          <h1 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#333',
          }}>
            Reusable Virtualized Table Component
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#666', 
            fontSize: '14px',
          }}>
            Drag rows to reorder • Drag cells to swap data • Click headers to sort • {data.length} items total • Custom header & cell formatters • Custom virtualization • Sticky first column • Interactive components • Fully configurable
          </p>
        </div>
      </div>
      
      <div style={{ height: 'calc(100vh - 100px)' }}>
        <VirtualizedTable
          columns={COLUMNS}
          data={data}
          onSort={handleSort}
          onDragEnd={handleDragEnd}
          onCellDragEnd={handleCellDragEnd}
          sortConfig={sortConfig}
          styles={customStyles}
          height="100%"
          estimatedRowHeight={80}
          overscan={5}
          stickyFirstColumn={true}
          enableDragDrop={true}
          enableCellDragDrop={true}
          rowRenderer={rowRenderer}
          emptyMessage="No data found"
          showEndIndicator={true}
        />
      </div>
    </div>
  );
}

export default App;
