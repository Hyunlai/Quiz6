import React, { useEffect } from 'react';
import { Card, Col, Row, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listServices } from '../actions/serviceActions';

function renderStars(rating) {
	const filledStars = Math.round(rating);

	return Array.from({ length: 5 }, (_, index) => (
		<i
			key={`${rating}-${index}`}
			className={`fa-star ${index < filledStars ? 'fas text-warning' : 'far text-muted'}`}
		/>
	));
}

function HomeScreen() {
	const dispatch = useDispatch();
	const services = useSelector((state) => state.serviceList.services || []);

	useEffect(() => {
		dispatch(listServices());
	}, [dispatch]);

	return (
		<section>
			<div className="mb-4 text-center">
				<h1 className="display-6 fw-bold text-primary">Carpentry And Woodwork Services</h1>
				<p className="lead text-muted mb-0">
					Browse available carpentry services and open any card to view full service details.
				</p>
			</div>

			<Row className="g-4">
				{services.map((service) => (
					<Col key={service.id} md={6} lg={4}>
						<Card className="h-100 border-0 shadow-sm service-card overflow-hidden">
							<Link to={`/service/${service.id}`} className="text-decoration-none text-reset h-100 d-flex flex-column">
								<Card.Img variant="top" src={service.sample_image} alt={service.service_name} />
								<Card.Body className="d-flex flex-column">
									<div className="d-flex justify-content-between align-items-start gap-3 mb-2">
										<Card.Title className="mb-0 h5">{service.service_name}</Card.Title>
										<Badge bg="info" text="dark">{service.rating.toFixed(1)}</Badge>
									</div>
									<Card.Text className="text-muted flex-grow-1">{service.description}</Card.Text>
									<div className="d-flex align-items-center justify-content-between mt-3">
										<div className="d-flex gap-1">{renderStars(service.rating)}</div>
										<span className="fw-semibold text-primary">View details</span>
									</div>
								</Card.Body>
							</Link>
						</Card>
					</Col>
				))}
			</Row>
		</section>
	);
}

export default HomeScreen;
