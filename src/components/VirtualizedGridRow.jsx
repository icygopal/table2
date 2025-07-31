import React, { useRef, useEffect } from 'react';
import VirtualizedGridCell from './VirtualizedGridCell';
import DriverInfo from './DriverInfo';
import DraggableMoveCell from './DraggableMoveCell';
import { MIN_ROW_HEIGHT } from '../constants/tableColumns';

// Virtualized Grid Row component (non-draggable)
const VirtualizedGridRow = React.memo(({ 
  row, 
  index, 
  columnWidths,
  visibleColumns,
  visibleColumnConfigs,
  rowHeight,
  onMoveAssignment,
  stickyPositions,
  onHeightChange,
  isRowHeightMeasured
}) => {
  const rowRef = useRef(null);
  const cellRefs = useRef([]);
  const rowBackground = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
  
  // Measure individual cell heights and take maximum (only if not already measured)
  useEffect(() => {
    if (onHeightChange && isRowHeightMeasured) {
      // Check if this row already has a measured height
      if (isRowHeightMeasured(index)) {
        // Skip measurement if already measured
        return;
      }
      
      // Use a small delay to ensure all cells are rendered
      const measureCells = () => {
        requestAnimationFrame(() => {
          let maxHeight = MIN_ROW_HEIGHT;
          
          // Measure each cell and find maximum height
          cellRefs.current.forEach(cellRef => {
            if (cellRef) {
              const cellHeight = cellRef.offsetHeight;
              maxHeight = Math.max(maxHeight, cellHeight);
            }
          });
          
          if (maxHeight > MIN_ROW_HEIGHT) {
            onHeightChange(index, maxHeight);
          }
        });
      };
      
      // Measure after a short delay to ensure all cells are in DOM
      const timeoutId = setTimeout(measureCells, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [index, onHeightChange, isRowHeightMeasured]); // Removed 'row' dependency to prevent re-measuring on every row change
  
  // Create grid template columns string from columnWidths
  const gridTemplateColumns = visibleColumns.map(columnIndex => 
    `${columnWidths[columnIndex]}px`
  ).join(' ');
  
  return (
    <div
      ref={rowRef}
      style={{
        background: rowBackground,
        minHeight: MIN_ROW_HEIGHT,
        willChange: 'transform', // Optimize for animations
        contain: 'layout style', // Optimize rendering performance
        display: 'grid',
        gridTemplateColumns,
        alignItems: 'stretch', // Make all cells stretch to row height
      }}
    >
      {visibleColumns.map((columnIndex, colIndex) => {
        const column = visibleColumnConfigs[columnIndex];
        const cellKey = `${column.key}-${index}`;
        const stickyLeft = stickyPositions[columnIndex] || 0;
        return (
          <VirtualizedGridCell
            key={cellKey}
            ref={el => {
              if (el) {
                cellRefs.current[colIndex] = el;
              }
            }}
            content={
              column.key === 'driver' ? (
                <DriverInfo driver={row.driver} />
              ) : (
                <DraggableMoveCell
                  move={row[column.key]}
                  rowIndex={index}
                  columnKey={column.key}
                  onMoveAssignment={onMoveAssignment}
                />
              )
            }
            columnKey={column.key}
            rowBackground={rowBackground}
            rowHeight={rowHeight}
            isSticky={column.sticky}
            stickyLeft={stickyLeft}
          />
        );
      })}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.row === nextProps.row &&
    prevProps.index === nextProps.index &&
    prevProps.rowHeight === nextProps.rowHeight &&
    JSON.stringify(prevProps.visibleColumns) === JSON.stringify(nextProps.visibleColumns) &&
    JSON.stringify(prevProps.columnWidths) === JSON.stringify(nextProps.columnWidths) &&
    prevProps.onMoveAssignment === nextProps.onMoveAssignment &&
    prevProps.onHeightChange === nextProps.onHeightChange &&
    prevProps.isRowHeightMeasured === nextProps.isRowHeightMeasured
  );
});

VirtualizedGridRow.displayName = 'VirtualizedGridRow';

export default VirtualizedGridRow;