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
import ProductMain from "./pages/ProductMain";
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser(){
    localStorage.clear();
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log("data:", data)
      if (typeof data._id !== "undefined" && typeof data.isAdmin !== "undefined"){
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
    .catch(err => {
      console.error("User fetch error:", err.message);
      setUser({
        id: null,
        isAdmin: null
      });
    });
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
            <Route path="/products" element={<ProductMain />} />
            <Route path="/active" element={<ProductList />} />
            <Route path="/:productId" element={<ProductDetails />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;