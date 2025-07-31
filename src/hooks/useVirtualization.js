import { useMemo } from 'react';

// Virtualization configuration
const MIN_ROW_HEIGHT = 120;
const OVERSCAN_ROWS = 8;
const OVERSCAN_COLUMNS = 1;

export const useRowVirtualization = (
  rows,
  verticalScrollTop,
  containerHeight,
  calculatedRowHeights,
  cumulativeHeights
) => {
  return useMemo(() => {
    if (!calculatedRowHeights || calculatedRowHeights.length === 0) {
      return {
        startIndex: 0,
        endIndex: Math.min(14, rows.length - 1), // Show max 15 rows (0-14)
        offsetY: 0,
        visibleRows: Array.from({ length: Math.min(15, rows.length) }, (_, i) => i)
      };
    }

    const availableHeight = containerHeight - 40; // Subtract header height
    const MAX_VISIBLE_ROWS = 15; // Limit to 15 rows
    
    // Use cumulative heights for more efficient calculation with tall rows
    let startIndex = 0;
    
    // Binary search for start index for better performance with many rows
    let low = 0;
    let high = rows.length - 1;
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const cumulativeHeight = cumulativeHeights[mid];
      
      if (cumulativeHeight <= verticalScrollTop) {
        startIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    
    // Apply overscan with bounds checking
    startIndex = Math.max(0, startIndex - OVERSCAN_ROWS);
    
    // Limit to exactly 15 rows
    let endIndex = Math.min(startIndex + MAX_VISIBLE_ROWS - 1, rows.length - 1);
    
    // Ensure we don't exceed array bounds and maintain 15 rows when possible
    if (endIndex >= rows.length - 1 && rows.length >= MAX_VISIBLE_ROWS) {
      // If we're at the end, adjust startIndex to maintain 15 rows
      startIndex = Math.max(0, rows.length - MAX_VISIBLE_ROWS);
      endIndex = rows.length - 1;
    }
    
    // Calculate offset using cumulative heights for accuracy
    const offsetY = cumulativeHeights[startIndex] || 0;
    
    return {
      startIndex,
      endIndex,
      offsetY,
      visibleRows: Array.from({ length: Math.max(0, endIndex - startIndex + 1) }, (_, i) => startIndex + i)
    };
  }, [rows.length, verticalScrollTop, containerHeight, calculatedRowHeights, cumulativeHeights]);
};

export const useColumnVirtualization = (
  totalTableWidth,
  containerWidth,
  horizontalScrollLeft,
  visibleColumnWidths,
  visibleColumnConfigs
) => {
  return useMemo(() => {
    if (totalTableWidth <= containerWidth) {
      return {
        startIndex: 0,
        endIndex: visibleColumnConfigs.length - 1,
        offsetX: 0,
      };
    }

    let currentX = 0;
    let startIndex = 0;
    let endIndex = 0;

    // Find start column
    for (let i = 0; i < visibleColumnConfigs.length; i++) {
      if (currentX + visibleColumnWidths[i] > horizontalScrollLeft) {
        startIndex = Math.max(0, i - OVERSCAN_COLUMNS);
        break;
      }
      currentX += visibleColumnWidths[i];
    }

    // Find end column - ensure we don't hide columns at the end
    currentX = 0;
    for (let i = 0; i < visibleColumnConfigs.length; i++) {
      currentX += visibleColumnWidths[i];
      if (currentX > horizontalScrollLeft + containerWidth) {
        endIndex = Math.min(visibleColumnConfigs.length - 1, i + OVERSCAN_COLUMNS);
        break;
      }
      // If we reach the end, make sure to include all remaining columns
      if (i === visibleColumnConfigs.length - 1) {
        endIndex = visibleColumnConfigs.length - 1;
      }
    }

    // Ensure all sticky columns are always included if visible
    const stickyColumnIndices = visibleColumnConfigs
      .map((col, index) => col.sticky ? index : -1)
      .filter(index => index !== -1);
    
    if (stickyColumnIndices.length > 0 && startIndex > Math.min(...stickyColumnIndices)) {
      startIndex = Math.min(...stickyColumnIndices);
    }

    // Ensure we don't hide columns when scrolling reaches the end
    if (horizontalScrollLeft + containerWidth >= totalTableWidth) {
      endIndex = visibleColumnConfigs.length - 1;
    }

    // Calculate offset for start column
    let offsetX = 0;
    for (let i = 0; i < startIndex; i++) {
      offsetX += visibleColumnWidths[i];
    }

    return {
      startIndex,
      endIndex,
      offsetX,
    };
  }, [totalTableWidth, containerWidth, horizontalScrollLeft, visibleColumnWidths, visibleColumnConfigs]);
};