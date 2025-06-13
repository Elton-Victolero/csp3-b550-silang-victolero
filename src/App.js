import './App.css';
import { UserProvider } from './UserContext';
import { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import AppNavbar from "./components/AppNavbar";
import ProductDetails from './components/ProductDetails';
import Error from "./pages/Error"
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Products from "./pages/Products";
import CartView from './pages/CartView';
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser(){
    localStorage.clear();
  };

  const [products, setProducts] = useState([]);
  
  const fetchProductData = useCallback(() => {
      let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_URL}/products/all` : `${process.env.REACT_APP_API_URL}/products/active`
      fetch(fetchUrl, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
      })
      .then(res => res.json())
      .then(data => {
        console.log("data:", data)
          setProducts(data);
      });
  }, [user.isAdmin]);

  const fetchUserData = useCallback(() => {
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
  
  useEffect(() => {
    Promise.all([fetchUserData(), fetchProductData()])
  }, [fetchUserData, fetchProductData])

  return (
    <UserProvider value={{user, fetchUserData, setUser, unsetUser, products, fetchProductData}}>
      <Router>
        <AppNavbar />
        <Container fluid className="app-bg">
          <Routes>
            <Route path="*" element={<Error />} />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;