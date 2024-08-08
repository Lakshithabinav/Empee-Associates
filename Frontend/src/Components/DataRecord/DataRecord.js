import React, { useState } from 'react';
import axios from 'axios';
import './DataRecord.css';
import DropDown from './Dropdown/DropDown';

function DataRecord() {
  const [reportType, setReportType] = useState(''); // State for report type selection
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateReportData, setDateReportData] = useState(null);
  const [timeReportData, setTimeReportData] = useState(null);
  const [dateRangeReportData, setDateRangeReportData] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchData = async (endpoint, params, setData) => {
    try {
      const response = await axios.get(`http://13.202.101.254:8080${endpoint}`, { params });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred');
      setData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (reportType === 'date' && date) {
      handleFetchData('/report-of-date', { date }, setDateReportData);
    } else if (reportType === 'time' && startTime && endTime) {
      handleFetchData('/report-between-two-hours', { startTime, endTime }, setTimeReportData);
    } else if (reportType === 'dateRange' && startDate && endDate) {
      handleFetchData('/report-between-two-dates', { startDate, endDate }, setDateRangeReportData);
    } else if (!reportType) {
      setError('Please select a report type.');
    } else {
      setError('Please provide the necessary input fields.');
    }
  };

  const formatTimestamp = (timestamp, type) => {
    const date = new Date(timestamp);
    if (type === 'date') {
      return date.toLocaleDateString();
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTotals = (data) => {
    const totals = data.reduce(
      (acc, item) => {
        acc.totalLots += item.noOfLoot ;
        acc.totalWeight += item.weight / 100;
        return acc;
      },
      { totalLots: 0, totalWeight: 0 }
    );
    return totals;
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN');
  };
  const handlePrint=()=>{
    window.print();
  }

  const renderTable = (data, type, title) => {
    if (!data || data.length === 0) return null;

    const totals = calculateTotals(data);
    return (
      <div className='reports-page__report-data'>
        <div className='tableTitle-div'>
          <h2 className='reports-page__report-title'>{title}</h2>
          <button onClick={handlePrint} className='printButton'>Print</button>
        </div>
        <table className='reports-page__table'>
          <thead>
            <tr>
              <th>S.no</th>
              <th>{type === 'date' ? 'Date' : 'Timestamp'}</th>
              <th>No. of Loot</th>
              <th>Weight</th>
              <th>Total Accum</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{type === 'date' ? item.date : formatTimestamp(item.timeStamp, type)}</td>
                <td>{formatNumber(item.noOfLoot )}</td>
                <td>{formatNumber(item.weight / 100)}</td>
                <td>{formatNumber(item.totalAccum / 100)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">Totals</td>
              <td>{formatNumber(totals.totalLots)}</td>
              <td>{formatNumber(totals.totalWeight)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <div className='reports-page'>
      <h1 className='reports-page__title'>Fetch Reports</h1>
      <form className='reports-page__form' onSubmit={handleSubmit}>
        <div className='reports-page__form-group'>
          <label className='reports-page__label'>Report Type:</label>
          <DropDown reportType={reportType} setReportType={setReportType} />
        </div>

        {reportType === 'date' && (
          <div className='reports-page__form-group'>
            <h3 className='reports-page__form-heading'>Report of a Date</h3>
            <label className='reports-page__label'>Date:</label>
            <input
              type='date'
              className='reports-page__input'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        )}

        {reportType === 'time' && (
          <div className='reports-page__form-group'>
            <h3 className='reports-page__form-heading'>Report Between Two Hours</h3>
            <label className='reports-page__label'>Start Time:</label>
            <input
              type='datetime-local'
              className='reports-page__input'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <label className='reports-page__label'>End Time:</label>
            <input
              type='datetime-local'
              className='reports-page__input'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        )}

        {reportType === 'dateRange' && (
          <div className='reports-page__form-group'>
            <h3 className='reports-page__form-heading'>Report Between Two Dates</h3>
            <label className='reports-page__label'>Start Date:</label>
            <input
              type='date'
              className='reports-page__input'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label className='reports-page__label'>End Date:</label>
            <input
              type='date'
              className='reports-page__input'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}

        <button className='reports-page__button' type='submit'>Fetch Report</button>
      </form>

      {error && <div className='reports-page__error'>{error}</div>}
      
      {reportType === 'date' && renderTable(dateReportData, 'time', `Production Report (${date})`)}
      {reportType === 'time' && renderTable(timeReportData, 'time', `Production Report (${startTime} - ${endTime})`)}
      {reportType === 'dateRange' && renderTable(dateRangeReportData, 'date', `Production Report (${startDate} - ${endDate})`)}
    </div>
  );
}

export default DataRecord;
