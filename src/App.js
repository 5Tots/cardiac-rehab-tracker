import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

const scheduleTemplate = [
  { day: 'Monday', activity: 'Cardiac Rehab: Assault Bike + Treadmill' },
  { day: 'Tuesday', activity: 'Strength: Lower Body + Core (Tonal)' },
  { day: 'Wednesday', activity: 'Cardiac Rehab: Assault Bike + Treadmill' },
  { day: 'Thursday', activity: 'Strength: Upper Body + Balance (Tonal)' },
  { day: 'Friday', activity: 'Cardiac Rehab: Assault Bike + Treadmill' },
  { day: 'Saturday', activity: 'Strength: Full Body + Mobility (Tonal)' },
  { day: 'Sunday', activity: 'Optional Walk, Yoga, or Rest' },
];

function App() {
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay();
    const newWeek = Array.from({ length: 21 }, (_, i) => {
      const date = new Date();
      date.setDate(startOfWeek + i);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const formattedDate = date.toISOString().split('T')[0];
      const template = scheduleTemplate.find(d => d.day === day);
      return {
        date: formattedDate,
        day,
        activity: template ? template.activity : 'Rest or Light Activity',
        completed: false,
        notes: '',
      };
    });
    setWeekData(newWeek);
  }, []);

  const handleToggle = (index) => {
    const updated = [...weekData];
    updated[index].completed = !updated[index].completed;
    setWeekData(updated);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...weekData];
    updated[index].notes = value;
    setWeekData(updated);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(weekData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cardiac Rehab');
    XLSX.writeFile(wb, 'cardiac_rehab_tracker.xlsx');
  };

  return (
    <div className="container">
      <button onClick={exportToExcel}>Export to Excel</button>
      {weekData.map((entry, index) => (
        <div className="card" key={index}>
          <div className="card-header">
            <h3>{entry.day} – {entry.date}</h3>
            <p>{entry.activity}</p>
            <input
              type="checkbox"
              checked={entry.completed}
              onChange={() => handleToggle(index)}
            />
          </div>
          <textarea
            placeholder="Notes or RPE"
            value={entry.notes}
            onChange={(e) => handleNoteChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
