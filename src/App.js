import './App.css';
import { UserProvider } from './UserContext';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser(){
    localStorage.clear();
  };

  useEffect(() => {
    fetch("https://myr5j4i3c2.execute-api.us-west-2.amazonaws.com/production/users/details", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data._id && data.isAdmin){
        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });
      }else{
        setUser({
          id: null,
          isAdmin: null
        });
      }
    })
  }, [])

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;