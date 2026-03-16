import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listApplications, submitSellerApplication } from '../actions/applicationActions';
import { getCurrentUser } from '../authService';

function ApplySeller() {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('none');
  const applications = useSelector((state) => state.applicationData.applications || []);

  useEffect(() => {
    dispatch(listApplications());
  }, [dispatch]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user) {
      return;
    }

    const latestApplication = applications
      .filter((application) => String(application.user) === String(user.id))
      .sort((a, b) => b.id - a.id)[0];

    if (user.role === 'Seller') {
      setStatus('approved');
    } else if (latestApplication) {
      setStatus(latestApplication.status.toLowerCase());
    } else {
      setStatus('none');
    }
  }, [applications]);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  const submitHandler = async () => {
    setError('');
    setSuccess('');

    const response = await dispatch(submitSellerApplication());

    if (!response.success) {
      setError(response.message);
      return;
    }

    setStatus('pending');
    setSuccess(response.message);
  };

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        <Card className="border-0 shadow-sm auth-card">
          <Card.Body className="p-4 p-md-5">
            <h1 className="h3 text-primary mb-2">Apply As Seller</h1>
            <p className="text-muted mb-4">
              Any registered user can apply. Approval is handled by the Admin.
            </p>

            {error ? <Alert variant="danger">{error}</Alert> : null}
            {success ? <Alert variant="success">{success}</Alert> : null}

            <Alert variant="secondary" className="mb-4">
              Current account role: <strong>{currentUser.role}</strong>
            </Alert>

            {status === 'approved' ? (
              <Alert variant="success" className="mb-0">
                Your seller account is approved.
              </Alert>
            ) : status === 'pending' ? (
              <Alert variant="warning" className="mb-0">
                Your seller application is pending admin approval.
              </Alert>
            ) : status === 'declined' ? (
              <Alert variant="danger" className="mb-0">
                Your previous seller application was declined. You may submit again.
              </Alert>
            ) : (
              <div className="d-grid">
                <Button onClick={submitHandler} variant="primary" size="lg">
                  Submit Seller Application
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default ApplySeller;
