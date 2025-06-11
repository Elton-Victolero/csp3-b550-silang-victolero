import { useState, useEffect, useContext } from 'react';
import UserContext from "../UserContext"; 
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import Swal from "sweetalert2";

import photoData from '../data/PhotoData';

export default function ProductDetails() {
	const navigate = useNavigate();
	
	const { user } = useContext(UserContext);
	const { productId } = useParams();

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [quantity, setQuantity] = useState(1);

	const imageUrl = photoData[name] || "https://via.placeholder.com/300";

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
			.then(res => res.json())
			.then(data => {
				setName(data.name);
				setDescription(data.description);
				setPrice(data.price);
			})
	}, [productId]);

	const addToCart = () => {
	  if (!user.id) {
	    Swal.fire({
	      title: 'Please login',
	      text: 'You need to be logged in to add items to your cart.',
	      icon: 'warning'
	    });
	    navigate('/login');
	    return;
	  }

	  fetch(`${process.env.REACT_APP_API_URL}/cart/add-to-cart`, {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json',
	      Authorization: `Bearer ${localStorage.getItem("token")}`
	    },
	    body: JSON.stringify({
	      productId: productId,
	      quantity: quantity
	    })
	  })
    .then(res => res.json())
    .then(data => {
    	if(data.message === "Item added to cart successfully"){
    		Swal.fire({
    		  title: 'Success!',
    		  text: data.message || 'Item added to cart successfully.',
    		  icon: 'success'
    		})
    		.then(() => navigate("/cart"));
    	}else{
    		Swal.fire({
    			title: 'Error',
    			text: 'Something went wrong. Please try again later.',
    			icon: 'error'
    		})
    	}
    });
	};

	const increment = () => setQuantity(prev => prev + 1);
	const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

	return (
		<Container className="mt-5">
			<Row>
				<Col lg={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Img
						  variant="top"
						  src={imageUrl}
						  alt={name}
						  className="img-fluid"
						  style={{
						    height: '300px',
						    objectFit: 'cover',
						    borderTopLeftRadius: '0.375rem',
						    borderTopRightRadius: '0.375rem'
						  }}
						/>
						<Card.Body className="text-center">
							<Card.Title className="mb-3">{name}</Card.Title>
							<Card.Subtitle>Description:</Card.Subtitle>
							<Card.Text className="mb-3">{description}</Card.Text>
							<Card.Subtitle>Price:</Card.Subtitle>
							<Card.Text>₱ {price}</Card.Text>
						</Card.Body>
						
						{user.isAdmin === false &&
							<Card.Body className="text-center">
								<InputGroup className="justify-content-center mb-3" style={{ maxWidth: '200px', margin: '0 auto' }}>
								  <Button variant="outline-secondary" onClick={decrement}>-</Button>
								  <FormControl
								    type="number"
								    value={quantity}
								    min={1}
								    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
								    className="text-center"
								  />
								  <Button variant="outline-primary" onClick={increment}>+</Button>
								</InputGroup>
								<Button variant="primary" className="mx-1" onClick={addToCart}>Add to cart</Button>
							</Card.Body>
						}
						
						
						<Card.Body className="text-center">
							<Button variant="secondary" className="mx-1" onClick={() => navigate("/products/")}>Back</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
