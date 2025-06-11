import { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import photoData from '../data/PhotoData';

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(res => res.json())
      .then(data => {
        const selected = new Set();
        while (selected.size < 5 && selected.size < data.length) {
          const randIndex = Math.floor(Math.random() * data.length);
          selected.add(data[randIndex]);
        }
        setFeatured(Array.from(selected));
      });
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Featured Products</h2>
      <Row className="g-4 justify-content-center">
        {featured.map(product => (
          <ProductCard
            key={product._id}
            data={product}
            photo={photoData[product.name] || "https://via.placeholder.com/150"}
          />
        ))}
      </Row>
    </Container>
  );
}
