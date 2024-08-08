import React, { useEffect, useState } from 'react';
import webSocketService from '../../WebSocketService';
import './Monitoring.css'; // Import the CSS file
import Loader from '../Loader/Loader';

function Monitoring() {
  const [currentWeight, setCurrentWeight] = useState(null);
  const [totalAccum, setTotalAccum] = useState(null);
  const [targetWeight, setTargetWeight] = useState(null);
  const [flowRate, setFlowRate] = useState(null);
  const [pieces, setPieces] = useState(null);
  const [operatingState, setOperatingState] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(true);
  const [todayProduction, setTodayProduction] = useState([]);
  const [currentDayLot, setCurrentDayLot] = useState(0);
  const [todayProductionWeight, setTodayProductionWeight] = useState(0);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const formatNumber = (num) => {
    return num !== null ? num.toLocaleString('en-IN') : 'NA';
  };

  useEffect(() => {
    const handleMessage = (message) => {
      if (Array.isArray(message)) {
        try {
          console.log(message);
          const currentData = message[0];
          if (currentData.productionOfToday) {
            const totalNoOfLoot = currentData.productionOfToday.reduce((acc, item) => acc + item.noOfLoot, 0);
            const totalNoOfWeight = currentData.productionOfToday.reduce((acc, item) => acc + item.weight, 0);
            setCurrentDayLot(totalNoOfLoot);
            setTodayProductionWeight(totalNoOfWeight);
            setTodayProduction(currentData.productionOfToday);
          }
          
          setLastUpdated(formatTimestamp(currentData.time));
          
          message.forEach((item) => {
            switch (item.name) {
              case 'CurrentWeight':
                setCurrentWeight(item.data);
                break;
              case 'TotalAccum':
                setTotalAccum(item.data);
                break;
              case 'TargetWeight':
                setTargetWeight(item.data);
                break;
              case 'FlowRate':
                setFlowRate(item.data);
                break;
              case 'Peices':
                setPieces(item.data);
                break;
              case 'OperatingState':
                setOperatingState(item.data);
                break;
              default:
                break;
            }
          });
          
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('Received message is not an array', message);
      }
    };

    const handleTeltonikaError = (data) => {
      console.log(data);
      setStatus(data);
    };

    webSocketService.connect(handleMessage, handleTeltonikaError);

    return () => {
      webSocketService.client.deactivate();
    };
  }, []);

  if (loading) {
    return (
      <>
        {status ? null : <div className='teltonica-error-div'><p>The site is currently without power.</p></div>}
        <div className="loading"><Loader /></div>
      </>
    );
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTotals = (data) => {
    const totals = data.reduce(
      (acc, item) => {
        acc.totalLots += item.noOfLoot;
        acc.totalWeight += item.weight;
        return acc;
      },
      { totalLots: 0, totalWeight: 0 }
    );
    return totals;
  };

  const totals = calculateTotals(todayProduction);

  return (
    <>
      {status ? null : <div className='teltonica-error-div'><p>The site is currently without power.</p></div>} 
      <div className='monitoring-outer-container'>
        <div className="monitoring-container">
          <h2>Monitoring Data</h2>
          <div><strong>Last Updated:</strong> {lastUpdated}</div>
          <ul>
            <li><strong>Current Weight:</strong> {formatNumber(currentWeight / 100)}</li>
            <li><strong>Total Accum:</strong> {formatNumber(totalAccum / 100)}</li>
            <li><strong>Target Weight:</strong> {formatNumber(targetWeight / 100)}</li>
            <li><strong>Pieces:</strong> {formatNumber(pieces)}</li>
          </ul>
        </div>
        <div>
          <div className="monitoring-container">
            <h2>Current Hour Production</h2>
            <div className='data-viewing-container'>
              <div className='data-viewing-inner-container'>
                <p>No of Loot</p>
                <h3>{formatNumber(todayProduction[todayProduction.length-1]?.noOfLoot ) || 'NA'} </h3>
              </div>
              <div className='data-viewing-inner-container'>
                <p>Total Weight</p>
                <h3>{formatNumber(todayProduction[todayProduction.length-1]?.weight / 100) || 'NA'} </h3>
              </div>
            </div>
          </div>
          <div className="monitoring-container">
            <h2>Today's Production</h2>
            <div className='data-viewing-container'>
              <div className='data-viewing-inner-container'>
                <p>No of Loot</p>
                <h3>{formatNumber(currentDayLot) || 'NA'} </h3>
              </div>
              <div className='data-viewing-inner-container'>
                <p>Total Weight</p>
                <h3>{formatNumber(todayProductionWeight / 100) || 'NA'} </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2>Today's total production by Hour</h2>
      <div className='reports-page__report-data'>
        <h2 className='reports-page__report-title'></h2>
        <table className='reports-page__table'>
          <thead>
            <tr>
              <th>S. no</th>
              <th>Time</th>
              <th>No. of Loot</th>
              <th>Weight</th>
              <th>Total Accum</th>
            </tr>
          </thead>
          <tbody>
            {todayProduction.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatTime(item.timeStamp)}</td>
                <td>{formatNumber(item.noOfLoot )}</td>
                <td>{formatNumber(item.weight / 100)}</td>
                <td>{formatNumber(item.totalAccum / 100)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2"><strong>Totals</strong></td>
              <td><strong>{formatNumber(totals.totalLots)}</strong></td>
              <td><strong>{formatNumber(totals.totalWeight / 100)}</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Monitoring;
