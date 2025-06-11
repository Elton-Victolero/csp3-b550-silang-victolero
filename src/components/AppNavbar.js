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
    <Navbar expand="lg" className="bg-primary">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
            {user.id !== null
            ?
              <>
                {!user.isAdmin &&
                  <Nav.Link as={NavLink} to="/cart">Cart</Nav.Link>
                }
                <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>
                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
              </>
            :
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}