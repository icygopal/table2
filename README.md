# VirtualizedTable Component

A highly performant, reusable React table component with virtualization, drag & drop, sorting, and sticky columns.

## Features

✅ **Custom Virtualization** - Only renders visible rows for optimal performance  
✅ **Row Drag & Drop** - Reorder rows with react-beautiful-dnd  
✅ **Column Sorting** - Click headers to sort data  
✅ **Sticky Header** - Header stays visible while scrolling  
✅ **Sticky First Column** - First column stays fixed during horizontal scroll  
✅ **Configurable Styling** - Override default styles  
✅ **Fixed Column Widths** - Predictable layout  
✅ **Interactive Components** - Render React components in cells  
✅ **Custom Cell Formatters** - Column-level and global row rendering  
✅ **TypeScript Ready** - (with prop types)  

## Basic Usage

```jsx
import VirtualizedTable from './VirtualizedTable';

const columns = [
  { key: 'id', title: 'ID', width: 100, sortable: true },
  { key: 'name', title: 'Name', width: 200, sortable: true },
  { key: 'email', title: 'Email', width: 300, sortable: true },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

function MyTable() {
  const handleDragEnd = (result) => {
    // Handle row reordering
  };

  const handleSort = (columnKey) => {
    // Handle column sorting
  };

  return (
    <VirtualizedTable
      columns={columns}
      data={data}
      onDragEnd={handleDragEnd}
      onSort={handleSort}
      height="500px"
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `Array<Column>` | Column configuration array |
| `data` | `Array<Object>` | Data array to display |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDragEnd` | `function` | `undefined` | Drag end callback for row reordering |
| `onSort` | `function` | `undefined` | Column sort callback |
| `sortConfig` | `object` | `null` | Current sort configuration `{key, direction}` |
| `styles` | `object` | `{}` | Custom style overrides |
| `height` | `string` | `'100%'` | Table container height |
| `estimatedRowHeight` | `number` | `80` | Estimated row height for virtualization |
| `overscan` | `number` | `5` | Extra rows to render outside viewport |
| `stickyFirstColumn` | `boolean` | `true` | Enable sticky first column |
| `enableDragDrop` | `boolean` | `false` | Enable row drag and drop |
| `rowRenderer` | `function` | `null` | Custom row content renderer |
| `containerProps` | `object` | `{}` | Props for scroll container |
| `tableProps` | `object` | `{}` | Props for table element |
| `emptyMessage` | `string` | `"No data available"` | Message when no data |
| `endMessage` | `string\|node` | `null` | Custom end indicator content |
| `showEndIndicator` | `boolean` | `true` | Show end of data indicator |

## Column Configuration

```jsx
const column = {
  key: 'id',                    // Data property key
  title: 'ID',                  // Header display text
  width: 100,                   // Fixed column width in pixels
  sortable: true,               // Enable sorting (default: true)
  headerStyle: {},              // Custom header cell styles
  cellStyle: {},                // Custom data cell styles
  headerCellFormat: (column, sortDirection, isSortable) => {}, // Custom header content
  rowCellFormat: (row, column, index) => {},                   // Custom cell content with row data
};
```

### Column Formatting Functions

**`headerCellFormat(column, sortDirection, isSortable)`**
- `column`: The column configuration object
- `sortDirection`: Current sort direction ('asc', 'desc', or null)
- `isSortable`: Boolean indicating if the column is sortable
- Returns: React element or string for header content

**`rowCellFormat(row, column, index)`**
- `row`: The complete row data object
- `column`: The column configuration object  
- `index`: Row index
- Returns: React element or string for cell content

## Custom Styling

Override default styles by passing a `styles` object:

```jsx
const customStyles = {
  container: {
    background: '#f5f5f5',
    border: '1px solid #ddd',
  },
  headerCell: {
    background: '#e3f2fd',
    color: '#1565c0',
    fontWeight: '700',
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
  dataCell: {
    padding: '8px 12px',
    fontSize: '14px',
  },
  endIndicator: {
    background: '#f9f9f9',
    color: '#666',
  },
};

<VirtualizedTable styles={customStyles} ... />
```

## Available Style Keys

