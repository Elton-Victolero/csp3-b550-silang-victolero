import { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

	const {user} = useContext(UserContext);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNo,setMobileNo] = useState("");
	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

  const [isActive, setIsActive] = useState(false);

	function registerUser(e) {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/users/register`,{
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          mobileNo: mobileNo,
          email: email,
          password: password
      })
		})
		.then(res => res.json())
		.then(data => {
			if(data.message === "Registered Successfully"){
				Swal.fire({
		      	    title: "Registration Successful",
		      	    icon: "success",
		      	    text: "Thank you for registering!"
		    });

		    setFirstName("");
		    setLastName("");
		    setMobileNo("");
		    setEmail("");
		    setPassword("");
		    setConfirmPassword("");
			}else{
				Swal.fire({
	        	    title: "Something went wrong.",
	        	    icon: "error",
	        	    text: "Please try again later or contact us for assistance"
	      });
			}
		})
	}

	useEffect(() => {
	  if (
	    firstName !== "" &&
	    lastName !== "" &&
	    mobileNo.length === 11 &&
	    email !== "" &&
	    password !== "" &&
	    confirmPassword !== "" &&
	    password === confirmPassword
	  ) {
	    setIsActive(true);
	  } else {
	    setIsActive(false);
	  }
	}, [firstName, lastName, mobileNo, email, password, confirmPassword]);

	return (
	  user.id !== null
	  ? <Navigate to="/courses" />
	  : <Container className="mt-4">
	      <Row className="justify-content-center">
	        <Col xs={12} md={8} lg={6}>
	          <h1 className="text-center mb-4">Register</h1>
	          <Card>
	            <Card.Body>
	              <Form onSubmit={registerUser}>
	                <Form.Group className="mb-3">
	                  <Form.Label>First Name:</Form.Label>
	                  <Form.Control 
	                    type="text"
	                    placeholder="Enter your First Name"
	                    value={firstName}
	                    onChange={e => setFirstName(e.target.value)}
	                    required
	                  />
	                </Form.Group>

	                <Form.Group className="mb-3">
	                  <Form.Label>Last Name:</Form.Label>
	                  <Form.Control 
	                    type="text"
	                    placeholder="Enter your Last Name"
	                    value={lastName}
	                    onChange={e => setLastName(e.target.value)}
	                    required
	                  />
	                </Form.Group>

	                <Form.Group className="mb-3">
	                  <Form.Label>Mobile Number:</Form.Label>
	                  <Form.Control 
	                    type="text"
	                    placeholder="Enter your 11 digit mobile number"
	                    value={mobileNo}
	                    onChange={e => setMobileNo(e.target.value)}
	                    required
	                  />
	                </Form.Group>

	                <Form.Group className="mb-3">
	                  <Form.Label>Email:</Form.Label>
	                  <Form.Control 
	                    type="email"
	                    placeholder="Enter your email"
	                    value={email}
	                    onChange={e => setEmail(e.target.value)}
	                    required
	                  />
	                </Form.Group>

	                <Form.Group className="mb-3">
	                  <Form.Label>Password:</Form.Label>
	                  <Form.Control 
	                    type="password"
	                    placeholder="Enter Password"
	                    value={password}
	                    onChange={e => setPassword(e.target.value)}
	                    required
	                  />
	                </Form.Group>

	                <Form.Group className="mb-4">
	                  <Form.Label>Confirm Password:</Form.Label>
	                  <Form.Control 
	                    type="password"
	                    placeholder="Confirm Password"
	                    value={confirmPassword}
	                    onChange={e => setConfirmPassword(e.target.value)}
	                    required
	                  />
	                </Form.Group>

	                {
	                  isActive
	                  ? <Button variant="primary" type="submit" className="w-100">Submit</Button>
	                  : <Button variant="danger" type="submit" className="w-100" disabled>Please enter your registration details</Button>
	                }
	              </Form>
	            </Card.Body>
	          </Card>
	        </Col>
	      </Row>
	    </Container>
	);
}