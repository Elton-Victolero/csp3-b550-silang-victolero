import {useContext} from "react";
import UserContext from "../UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

export default function AppNavbar() {
  const {user} = useContext(UserContext);
  console.log("user:", user)

  return (
    <Navbar expand="lg" className="bg-secondary">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="text-white">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products" className="text-white">Products</Nav.Link>
            {user.id !== null
            ?
              <>
                {!user.isAdmin &&
                  <Nav.Link as={NavLink} to="/cart" className="text-white">Cart</Nav.Link>
                }
                <Nav.Link as={NavLink} to="/orders" className="text-white">Orders</Nav.Link>
                <Nav.Link as={NavLink} to="/logout" className="text-white">Logout</Nav.Link>
              </>
            :
              <>
                <Nav.Link as={NavLink} to="/login" className="text-white">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="text-white">Register</Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}