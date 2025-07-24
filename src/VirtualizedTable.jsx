import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

// Default table styles that can be overridden
const DEFAULT_STYLES = {
  container: {
    height: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#fff',
  },
  scrollContainer: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
    position: 'relative',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    position: 'relative',
  },
  headerRow: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: '#f8f9fa',
  },
  headerCell: {
    padding: '12px',
    borderRight: '1px solid #dee2e6',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#495057',
    background: '#f8f9fa',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    cursor: 'pointer',
    userSelect: 'none',
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    zIndex: 150,
    borderRight: '3px solid #2196f3',
    boxShadow: '4px 0 8px rgba(33, 150, 243, 0.15)',
    fontWeight: '700',
  },
  dataRow: {
    cursor: 'grab',
    transition: 'all 0.2s ease',
  },
  dataRowDragging: {
    borderLeft: '3px solid #2196f3',
    transform: 'rotate(1deg)',
    zIndex: 1000,
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    background: '#e3f2fd',
  },
  dataRowEven: {
    background: '#ffffff',
  },
  dataRowOdd: {
    background: '#f8f9fa',
  },
  dataCell: {
    padding: '12px',
    borderRight: '1px solid #e9ecef',
    borderBottom: '1px solid #e9ecef',
    fontSize: '13px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    overflow: 'hidden',
    verticalAlign: 'middle',
  },
  endIndicator: {
    background: '#f9f9f9',
    borderTop: '2px solid #e0e0e0',
    textAlign: 'center',
    padding: '16px',
    fontSize: '14px',
    color: '#888',
  },
};

// Table header row component
const TableHeaderRow = React.memo(({ columns, styles, onSort, sortConfig, stickyFirstColumn }) => (
  <tr style={styles.headerRow}>
    {columns.map((column, index) => {
      const isFirstColumn = index === 0 && stickyFirstColumn;
      const isSortable = column.sortable !== false;
      const sortDirection = sortConfig?.key === column.key ? sortConfig.direction : null;
      
      // Use headerCellFormat if provided, otherwise use default title
      const headerContent = column.headerCellFormat 
        ? column.headerCellFormat(column, sortDirection, isSortable)
        : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {column.title}
            {isSortable && (
              <span style={{ fontSize: '10px', opacity: 0.7 }}>
                {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
              </span>
            )}
          </div>
        );
      
      return (
        <th
          key={column.key}
          onClick={isSortable ? () => onSort?.(column.key) : undefined}
          style={{
            ...styles.headerCell,
            width: column.width,
            ...(isFirstColumn && styles.stickyColumn),
            ...(isSortable && { cursor: 'pointer' }),
            ...(column.headerStyle || {}),
          }}
        >
          {headerContent}
        </th>
      );
    })}
  </tr>
));

TableHeaderRow.displayName = 'TableHeaderRow';

