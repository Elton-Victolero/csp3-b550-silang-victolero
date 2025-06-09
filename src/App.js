import './App.css';
import { UserProvider } from './UserContext';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <UserProvider>
      <Router>
        {/*<AppNavbar />*/}
        <Container>
          <Routes>
            
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;