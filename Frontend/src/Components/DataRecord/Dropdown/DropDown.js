import React from 'react';
import './DropDown.css'; // Ensure this file includes the provided CSS

function DropDown({ reportType, setReportType }) {
  return (
    <div className="form-input-select">
      <select 
        className="custom-select" 
        value={reportType} 
        onChange={(e) => setReportType(e.target.value)}
      >
        <option value="" hidden>Select Report Type...</option>
        <option value="date">Report of a Date</option>
        <option value="time">Report Between Two Hours</option>
        <option value="dateRange">Report Between Two Dates</option>
      </select>
    </div>
  );
}

export default DropDown;
    