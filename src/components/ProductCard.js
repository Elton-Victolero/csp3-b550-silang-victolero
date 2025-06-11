import { Card, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ data }) {
  const navigate = useNavigate();

  const viewDetails = () => {
    navigate(`/products/${data._id}`);
  };

  return (
    <Col sm={6} md={4} className="mb-4">
      <Card className="h-100 text-center">
        <Card.Body>
          <Card.Title><b>{data.name}</b></Card.Title>
          <Card.Text>{data.description}</Card.Text>
          <Card.Text>PhP {data.price.toFixed(2)}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" onClick={viewDetails}>View Details</Button>
        </Card.Footer>
      </Card>
    </Col>
  );
}
