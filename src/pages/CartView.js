import { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Container } from 'react-bootstrap';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function CartView() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchProducts = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
    .then(res => res.json())
    .then(data => {
      console.log("data:", data)
      setProducts(data);
    });
  }, [])

  const fetchCart = useCallback(() => {
    if (!user.id) return;

    fetch(`${process.env.REACT_APP_API_URL}/cart/get-cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cartItems) {
          setCartItems(data.cartItems);
          setTotalPrice(data.totalPrice || 0);
        } else {
          Swal.fire({
            title: 'Cart fetch failed',
            text: data.message || 'Unable to load cart.',
            icon: 'error',
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong while fetching the cart.',
          icon: 'error',
        });
      });
    }, [user.id])

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchProducts, fetchCart]);

  const getProductDetails = (id) => {
    return products.find(p => p._id === id);
  };

  return (
    <Container className="text-center mt-4">
      <h1 className="text-center mb-4">My Cart</h1>
      <Table striped bordered hover responsive>
        <thead className="text-center align-middle">
          <tr>
            <th>Product Name</th>
            <th>Price (₱)</th>
            <th>Quantity</th>
            <th>Subtotal (₱)</th>
          </tr>
        </thead>
        
        <tbody className="align-middle">
          {cartItems.length > 0
          ?
            cartItems.map((item) => {
              const product = getProductDetails(item.productId);
              return (
                <tr key={item.productId}>
                  <td>{product.name}</td>
                  <td>{product.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>{item.subtotal.toFixed(2)}</td>
                </tr>
              );
            })
          :
            <tr>
              <td colSpan="4" className="text-center">
                Your cart is empty.
              </td>
            </tr>
          }
        </tbody>
        
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end fw-bold">Total:</td>
            <td className="fw-bold">₱ {totalPrice.toFixed(2)}</td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
}
