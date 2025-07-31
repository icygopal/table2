import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AutoSizer from './AutoSizer';
import VirtualizedGridHeader from './VirtualizedGridHeader';
import VirtualizedGridRow from './VirtualizedGridRow';
import NoDataMessage from './NoDataMessage';
import LoadingIndicator from './LoadingIndicator';
import ControlButtons from './ControlButtons';
import { generateTableData } from '../utils/tableDataGenerator';
import { useScrollAndResize } from '../hooks/useScrollAndResize';
import { useRowHeights } from '../hooks/useRowHeights';
import { useColumns } from '../hooks/useColumns';
import { useRowVirtualization, useColumnVirtualization } from '../hooks/useVirtualization';
import { useVisibleColumns, useVisibleRows } from '../hooks/useVisibleItems';

const VirtualizedTable = () => {
  // Table data state
  const [rows, setRows] = useState(() => generateTableData(0, 30));
  const [tableVersion, setTableVersion] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Update table version when rows change to trigger re-render with stable keys
  useEffect(() => {
    setTableVersion(prev => prev + 1);
  }, [rows]);

  const loadMoreData = useCallback(() => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newRows = generateTableData(rows.length, 30);
      setRows(prevRows => [...prevRows, ...newRows]);
      setIsLoadingMore(false);
    }, 500);
  }, [rows.length, isLoadingMore]);

  const clearData = useCallback(() => {
    setRows([]);
  }, []);

  const loadData = useCallback(() => {
    setRows(generateTableData(0, 30));
  }, []);

  const handleMoveAssignment = useCallback((sourceRowIndex, sourceColumnKey, targetRowIndex, targetColumnKey) => {
    console.log('Moving assignment:', { sourceRowIndex, sourceColumnKey, targetRowIndex, targetColumnKey });
    
    setRows(prevRows => {
      const newRows = [...prevRows];
      const sourceMove = newRows[sourceRowIndex][sourceColumnKey];
      const targetMove = newRows[targetRowIndex][targetColumnKey];

      console.log('Source move:', sourceMove);
      console.log('Target move:', targetMove);

      // If dropping on an empty cell, move the assignment
      if (!targetMove) {
        newRows[sourceRowIndex] = {
          ...newRows[sourceRowIndex],
          [sourceColumnKey]: null
        };
        newRows[targetRowIndex] = {
          ...newRows[targetRowIndex],
          [targetColumnKey]: {
            ...sourceMove,
            assignedDriver: newRows[targetRowIndex].driver.id,
          }
        };
      } else {
        // If dropping on another move, swap them
        newRows[sourceRowIndex] = {
          ...newRows[sourceRowIndex],
          [sourceColumnKey]: {
            ...targetMove,
            assignedDriver: newRows[sourceRowIndex].driver.id,
          }
        };
        newRows[targetRowIndex] = {
          ...newRows[targetRowIndex],
          [targetColumnKey]: {
            ...sourceMove,
            assignedDriver: newRows[targetRowIndex].driver.id,
          }
        };
      }

      console.log('Updated rows:', newRows);
      return newRows;
    });
  }, []);

  const {
    containerWidth,
    containerHeight,
    horizontalScrollLeft,
    verticalScrollTop,
    scrollContainerRef,
    handleResize,
    handleScroll
  } = useScrollAndResize(loadMoreData, isLoadingMore);

  const {
    setRowHeight,
    isRowHeightMeasured,
    calculatedRowHeights,
    cumulativeHeights
  } = useRowHeights(rows);

  const {
    showDriverColumn,
    setShowDriverColumn,
    visibleColumnConfigs,
    visibleColumnWidths,
    totalTableWidth,
    stickyPositions
  } = useColumns(containerWidth);

  // Virtualization
  const rowVirtualization = useRowVirtualization(
    rows,
    verticalScrollTop,
    containerHeight,
    calculatedRowHeights,
    cumulativeHeights
  );

  const columnVirtualization = useColumnVirtualization(
    totalTableWidth,
    containerWidth,
    horizontalScrollLeft,
    visibleColumnWidths,
    visibleColumnConfigs
  );

  // Visible items
  const visibleColumns = useVisibleColumns(
    columnVirtualization,
    horizontalScrollLeft,
    containerWidth,
    totalTableWidth,
    visibleColumnConfigs
  );

  const visibleRows = useVisibleRows(rowVirtualization);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        height: 'calc(100vh - 100px)', 
        width: '100vw',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#ffffff',
        overflow: 'hidden',
      }}>
        <ControlButtons
          showDriverColumn={showDriverColumn}
          setShowDriverColumn={setShowDriverColumn}
          onClearData={clearData}
          onLoadData={loadData}
        />
        
        <div style={{ height: 'calc(100vh - 100px)', background: '#fff' }}>
          <AutoSizer onResize={handleResize}>
            {({ width, height }) => {
              const needsHorizontalScroll = totalTableWidth > width;
              
              return (
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  style={{ 
                    width, 
                    height,
                    overflowX: needsHorizontalScroll ? 'auto' : 'hidden',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth',
                    position: 'relative',
                  }}
                >
                  <div style={{ 
                    width: Math.max(width, totalTableWidth),
                    height: cumulativeHeights[rows.length] + 40, // Total height including header
                    position: 'relative',
                    minWidth: totalTableWidth, // Ensure minimum width to show all columns
                  }}>
                    <div
                      style={{
                        width: Math.max(width, totalTableWidth),
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <VirtualizedGridHeader 
                        columnWidths={visibleColumnWidths} 
                        visibleColumns={visibleColumns}
                        horizontalScrollLeft={horizontalScrollLeft}
                        visibleColumnConfigs={visibleColumnConfigs}
                        stickyPositions={stickyPositions}
                      />
                      <div>
                        {/* No data message */}
                        {rows.length === 0 ? (
                          <NoDataMessage />
                        ) : (
                          <>
                            {/* Spacer row for virtualized content above */}
                            {rowVirtualization.startIndex > 0 && (
                              <div
                                style={{ 
                                  height: rowVirtualization.offsetY,
                                  padding: 0,
                                }}
                              />
                            )}
                            
                            {/* Visible rows */}
                            {visibleRows.map((rowIndex) => {
                              const row = rows[rowIndex];
                              // Create a stable, simple key without expensive JSON serialization
                              const rowKey = `row-${row.id}-${rowIndex}-v${tableVersion}`;
                              return (
                                <VirtualizedGridRow
                                  key={rowKey}
                                  row={row}
                                  index={rowIndex}
                                  columnWidths={visibleColumnWidths}
                                  visibleColumns={visibleColumns}
                                  visibleColumnConfigs={visibleColumnConfigs}
                                  rowHeight={calculatedRowHeights[rowIndex]}
                                  onMoveAssignment={handleMoveAssignment}
                                  stickyPositions={stickyPositions}
                                  onHeightChange={setRowHeight}
                                  isRowHeightMeasured={isRowHeightMeasured}
                                />
                              );
                            })}
                            
                            {/* Loading indicator */}
                            {isLoadingMore && <LoadingIndicator />}
                            
                            {/* Spacer row for virtualized content below */}
                            {rowVirtualization.endIndex < rows.length - 1 && (
                              <div
                                style={{ 
                                  height: cumulativeHeights[rows.length] - cumulativeHeights[rowVirtualization.endIndex + 1],
                                  padding: 0,
                                }}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    </DndProvider>
  );
};

export default VirtualizedTable;