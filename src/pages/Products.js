import { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.API_URL}/products/active`)
      .then(res => res.json())
      .then(data => setProducts(data))
  }, []);

  const viewDetails = (productId) => {
    navigate(`/${productId}`);
  };

  return (
    <Container className="mt-5">
      <Row>
        {products.map(product => (
          <Col key={product._id} lg={6} className="mb-4">
            <Card
              className="h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => viewDetails(product._id)}
            >
              <Card.Body className="text-center">
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text><strong>PhP {product.price}</strong></Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
