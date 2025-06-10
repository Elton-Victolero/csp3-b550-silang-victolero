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
import Products from "./pages/Products";
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import AddProduct from './pages/AddProduct';

function App() {
  const [user, setUser] = useState({});

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
      if (typeof data !== "undefined"){
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
            <Route path="/products" element={<Products />} />
            <Route path="/productList" element={<ProductList />} />
            <Route path="/productDetails" element={<ProductDetails />} />
            <Route path="/addProduct" element={<AddProduct />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;