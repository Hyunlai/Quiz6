import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addService, deleteService, editService, listMySellerServices, listServices } from '../actions/serviceActions';
import { getCurrentUser } from '../authService';

const initialForm = {
  service_name: '',
  description: '',
  price: '',
  duration_of_service: '',
  sample_image: '',
};

function SellerDashboard() {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [editingServiceId, setEditingServiceId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sellerServices = useSelector((state) => state.sellerServices.sellerServices || []);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user) {
      dispatch(listMySellerServices(user.id));
    }
  }, [dispatch]);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (currentUser.role !== 'Seller' && currentUser.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  const refreshSellerServices = () => {
    dispatch(listMySellerServices(currentUser.id));
    dispatch(listServices());
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!formData.service_name.trim() || !formData.description.trim() || !formData.duration_of_service.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    if (!/^https?:\/\//i.test(formData.sample_image.trim())) {
      setError('Please provide a valid image URL starting with http or https.');
      return;
    }

    if (editingServiceId) {
      const response = dispatch(editService(editingServiceId, formData));

      if (!response.success) {
        setError(response.message);
        return;
      }

      setMessage('Service updated successfully.');
      setEditingServiceId('');
      setFormData(initialForm);
      refreshSellerServices();
      return;
    }

    const response = dispatch(addService(formData));

    if (!response.success) {
      setError(response.message);
      return;
    }

    setMessage('Service added successfully.');
    setFormData(initialForm);
    refreshSellerServices();
  };

  const editHandler = (service) => {
    setEditingServiceId(service.id);
    setFormData({
      service_name: service.service_name,
      description: service.description,
      price: String(service.price_value),
      duration_of_service: service.duration_of_service,
      sample_image: service.sample_image,
    });
  };

  const deleteHandler = (serviceId) => {
    setError('');
    setMessage('');
    const response = dispatch(deleteService(serviceId));

    if (!response.success) {
      setError(response.message);
      return;
    }

    setMessage('Service deleted.');
    refreshSellerServices();
  };

  return (
    <div>
      <h1 className="h3 text-primary mb-3">Seller Dashboard</h1>
      <p className="text-muted">Add and manage your carpentry services.</p>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={submitHandler}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Service Name</Form.Label>
                  <Form.Control
                    value={formData.service_name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, service_name: event.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price (PHP)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(event) => setFormData((prev) => ({ ...prev, price: event.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Duration Of Service</Form.Label>
                  <Form.Control
                    value={formData.duration_of_service}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, duration_of_service: event.target.value }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    value={formData.sample_image}
                    onChange={(event) => setFormData((prev) => ({ ...prev, sample_image: event.target.value }))}
                    placeholder="https://..."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="primary">
                {editingServiceId ? 'Update Service' : 'Add Service'}
              </Button>
              {editingServiceId ? (
                <Button type="button" variant="outline-secondary" onClick={() => { setEditingServiceId(''); setFormData(initialForm); }}>
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h2 className="h5 mb-3">My Services</h2>
          <Table responsive hover className="align-middle mb-0">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellerServices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">No services yet.</td>
                </tr>
              ) : (
                sellerServices.map((service) => (
                  <tr key={service.id}>
                    <td>{service.service_name}</td>
                    <td>{service.price}</td>
                    <td>{service.duration_of_service}</td>
                    <td className="text-end">
                      <Button size="sm" variant="primary" className="me-2" onClick={() => editHandler(service)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => deleteHandler(service.id)}>
                        Delete
                      </Button>
                    </td>
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

export default SellerDashboard;
