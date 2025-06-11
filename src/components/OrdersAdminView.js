import { useEffect, useState } from 'react';
import { Accordion, Card, Spinner, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function OrdersAdminView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const groupedByUser = data.reduce((acc, order) => {
            const userId = order.userId;
            if (!acc[userId]) acc[userId] = [];
            acc[userId].push(order);
            return acc;
          }, {});
          setOrders(groupedByUser);
        } else {
          Swal.fire('No Orders Found', data.message || '', 'info');
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to fetch orders', 'error'))
      .finally(() => setLoading(false));

    fetch(`${process.env.REACT_APP_API_URL}/products/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(product => {
          map[product._id] = product.name;
        });
        setProductMap(map);
      })
      .catch(() => Swal.fire('Error', 'Failed to fetch products', 'error'));
  }, []);

  const getProductName = (id) => productMap[id] || 'Unavailable Product';

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Accordion>
        {Object.entries(orders).map(([userId, userOrders], index) => (
          <Accordion.Item eventKey={index.toString()} key={userId}>
            <Accordion.Header>Orders for User: {userId}</Accordion.Header>
            <Accordion.Body>
              {userOrders.map((order, i) => (
                <Card className="mb-3" key={order._id}>
                  <Card.Header>
                    <strong>Order #{userOrders.length - i}</strong> —{' '}
                    {new Date(order.orderedOn).toLocaleString()}
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive size="sm" className="align-middle">
                      <thead>
                        <tr className="text-center">
                          <th style={{ width: '60%' }}>Product</th>
                          <th style={{ width: '20%' }}>Quantity</th>
                          <th style={{ width: '20%' }}>Subtotal</th>
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
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
