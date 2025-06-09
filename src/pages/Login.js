import { useState, useEffect, useContext } from "react";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom"; 
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function Login() {
	const { user, setUser } = useContext(UserContext);

	const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isActive, setIsActive] = useState(false);

  function authenticate(e) {
	  e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/users/login`,{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data.access){
				localStorage.setItem("token", data.access);
				retrieveUserDetails(data.access);

				Swal.fire({
    	    title: "Login Successful",
    	    icon: "success"
      	});
        	setEmail("");
        	setPassword("");
			}else{
				Swal.fire({
          title: "Authentication failed",
          icon: "error",
          text: "Check your login details and try again."
        });
			}
		})
  }

  const retrieveUserDetails = (token) => {
    fetch("https://myr5j4i3c2.execute-api.us-west-2.amazonaws.com/production/users/details", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
    	console.log(data)
      setUser({
        id: data._id,
        isAdmin: data.isAdmin
      });
    })
  };

  useEffect(() => {
      if(email !== "" && password !== ""){
          setIsActive(true);
      }else{
          setIsActive(false);
      }
  }, [email, password]);

  return (
    user.id !== null
      ? <Navigate to="/" />
      : <Container className="mt-3">
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={5}>
            	<h1 className="text-center mb-4">Login</h1>
              <Card className="mt-4">
                <Card.Body>
                  <Form onSubmit={authenticate}>
                    <Form.Group className="mb-3" controlId="userEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    {
                      isActive
                      ? <Button variant="primary" type="submit" className="w-100">Submit</Button>
                      : <Button variant="danger" type="submit" className="w-100" disabled>Submit</Button>
                    }
                  </Form>
                </Card.Body>
              </Card>
              <p className="text-center mt-3">Don't have an account yet? <Link to="/register">Click here</Link> to register.</p>
            </Col>
          </Row>
        </Container>
  );
}