import './App.css';
import { UserProvider } from './UserContext';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

//pages and components imports
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <UserProvider>
      <Router>
        {/*<AppNavbar />*/}
        <Container>
          <Routes>
            <Route path="/active" element={<Products />} />
            <Route path="/:productId" element={<ProductDetails />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;