import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listMyOrders } from '../actions/orderActions';
import { getCurrentUser, getUserById } from '../authService';

function UserProfile() {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [fullUser, setFullUser] = useState(null);
  const myOrders = useSelector((state) => state.orderData.myOrders || []);

  useEffect(() => {
    const session = getCurrentUser();
    setCurrentUser(session);

    if (session) {
      setFullUser(getUserById(session.id));
      dispatch(listMyOrders(session.id));
    }
  }, [dispatch]);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <h1 className="h3 text-primary mb-3">User Profile</h1>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}><strong>First Name:</strong> {fullUser?.first_name}</Col>
            <Col md={6}><strong>Last Name:</strong> {fullUser?.last_name}</Col>
            <Col md={6}><strong>Email:</strong> {fullUser?.email}</Col>
            <Col md={6}><strong>Username:</strong> {fullUser?.username}</Col>
            <Col md={6}><strong>Phone Number:</strong> {fullUser?.phone_number}</Col>
            <Col md={6}><strong>Location:</strong> {fullUser?.location}</Col>
            <Col md={6}><strong>Gender:</strong> {fullUser?.gender}</Col>
            <Col md={6}><strong>Role:</strong> {fullUser?.role}</Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h2 className="h5 mb-3">My Orders</h2>
          <Table responsive hover className="align-middle mb-0">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Price</th>
                <th>PayPal Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">No orders found.</td>
                </tr>
              ) : (
                myOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.service_name}</td>
                    <td>PHP {Number(order.price_paid).toLocaleString()}</td>
                    <td>{order.paypal_transaction_id}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserProfile;
