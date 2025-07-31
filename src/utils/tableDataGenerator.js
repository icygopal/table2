// Generate table data
export const generateTableData = (startIndex = 0, count = 30) => {
  const drivers = [
    { id: 'D001', name: 'John Smith', status: 'A', truckNumber: 'T001' },
    { id: 'D002', name: 'Jane Doe', status: 'A', truckNumber: 'T002' },
    { id: 'D003', name: 'Mike Johnson', status: 'B', truckNumber: 'T003' },
    { id: 'D004', name: 'Sarah Wilson', status: 'A', truckNumber: 'T004' },
    { id: 'D005', name: 'Tom Brown', status: 'C', truckNumber: 'T005' },
  ];

  const moves = [
    {
      taskId: 'T_001110',
      size: '40HC',
      assignedDate: '12/15',
      assignedTime: '09:30 AM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
        { name: 'Return empty to yard', voidOut: true },
        { name: 'Pick up container from yard', voidOut: false },
        { name: 'Deliver to port', voidOut: false },
      ]
    },
    {
      taskId: 'T_001111',
      size: '20GP',
      assignedDate: '12/15',
      assignedTime: '10:15 AM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Pick up from warehouse', voidOut: false },
        { name: 'Deliver to distribution center', voidOut: false },
      ]
    },
    {
      taskId: 'T_001112',
      size: '40HC',
      assignedDate: '12/15',
      assignedTime: '11:00 AM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Port pickup', voidOut: false },
        { name: 'Deliver to customer', voidOut: false },
        { name: 'Return to port', voidOut: false },
      ]
    },
    {
      taskId: 'T_001113',
      size: '20GP',
      assignedDate: '12/15',
      assignedTime: '01:30 PM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Yard to warehouse', voidOut: false },
        { name: 'Warehouse to customer', voidOut: false },
      ]
    },
    {
      taskId: 'T_001114',
      size: '40HC',
      assignedDate: '12/15',
      assignedTime: '02:45 PM',
      assignedDriver: null,
      lastUpdated: null,
      tasks: [
        { name: 'Port to yard', voidOut: false },
        { name: 'Yard to customer', voidOut: false },
        { name: 'Customer to yard', voidOut: true },
      ]
    },
  ];

  const rows = [];
  for (let i = 0; i < count; i++) {
    const driverIndex = (startIndex + i) % drivers.length;
    const moveIndex = (startIndex + i) % moves.length;
    
    rows.push({
      id: `driver-${startIndex + i + 1}`,
      driver: drivers[driverIndex],
      move1: Math.random() > 0.3 ? { ...moves[moveIndex] } : null,
      move2: Math.random() > 0.4 ? { ...moves[(moveIndex + 1) % moves.length] } : null,
      move3: Math.random() > 0.5 ? { ...moves[(moveIndex + 2) % moves.length] } : null,
      move4: Math.random() > 0.6 ? { ...moves[(moveIndex + 3) % moves.length] } : null,
      move5: Math.random() > 0.7 ? { ...moves[(moveIndex + 4) % moves.length] } : null,
      move6: Math.random() > 0.75 ? { ...moves[(moveIndex + 0) % moves.length] } : null,
      move7: Math.random() > 0.8 ? { ...moves[(moveIndex + 1) % moves.length] } : null,
      move8: Math.random() > 0.85 ? { ...moves[(moveIndex + 2) % moves.length] } : null,
      move9: Math.random() > 0.9 ? { ...moves[(moveIndex + 3) % moves.length] } : null,
      move10: Math.random() > 0.92 ? { ...moves[(moveIndex + 4) % moves.length] } : null,
      move11: Math.random() > 0.94 ? { ...moves[(moveIndex + 0) % moves.length] } : null,
      move12: Math.random() > 0.96 ? { ...moves[(moveIndex + 1) % moves.length] } : null,
      move13: Math.random() > 0.97 ? { ...moves[(moveIndex + 2) % moves.length] } : null,
      move14: Math.random() > 0.98 ? { ...moves[(moveIndex + 3) % moves.length] } : null,
    });
  }
  return rows;
};