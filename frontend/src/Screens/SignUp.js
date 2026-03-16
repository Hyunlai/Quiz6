import React, { useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../actions/userActions';

const initialFormState = {
  email: '',
  username: '',
  phone_number: '',
  first_name: '',
  last_name: '',
  location: '',
  gender: '',
  password: '',
  confirm_password: '',
};

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const requiredFields = [
      'email',
      'username',
      'phone_number',
      'first_name',
      'last_name',
      'location',
      'gender',
      'password',
      'confirm_password',
    ];

    const hasMissingField = requiredFields.some((field) => !formData[field].trim());

    if (hasMissingField) {
      setError('Please complete all required fields.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password should be at least 8 characters long.');
      return;
    }

    const response = await dispatch(register(formData));

    if (!response.success) {
      setError(response.message);
      return;
    }

    setSuccess('Registration successful. Account type: User. Redirecting to sign in...');
    setFormData(initialFormState);

    setTimeout(() => {
      navigate('/signin');
    }, 1200);
  };

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        <Card className="border-0 shadow-sm auth-card">
          <Card.Body className="p-4 p-md-5">
            <h1 className="h3 text-primary mb-2">Create Account</h1>
            <p className="text-muted mb-4">Fill out the required details to register.</p>

            {error ? <Alert variant="danger">{error}</Alert> : null}
            {success ? <Alert variant="success">{success}</Alert> : null}

            <Form onSubmit={submitHandler}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={changeHandler}
                      placeholder="you@example.com"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={changeHandler}
                      placeholder="Choose a username"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="phone_number">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={changeHandler}
                      placeholder="09XXXXXXXXX"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={changeHandler}
                      placeholder="City or address"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="first_name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={changeHandler}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="last_name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={changeHandler}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={changeHandler}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="confirm_password">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={changeHandler}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid mt-4">
                <Button type="submit" variant="primary" size="lg">
                  Register
                </Button>
              </div>
            </Form>

            <p className="mt-4 mb-0 text-muted">
              Already registered? <Link to="/signin">Sign in here</Link>.
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default SignUp;
