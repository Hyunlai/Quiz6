import React, { useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../authService';
import { login } from '../actions/userActions';

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    const response = await dispatch(login(email, password));

    if (!response.success) {
      setError(response.message);
      return;
    }

    window.dispatchEvent(new Event('auth-changed'));
    setSuccess('Login successful. Redirecting...');

    const redirectPath = location.state?.from;
    if (redirectPath && redirectPath !== '/signin' && redirectPath !== '/signup') {
      navigate(redirectPath, { replace: true });
      return;
    }

    const user = getCurrentUser();
    if (user?.role === 'Admin') {
      navigate('/users');
      return;
    }

    navigate('/');
  };

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="border-0 shadow-sm auth-card">
          <Card.Body className="p-4 p-md-5">
            <h1 className="h3 text-primary mb-2">Sign In</h1>
            <p className="text-muted mb-4">Use your email and password to access your account.</p>

            <Alert variant="info" className="small">
              Demo Admin Account: admin@platform.local / admin12345
            </Alert>

            {error ? <Alert variant="danger">{error}</Alert> : null}
            {success ? <Alert variant="success">{success}</Alert> : null}

            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" variant="primary" size="lg">
                  Sign In
                </Button>
              </div>
            </Form>

            <p className="mt-4 mb-0 text-muted">
              No account yet? <Link to="/signup" state={{ from: location.state?.from }}>Create one here</Link>.
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default SignIn;
