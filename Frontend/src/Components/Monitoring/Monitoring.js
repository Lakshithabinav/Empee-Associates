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
  const[todayProduction,setTodayProduction] = useState([]);
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
        {status ? <></> : <div className='teltonica-error-div'><p>The site is currently without power.</p></div>}
        <div className="loading"><Loader /></div>
      </>
    );
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <>
      {status ? <></> : <div className='teltonica-error-div'><p>The site is currently without power.</p></div>} 
      <div className='monitoring-outer-container'>
        <div className="monitoring-container">
          <h2>Monitoring Data</h2>
          <div><strong>Last Updated:</strong> {lastUpdated}</div>
          <ul>
            <li><strong>Current Weight:</strong> {currentWeight / 100}</li>
            <li><strong>Total Accum:</strong> {totalAccum / 100}</li>
            <li><strong>Target Weight:</strong> {targetWeight / 100}</li>
            <li><strong>Pieces:</strong> {pieces}</li>
          </ul>
        </div>
        <div>
          <div className="monitoring-container">
            <h2>Current Hour Production</h2>
            <div className='data-viewing-container'>
            <h3>{todayProduction[todayProduction.length-1].noOfLoot || 'NA'} </h3><h3>{todayProduction[todayProduction.length-1].weight/10 || 'NA'}</h3>
            </div>
          </div>
          <div className="monitoring-container">
            <h2>Today's Production</h2>
            <div className='data-viewing-container'>
            <h3>{currentDayLot || 'NA'} </h3><h3>{todayProductionWeight/10 || 'NA'}</h3>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Monitoring;
