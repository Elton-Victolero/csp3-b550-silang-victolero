import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProductListUser() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const viewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Container className="mt-5">
      <Row className="g-4 justify-content-center">
        {products.map(product => (
          <Col key={product._id} xs={12} sm={6} md={4}>
            <Card className="h-100 text-center">
              <Card.Body>
                <Card.Title><b>{product.name}</b></Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>PhP {product.price.toFixed(2)}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" onClick={() => viewDetails(product._id)}>
                  View Details
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
