import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

export default function ProductDetails() {
	const { productId } = useParams();
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);

	useEffect(() => {
		fetch(`http://localhost:4000/products/${productId}`)
			.then(res => res.json())
			.then(data => {
				setName(data.name);
				setDescription(data.description);
				setPrice(data.price);
			})
	}, [productId]);

	return (
		<Container className="mt-5">
			<Row>
				<Col lg={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body className="text-center">
							<Card.Title>{name}</Card.Title>
							<Card.Subtitle>Description:</Card.Subtitle>
							<Card.Text>{description}</Card.Text>
							<Card.Subtitle>Price:</Card.Subtitle>
							<Card.Text>PhP {price}</Card.Text>
							<Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
