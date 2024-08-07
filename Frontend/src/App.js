import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Singin from './Page/Singin/SignPage';
import UserSignedInOrNot from './Page/UserSignedInOrNot/UserSignedInOrNot';



function App() {
  return (
    <Router>
        <Routes>
        <Route path='/' element={<Singin/>}></Route>
        <Route path="/dashboard/*" element={<UserSignedInOrNot />} />
        </Routes>
    </Router>
  );
}

export default App;
