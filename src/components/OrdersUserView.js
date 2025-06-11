import { useEffect, useState } from 'react';
import { Card, Spinner, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function OrdersUserView() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => Swal.fire('Error', 'Failed to fetch active products', 'error'));
  };

  const fetchOrders = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sortedOrders = data.sort(
            (a, b) => new Date(b.orderedOn) - new Date(a.orderedOn)
          );
          setOrders(sortedOrders);
        } else {
          Swal.fire('No Orders Found', data.message || '', 'info');
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to fetch orders', 'error'));
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOrders()])
      .finally(() => setLoading(false));
  }, []);

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : 'Unavailable Product';
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center">You have no orders yet.</p>
      ) : (
        orders.map((order, index) => (
          <Card className="mb-4" key={order._id}>
            <Card.Header>
              <strong>Order #{orders.length - index}</strong> —{' '}
              {new Date(order.orderedOn).toLocaleString()}
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive size="sm" className="align-middle">
                <thead>
                  <tr className="text-center">
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.productsOrdered.map((item, idx) => (
                    <tr key={idx} className="text-center">
                      <td>{getProductName(item.productId)}</td>
                      <td>{item.quantity}</td>
                      <td>₱{item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-end fw-bold">
                Total: ₱{order.totalPrice.toFixed(2)}
              </div>
              <div className="text-end text-muted small">
                Status: {order.status}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}