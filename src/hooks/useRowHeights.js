import { useRef, useState, useCallback, useMemo, useEffect } from 'react';

const MIN_ROW_HEIGHT = 120;

export const useRowHeights = (rows) => {
  const rowHeights = useRef(new Map());
  const [heightsUpdated, setHeightsUpdated] = useState(0);

  // Set row height in cache with debouncing to prevent flickering
  const setRowHeight = useCallback((index, height) => {
    const currentHeight = rowHeights.current.get(index);
    if (currentHeight !== height) {
      rowHeights.current.set(index, height);
      
      // Debounce height updates to prevent rapid re-renders during scrolling
      clearTimeout(window.heightUpdateTimer);
      window.heightUpdateTimer = setTimeout(() => {
        setHeightsUpdated(prev => prev + 1);
      }, 16); // ~60fps
    }
  }, []);

  // Check if row height is already measured
  const isRowHeightMeasured = useCallback((index) => {
    const height = rowHeights.current.get(index);
    return height && height > MIN_ROW_HEIGHT;
  }, []);

  // Calculate row heights using stored heights from useRef Map
  const calculatedRowHeights = useMemo(() => {
    return rows.map((row, index) => {
      return rowHeights.current.get(index) || MIN_ROW_HEIGHT;
    });
  }, [rows, heightsUpdated]);

  // Calculate cumulative heights for virtualization
  const cumulativeHeights = useMemo(() => {
    const cumulative = [0];
    calculatedRowHeights.forEach((height, index) => {
      cumulative[index + 1] = cumulative[index] + height;
    });
    return cumulative;
  }, [calculatedRowHeights]);

  // Clear height cache when rows change significantly
  useEffect(() => {
    const currentRowCount = rowHeights.current.size;
    if (rows.length < currentRowCount) {
      // Data was reset or reduced, clear cache
      rowHeights.current.clear();
      setHeightsUpdated(prev => prev + 1);
    }
    // If rows increased, keep existing measurements
  }, [rows]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(window.heightUpdateTimer);
    };
  }, []);

  return {
    setRowHeight,
    isRowHeightMeasured,
    calculatedRowHeights,
    cumulativeHeights
  };
};