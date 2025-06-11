import { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <Container className="mt-5">
      <Row className="g-4 justify-content-center">
        {products.map(product => (
          <ProductCard key={product._id} data={product} />
        ))}
      </Row>
    </Container>
  );
}
