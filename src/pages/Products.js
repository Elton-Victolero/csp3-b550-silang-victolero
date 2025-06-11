import { useContext, useEffect } from 'react';
import UserContext from "../UserContext";
import { Container, Row } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

export default function ProductListUser() {
  const { products, fetchProductData } = useContext(UserContext);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

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