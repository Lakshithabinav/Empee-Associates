import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logedin } from '../../Helper/LoginSlice';
import wave from './img/wave.png';
import bg from './img/bg.svg';
import logomini from './img/logomini.png';
import './SinginPage.css';

function Singin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  useEffect(() => {
    const inputs = document.querySelectorAll('.input');

    const addFocusClass = (event) => {
      let parent = event.target.parentNode.parentNode;
      parent.classList.add('focus');
    };

    const removeFocusClass = (event) => {
      let parent = event.target.parentNode.parentNode;
      if (event.target.value === '') {
        parent.classList.remove('focus');
      }
    };

    inputs.forEach(input => {
      input.addEventListener('focus', addFocusClass);
      input.addEventListener('blur', removeFocusClass);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', addFocusClass);
        input.removeEventListener('blur', removeFocusClass);
      });
    };
  }, []);

  const onHandleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post('http://13.202.101.254:8080/userlogin', {
        username,
        password,
      });

      if (response.status === 200) {
   
        navigate('/dashboard');
        // Dispatch login action
        dispatch(logedin());
      }
    } catch (error) {
      alert("Incorrect username or password");
    }
  };

  return (
    <div className="App">
      <img className="wave" src={wave} alt="wave" />
      <div className="container">
        <div className="img">
          <img src={bg} alt="background" />
        </div>
        <div className="login-content">
          <form onSubmit={onHandleLogin}>
            <img src={logomini} alt="avatar" />
            <h2 className="title">EMPEE associates</h2>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>Username</h5>
                <input
                  type="text"
                  className="input"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Password</h5>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <input type="submit" className="btn" value="Login" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Singin;
