import { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Container, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom"

export default function CartView() {
  const navigate = useNavigate();

  const { user, products, fetchProductData } = useContext(UserContext);
  
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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
    fetchProductData();
    fetchCart();
  }, [fetchProductData, fetchCart]);

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

  const checkout = () => {
    Swal.fire({
      title: 'Confirm Checkout',
      text: 'Are you sure you want to place this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, place order',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.message === "Ordered Successfully") {
            return fetch(`${process.env.REACT_APP_API_URL}/cart/clear-cart`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
          }else{
            throw new Error(data.error || "Checkout failed");
          }
        })
        .then(() => {
          fetchCart(); // Refresh cart state
          Swal.fire('Success', 'Order placed.', 'success');
        })
        .then(() => navigate("/orders"))
        .catch(err => {
          Swal.fire('Error', err.message || 'Something went wrong.', 'error');
        })
      }
    });
  };

  return (
    <Container className="text-center mt-4">

      <h1 className="mb-4"><b>Your Shopping Cart</b></h1>

      <Table striped bordered hover responsive size="sm" className="align-middle">
        <thead>
          <tr className="align-middle text-center">
            <th style={{ width: '55%' }}>Product Name</th>
            <th className="d-none d-lg-table-cell" style={{ width: '10%' }}>Price</th>
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
                <td>
                  {product?._id ? (
                    <Link to={`/products/${product._id}`}>
                      {product.name}
                    </Link>
                  ) : (
                    "Product not found"
                  )}
                </td>
                <td className="d-none d-lg-table-cell">{product?.price?.toFixed(2) || "0.00"}</td>
                <td>
                  <ButtonGroup size="sm">
                    <Button variant="outline-secondary" onClick={() => updateQuantity(item.productId, currentQty - 1)}>-</Button>
                    <Button variant="light" disabled>{currentQty}</Button>
                    <Button variant="outline-primary" onClick={() => updateQuantity(item.productId, currentQty + 1)}>+</Button>
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
              <td colSpan="1" className="text-center fw-bold">Total:</td>
              <td colSpan="4" className="fw-bold">₱ {totalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        )}
      </Table>

      {cartItems.length > 0 && (
        <>
        <div className="d-flex">
          <div className="me-auto">
            <Button variant="outline-danger" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          <div className="ms-auto">
            <Button variant="primary" onClick={checkout}>
              Checkout
            </Button>
          </div>
        </div>
        </>
      )}
    </Container>
  );
}