// Table row component with height measurement
const TableRow = React.memo(({ 
  row, 
  index, 
  provided, 
  snapshot, 
  columns,
  styles,
  onHeightChange,
  stickyFirstColumn,
  rowRenderer,
  enableCellDragDrop,
  onCellDragEnd
}) => {
  const rowRef = useRef(null);
  const isDragging = snapshot?.isDragging;
  const isEven = index % 2 === 0;

  // Measure row height and report back
  useEffect(() => {
    if (rowRef.current && onHeightChange) {
      const height = rowRef.current.offsetHeight;
      onHeightChange(index, height);
    }
  }, [index, onHeightChange, row]);

  const rowBackground = isDragging 
    ? styles.dataRowDragging?.background || '#e3f2fd'
    : isEven 
      ? styles.dataRowEven?.background || '#ffffff'
      : styles.dataRowOdd?.background || '#f8f9fa';
  
  return (
    <tr
      ref={(el) => {
        rowRef.current = el;
        if (provided?.innerRef) {
          provided.innerRef(el);
        }
      }}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      style={{
        ...styles.dataRow,
        ...(isDragging && styles.dataRowDragging),
        ...(provided?.draggableProps?.style || {}),
        background: rowBackground,
      }}
    >
      {columns.map((column, colIndex) => {
        const isFirstColumn = colIndex === 0 && stickyFirstColumn;
        
        // Determine cell content using priority: rowCellFormat > rowRenderer > default
        let cellContent;
        if (column.rowCellFormat) {
          cellContent = column.rowCellFormat(row, column, index);
        } else if (rowRenderer) {
          cellContent = rowRenderer(row, column, index);
        } else {
          cellContent = row[column.key];
        }
        
        const isComponent = React.isValidElement(cellContent);
        const cellId = `${row.id || index}-${column.key}`;
        
        if (enableCellDragDrop && !isComponent) {
          return (
            <Droppable key={column.key} droppableId={cellId} type="CELL">
              {(provided, snapshot) => (
                <Draggable draggableId={cellId} index={0}>
                  {(dragProvided, dragSnapshot) => (
                    <td
                      ref={(el) => {
                        if (provided.innerRef) provided.innerRef(el);
                        if (dragProvided.innerRef) dragProvided.innerRef(el);
                      }}
                      {...provided.droppableProps}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      style={{
                        ...styles.dataCell,
                        width: column.width,
                        minHeight: '48px',
                        verticalAlign: 'middle',
                        ...(isFirstColumn && {
                          ...styles.stickyColumn,
                          zIndex: isDragging ? 1001 : 15,
                          background: rowBackground,
                        }),
                        ...(column.cellStyle || {}),
                        ...(dragProvided.draggableProps?.style || {}),
                        ...(snapshot.isDraggingOver && {
                          background: 'rgba(33, 150, 243, 0.2)',
                          border: '2px dashed #2196f3',
                        }),
                        ...(dragSnapshot.isDragging && {
                          background: '#e3f2fd',
                          transform: `${dragProvided.draggableProps?.style?.transform || ''} rotate(2deg)`,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                          zIndex: 1002,
                        }),
                      }}
                    >
                      <div style={{ 
                        padding: '8px',
                        cursor: 'grab',
                        userSelect: 'none',
                        ...(dragSnapshot.isDragging && { cursor: 'grabbing' }),
                      }}>
                        {cellContent}
                      </div>
                      {provided.placeholder}
                    </td>
                  )}
                </Draggable>
              )}
            </Droppable>
          );
        }
        
        return (
          <td
            key={column.key}
            style={{
              ...styles.dataCell,
              width: column.width,
              minHeight: isComponent ? '60px' : '48px',
              verticalAlign: isComponent ? 'top' : 'middle',
              ...(isFirstColumn && {
                ...styles.stickyColumn,
                zIndex: isDragging ? 1001 : 15,
                background: rowBackground,
              }),
              ...(column.cellStyle || {}),
            }}
          >
            <div style={{ 
              width: '100%',
              ...(isComponent && { paddingTop: '4px' })
            }}>
              {cellContent}
            </div>
          </td>
        );
      })}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

// Main VirtualizedTable component
const VirtualizedTable = ({
  columns = [],
  data = [],
  onSort,
  onDragEnd,
  onCellDragEnd,
  styles: customStyles = {},
  height = '100%',
  estimatedRowHeight = 80,
  overscan = 5,
  stickyFirstColumn = true,
  enableDragDrop = false,
  enableCellDragDrop = false,
  sortConfig = null,
  rowRenderer = null,
  containerProps = {},
  tableProps = {},
  emptyMessage = "No data available",
  endMessage = null,
  showEndIndicator = true,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const scrollContainerRef = useRef(null);
  const rowHeights = useRef(new Map());

  // Merge custom styles with defaults
  const styles = useMemo(() => {
    const merged = { ...DEFAULT_STYLES };
    Object.keys(customStyles).forEach(key => {
      merged[key] = { ...merged[key], ...customStyles[key] };
    });
    return merged;
  }, [customStyles]);

  // Calculate total table width
  const totalWidth = useMemo(() => 
    columns.reduce((sum, col) => sum + (col.width || 150), 0), 
    [columns]
  );

  // Calculate visible row range for virtualization
  const visibleRange = useMemo(() => {
    if (!containerHeight || data.length === 0) {
      return { startIndex: 0, endIndex: Math.min(10, data.length - 1), beforeHeight: 0, afterHeight: 0 };
    }

    let currentHeight = 0;
    let startIndex = 0;
    let endIndex = 0;

    // Find start index
    for (let i = 0; i < data.length; i++) {
      const rowHeight = rowHeights.current.get(i) || estimatedRowHeight;
      if (currentHeight + rowHeight > scrollTop) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      currentHeight += rowHeight;
    }

    // Find end index
    currentHeight = 0;
    for (let i = 0; i < data.length; i++) {
      const rowHeight = rowHeights.current.get(i) || estimatedRowHeight;
      currentHeight += rowHeight;
      if (currentHeight > scrollTop + containerHeight + (overscan * estimatedRowHeight)) {
        endIndex = Math.min(data.length - 1, i + overscan);
        break;
      }
    }

    if (endIndex === 0) endIndex = data.length - 1;

    // Calculate spacer heights
    let beforeHeight = 0;
    for (let i = 0; i < startIndex; i++) {
      beforeHeight += rowHeights.current.get(i) || estimatedRowHeight;
    }

    let afterHeight = 0;
    for (let i = endIndex + 1; i < data.length; i++) {
      afterHeight += rowHeights.current.get(i) || estimatedRowHeight;
    }

    return { startIndex, endIndex, beforeHeight, afterHeight };
  }, [scrollTop, containerHeight, data.length, estimatedRowHeight, overscan]);

  // Set row height in cache
  const setRowHeight = useCallback((index, height) => {
    rowHeights.current.set(index, height);
  }, []);

  // Handle scroll events
  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  // Handle container resize
  const handleContainerResize = useCallback(() => {
    if (scrollContainerRef.current) {
      const rect = scrollContainerRef.current.getBoundingClientRect();
      setContainerHeight(rect.height);
    }
  }, []);

  // Set up resize observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    handleContainerResize();

    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(handleContainerResize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', handleContainerResize);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleContainerResize);
      }
    };
  }, [handleContainerResize]);

  // Virtualized table rows component
  const VirtualizedTableRows = useCallback(() => {
    const { startIndex, endIndex, beforeHeight, afterHeight } = visibleRange;
    const visibleRows = data.slice(startIndex, endIndex + 1);

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} style={styles.endIndicator}>
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return (
      <>
        {/* Spacer for rows before visible range */}
        {beforeHeight > 0 && (
          <tr style={{ height: beforeHeight }}>
            <td colSpan={columns.length} style={{ padding: 0, border: 'none' }} />
          </tr>
        )}
        
        {/* Render visible rows */}
        {visibleRows.map((row, relativeIndex) => {
          const actualIndex = startIndex + relativeIndex;
          const rowElement = (
            <TableRow
              key={row.id || actualIndex}
              row={row}
              index={actualIndex}
              columns={columns}
              styles={styles}
              onHeightChange={setRowHeight}
              stickyFirstColumn={stickyFirstColumn}
              rowRenderer={rowRenderer}
              enableCellDragDrop={enableCellDragDrop}
              onCellDragEnd={onCellDragEnd}
            />
          );

          if (enableDragDrop && !enableCellDragDrop) {
            return (
              <Draggable 
                key={row.id || actualIndex} 
                draggableId={String(row.id || actualIndex)} 
                index={actualIndex}
                type="ROW"
              >
                {(provided, snapshot) => 
                  React.cloneElement(rowElement, { provided, snapshot })
                }
              </Draggable>
            );
          }

          return rowElement;
        })}

        {/* Spacer for rows after visible range */}
        {afterHeight > 0 && (
          <tr style={{ height: afterHeight }}>
            <td colSpan={columns.length} style={{ padding: 0, border: 'none' }} />
          </tr>
        )}
        
        {/* End indicator */}
        {showEndIndicator && endIndex >= data.length - 1 && data.length > 0 && (
          <tr style={styles.endIndicator}>
            <td
              style={{
                ...styles.dataCell,
                width: columns[0]?.width,
                ...(stickyFirstColumn && styles.stickyColumn),
                ...styles.endIndicator,
                fontWeight: '600',
              }}
            >
              End
            </td>
            <td
              colSpan={columns.length - 1}
              style={styles.endIndicator}
            >
              {endMessage || (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '4px',
                }}>
                  <span style={{ fontSize: '16px' }}>🎉</span>
                  <span style={{ fontWeight: '500' }}>You've reached the end!</span>
                  <span style={{ fontSize: '12px', color: '#aaa' }}>
                    Showing {startIndex + 1}-{Math.min(endIndex + 1, data.length)} of {data.length} items
                  </span>
                </div>
              )}
            </td>
          </tr>
        )}
      </>
    );
      }, [data, columns, visibleRange, styles, setRowHeight, stickyFirstColumn, enableDragDrop, enableCellDragDrop, rowRenderer, onCellDragEnd, emptyMessage, endMessage, showEndIndicator]);





  const needsHorizontalScroll = totalWidth > (containerHeight || 1120);

  const tableContent = (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      style={{
        ...styles.scrollContainer,
        height,
        overflowX: needsHorizontalScroll ? 'auto' : 'hidden',
        cursor: needsHorizontalScroll ? 'grab' : 'default',
        // Enhanced scroll shadows for sticky column
        background: needsHorizontalScroll 
          ? 'linear-gradient(90deg, rgba(33,150,243,0.1) 0%, transparent 30px), linear-gradient(-90deg, rgba(0,0,0,0.1) 0%, transparent 20px)'
          : 'transparent',
        backgroundAttachment: 'local, local',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '30px 100%, 20px 100%',
        backgroundPosition: 'left, right',
      }}
      {...containerProps}
    >
      <div style={{ 
        minWidth: totalWidth,
        position: 'relative',
      }}>
        <table 
          style={styles.table}
          {...tableProps}
        >
          <thead>
            <TableHeaderRow 
              columns={columns} 
              styles={styles} 
              onSort={onSort}
              sortConfig={sortConfig}
              stickyFirstColumn={stickyFirstColumn}
            />
          </thead>
          {enableDragDrop && !enableCellDragDrop ? (
            <Droppable droppableId="table-body" type="ROW">
              {(provided, snapshot) => (
                <tbody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
                  }}
                >
                  <VirtualizedTableRows />
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          ) : (
            <tbody>
              <VirtualizedTableRows />
            </tbody>
          )}
        </table>
      </div>
    </div>
  );

  // Combined drag end handler for both rows and cells
  const handleDragEnd = useCallback((result) => {
    const { source, destination, type } = result;
    
    if (!destination) return;
    
    if (type === 'CELL') {
      // Handle cell drag and drop
      if (onCellDragEnd && source.droppableId !== destination.droppableId) {
        onCellDragEnd(result);
      }
    } else if (type === 'ROW') {
      // Handle row drag and drop
      if (onDragEnd && source.index !== destination.index) {
        onDragEnd(result);
      }
    }
  }, [onDragEnd, onCellDragEnd]);

  if (enableDragDrop || enableCellDragDrop) {
    return (
      <div style={{ ...styles.container, height }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          {tableContent}
        </DragDropContext>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, height }}>
      {tableContent}
    </div>
  );
};

export default VirtualizedTable; 