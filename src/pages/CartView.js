import { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Container, Button, ButtonGroup } from 'react-bootstrap';
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
      .then(data => setProducts(data));
  }, []);

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
          Swal.fire('Cart fetch failed', data.message || 'Unable to load cart.', 'error');
        }
      })
      .catch(() => {
        Swal.fire('Error', 'Something went wrong while fetching the cart.', 'error');
      });
  }, [user.id]);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchProducts, fetchCart]);

  const getProductDetails = (id) => products.find(p => p._id === id);

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    fetch(`${process.env.REACT_APP_API_URL}/cart/update-cart-quantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ productId, quantity })
    })
      .then(res => res.json())
      .then(() => fetchCart())
      .catch(() => Swal.fire('Error', 'Failed to update quantity.', 'error'));
  };

  const removeItem = (productId) => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/remove-from-cart`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(() => fetchCart())
      .catch(() => Swal.fire('Error', 'Failed to remove item.', 'error'));
  };

  const clearCart = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will remove all items from your cart.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/cart/clear-cart`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(res => res.json())
          .then(() => fetchCart())
          .catch(() => Swal.fire('Error', 'Failed to clear cart.', 'error'));
      }
    });
  };

  return (
    <Container className="text-center mt-4">
      <h1 className="mb-4"><b>Your Shopping Cart</b></h1>

      <Table striped bordered hover responsive>
        <thead>
          <tr className="align-middle text-center">
            <th style={{ width: '55%' }}>Product Name</th>
            <th style={{ width: '10%' }}>Price</th>
            <th style={{ width: '10%' }}>Quantity</th>
            <th style={{ width: '15%' }}>Subtotal</th>
            <th style={{ width: '10%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length > 0 ? cartItems.map(item => {
            const product = getProductDetails(item.productId);
            const currentQty = item.quantity;

            return (
              <tr key={item.productId}>
                <td>{product?.name || "Product not found"}</td>
                <td>{product?.price?.toFixed(2) || "0.00"}</td>
                <td>
                  <ButtonGroup size="sm">
                    <Button variant="secondary" onClick={() => updateQuantity(item.productId, currentQty - 1)}>-</Button>
                    <Button variant="light" disabled>{currentQty}</Button>
                    <Button variant="secondary" onClick={() => updateQuantity(item.productId, currentQty + 1)}>+</Button>
                  </ButtonGroup>
                </td>
                <td>{item.subtotal.toFixed(2)}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => removeItem(item.productId)}>
                    Remove
                  </Button>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan="5">Your cart is empty.</td>
            </tr>
          )}

        </tbody>
        {cartItems.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total:</td>
              <td colSpan="2" className="fw-bold">₱ {totalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        )}
      </Table>

      {cartItems.length > 0 && (
        <div className="text-start">
          <Button variant="outline-danger" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      )}
    </Container>
  );
}
