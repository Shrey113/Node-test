import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './component/LoginRegister';
import HomePage from './component/HomePage';
import Dashboard from './component/sub_component/Dashboard';
import ShowLoder from './component/sub_component/show_loder';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuthentication = async () => {
    const localstorage_key_for_jwt_user_side_key = 'Jwt_user_localstorage_key_on_chat_x';
    const token = window.localStorage.getItem(localstorage_key_for_jwt_user_side_key);

    if (token) {
      try {
        const response = await fetch('https://node-test-backend-ten.vercel.app/get_user_data_from_jwt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwt_token: token }),
        });

        const data = await response.json();
        if (data.userData) {
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

  if (isAuthenticated === null) {
    checkAuthentication();
    return <ShowLoder/>; 
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={isAuthenticated ? <HomePage /> : <LoginRegister />} />
        <Route path='/test' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
