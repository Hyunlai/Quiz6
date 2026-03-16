import React, { useEffect } from 'react';
import { Alert, Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listServices } from '../actions/serviceActions';
import { getCurrentUser } from '../authService';

function renderStars(rating) {
  const numericRating = Number(rating || 0);
  const filledStars = Math.round(numericRating);

  return Array.from({ length: 5 }, (_, index) => (
    <i
      key={`${rating}-${index}`}
      className={`fa-star ${index < filledStars ? 'fas text-warning' : 'far text-muted'}`}
    />
  ));
}

function DetailScreen() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const services = useSelector((state) => state.serviceList.services || []);
  const currentUser = getCurrentUser();

  useEffect(() => {
    dispatch(listServices());
  }, [dispatch]);

  const service = services.find((item) => item.id === id);

  if (services.length === 0) {
    return <p className="text-muted">Loading service details...</p>;
  }

  if (!service) {
    return (
      <Alert variant="warning" className="shadow-sm">
        <Alert.Heading className="h4">Service not found</Alert.Heading>
        <p className="mb-3">The selected service could not be loaded.</p>
        <Button as={Link} to="/" variant="primary">
          Back to services
        </Button>
      </Alert>
    );
  }

  return (
    <section>
      <Button as={Link} to="/" variant="outline-primary" className="mb-4">
        <i className="fas fa-arrow-left me-2"></i>
        Back to services
      </Button>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Row className="g-0 align-items-stretch">
          <Col lg={6}>
            <img
              src={service.sample_image}
              alt={service.service_name}
              className="img-fluid h-100 w-100 object-fit-cover"
            />
          </Col>
          <Col lg={6}>
            <Card.Body className="p-4 p-lg-5 d-flex flex-column h-100">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <p className="text-uppercase text-muted small mb-2">Service details</p>
                  <h1 className="h2 mb-2">{service.service_name}</h1>
                </div>
                <Badge bg="info" text="dark" pill>
                  {Number(service.rating || 0).toFixed(1)}
                </Badge>
              </div>

              <div className="d-flex gap-1 mb-4">{renderStars(service.rating)}</div>

              <p className="text-muted fs-5">{service.description}</p>

              <Row className="g-3 mt-2">
                <Col sm={6}>
                  <div className="p-3 rounded bg-body-tertiary border h-100">
                    <p className="text-muted mb-1">Price</p>
                    <h2 className="h5 mb-0">{service.price_display || `PHP ${Number(service.price || 0).toLocaleString()}`}</h2>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="p-3 rounded bg-body-tertiary border h-100">
                    <p className="text-muted mb-1">Duration of service</p>
                    <h2 className="h5 mb-0">{service.duration_of_service}</h2>
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="p-3 rounded bg-body-tertiary border">
                    <p className="text-muted mb-1">Name of the expert</p>
                    <h2 className="h5 mb-0">{service.name_of_the_expert}</h2>
                  </div>
                </Col>
              </Row>

              <div className="mt-4 d-flex gap-2 flex-wrap">
                <Button as={Link} to={currentUser ? `/checkout/${service.id}` : '/signin'} variant="primary">
                  Avail Service
                </Button>
                {currentUser ? null : (
                  <Button as={Link} to="/signin" variant="outline-secondary">
                    Sign in first to continue
                  </Button>
                )}
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </section>
  );
}

export default DetailScreen;