import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useDispatch, useSelector } from 'react-redux';
import { createOrderAction } from '../actions/orderActions';
import { getCurrentUser } from '../authService';
import { listServices } from '../actions/serviceActions';

function CheckoutScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const services = useSelector((state) => state.serviceList.services || []);
  const currentUser = getCurrentUser();
  const service = services.find((item) => String(item.id) === String(id));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID || '';

  React.useEffect(() => {
    dispatch(listServices());
  }, [dispatch]);

  const amount = useMemo(() => {
    if (!service) {
      return 0;
    }

    return Number(service.price_value || 0);
  }, [service]);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (!service) {
    return <Navigate to="/" replace />;
  }

  const saveOrder = async (transactionId) => {
    const response = await dispatch(
      createOrderAction({
        service_id: service.id,
        paypal_transaction_id: transactionId,
        price_paid: amount,
      })
    );

    if (!response.success) {
      setError(response.message);
      return;
    }

    setMessage('Payment successful and order recorded. Redirecting to profile...');
    setTimeout(() => navigate('/profile'), 1200);
  };

  const mockPayHandler = async () => {
    await saveOrder(`MOCK-${Date.now()}`);
  };

  return (
    <div>
      <h1 className="h3 text-primary mb-3">Checkout</h1>
      <p className="text-muted">Payment goes directly to the seller merchant account.</p>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}><strong>Service:</strong> {service.service_name}</Col>
            <Col md={6}><strong>Seller:</strong> {service.seller_name || service.name_of_the_expert}</Col>
            <Col md={6}><strong>Order Description:</strong> {service.service_name}</Col>
            <Col md={6}><strong>Price:</strong> PHP {amount.toLocaleString()}</Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h2 className="h5 mb-3">PayPal Payment</h2>
          <p className="small text-muted">
            Merchant ID from admin approval is applied when available.
          </p>

          {paypalClientId ? (
            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'PHP' }}>
              <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      {
                        description: service.service_name,
                        amount: {
                          currency_code: 'PHP',
                          value: amount.toFixed(2),
                        },
                        payee: service.seller_merchant_id
                          ? { merchant_id: service.seller_merchant_id }
                          : undefined,
                      },
                    ],
                  })
                }
                onApprove={async (data, actions) => {
                  await actions.order.capture();
                  saveOrder(data.orderID || `PAYPAL-${Date.now()}`);
                }}
                onError={() => {
                  setError('PayPal could not be initialized in this environment. Use the fallback button below.');
                }}
              />
            </PayPalScriptProvider>
          ) : (
            <Alert variant="warning" className="mb-0">
              PayPal client ID is missing. Set REACT_APP_PAYPAL_CLIENT_ID in frontend .env and restart the frontend server.
            </Alert>
          )}

          <Button className="mt-3" variant="outline-primary" onClick={mockPayHandler}>
            Fallback: Simulate Successful Payment
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CheckoutScreen;