- `container` - Main container div
- `scrollContainer` - Scrollable container
- `table` - Table element
- `headerRow` - Header row
- `headerCell` - Header cells
- `stickyColumn` - Sticky column styling
- `dataRow` - Data rows
- `dataRowDragging` - Dragging row state
- `dataRowEven` - Even rows
- `dataRowOdd` - Odd rows
- `dataCell` - Data cells
- `endIndicator` - End of data indicator


## Row Drag & Drop

Enable row reordering with drag and drop:

```jsx
const [data, setData] = useState(initialData);

const handleDragEnd = (result) => {
  if (!result.destination) return;
  
  const newData = Array.from(data);
  const [removed] = newData.splice(result.source.index, 1);
  newData.splice(result.destination.index, 0, removed);
  
  setData(newData);
};

<VirtualizedTable
  data={data}
  onDragEnd={handleDragEnd}
  enableDragDrop={true}
/>
```

### Drag & Drop Features

- **Visual Feedback**: Rows tilt and highlight when being dragged
- **Sticky Column Support**: First column maintains sticky positioning during drag
- **Smooth Animations**: Powered by react-beautiful-dnd
- **Touch Support**: Works on mobile devices

## Column Sorting

Implement sorting with the built-in sort indicators:

```jsx
const [sortConfig, setSortConfig] = useState(null);

const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig?.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  
  const sortedData = [...data].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  setData(sortedData);
  setSortConfig({ key, direction });
};

<VirtualizedTable
  data={data}
  onSort={handleSort}
  sortConfig={sortConfig}
/>
```

## Column Cell Formatting

### Using rowCellFormat (Recommended)

Use `rowCellFormat` in column configuration for per-column customization:

```jsx
const columns = [
  {
    key: 'status',
    title: 'Status',
    width: 120,
    rowCellFormat: (row, column, index) => (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        background: row.status === 'active' ? '#4caf50' : '#f44336',
        color: 'white',
        fontSize: '12px',
        fontWeight: '500',
      }}>
        {row.status}
      </span>
    ),
  },
  {
    key: 'salary',
    title: 'Salary',
    width: 120,
    rowCellFormat: (row, column, index) => 
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.salary),
  },
];
```

### Using headerCellFormat

Customize header appearance and behavior:

```jsx
const columns = [
  {
    key: 'name',
    title: 'Employee Name',
    width: 200,
    headerCellFormat: (column, sortDirection, isSortable) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>👤</span>
        <span>{column.title}</span>
        {isSortable && (
          <span style={{ 
            fontSize: '12px', 
            color: sortDirection ? '#2196f3' : '#999' 
          }}>
            {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '⬍'}
          </span>
        )}
      </div>
    ),
  },
];
```

## Custom Row Renderer (Global)

For global row customization across all columns:

```jsx
const rowRenderer = (row, column, rowIndex) => {
  // Global rendering logic
  if (column.key === 'index') {
    return rowIndex + 1; // Row numbers
  }
  
  // Default rendering
  return row[column.key];
};

<VirtualizedTable
  data={data}
  rowRenderer={rowRenderer}
/>
```

**Note**: Column-level `rowCellFormat` takes priority over global `rowRenderer`.

## Interactive Components in Cells

Render React components directly in table cells:

```jsx
const data = [
  {
    id: 1,
    name: 'Product 1',
    rating: <StarRating value={4} onChange={handleRatingChange} />,
    actions: (
      <div>
        <button onClick={() => edit(1)}>Edit</button>
        <button onClick={() => delete(1)}>Delete</button>
      </div>
    ),
  },
];
```

## Performance Tips

1. **Fixed Heights**: Use consistent row heights for better virtualization
2. **Memoization**: Memoize expensive cell content
3. **Key Props**: Ensure unique `id` fields for optimal drag/drop performance
4. **Overscan**: Adjust overscan value based on scroll speed needs
5. **React.memo**: Wrap custom components in React.memo

## Dependencies

- `react` >= 16.8.0
- `react-beautiful-dnd` >= 13.0.0

## Browser Support

- Chrome >= 60
- Firefox >= 55
- Safari >= 12
- Edge >= 79

---

## Example Implementation

See `App.jsx` for a complete working example with:
- 1000 rows of sample data
- Interactive components (ratings, progress bars, action buttons)
- Custom header and cell formatters
- Custom styling
- Row drag & drop and column sorting
- Sticky header and first column

See `SimpleExample.jsx` for a simpler implementation with:
- 50 rows of employee data
- Basic cell formatting
- Row drag & drop and sorting functionality
