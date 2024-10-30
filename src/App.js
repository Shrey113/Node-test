import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './component/LoginRegister';
import HomePage from './component/HomePage';
import ShowLoder from './component/sub_component/show_loder';
import CameraCapture from './component/CameraCapture';

import { update_client_data } from './component/Clint_data';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const checkAuthentication = async () => {
      const localstorage_key_for_jwt_user_side_key = 'Jwt_user_localstorage_key_on_chat_x';
      const token = window.localStorage.getItem(localstorage_key_for_jwt_user_side_key);

      if (token) {
        try {
          const response = await fetch('https://test-node-90rz.onrender.com/get_user_data_from_jwt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jwt_token: token }),
          });

          const data = await response.json();
          if (data.userData) {
            Object.entries(data.userData).forEach(([key, value]) => {
              update_client_data(key, value);
            });
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <ShowLoder />;
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={isAuthenticated ? <HomePage /> : <LoginRegister />} />
        <Route path='/ss' element={<CameraCapture />} />
      </Routes>
    </Router>
  );
}

export default App;
