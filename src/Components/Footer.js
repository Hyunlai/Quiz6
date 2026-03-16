import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <Container fluid className="p-0 mt-4 bg-dark border-top border-secondary shadow">
        <Row className="g-0">
            <Col md={12} className="text-center text-light py-3">
                <p className="mb-0">&copy; {new Date().getFullYear()} My React App. All rights reserved.</p>
            </Col>
      </Row>
    </Container>
  )
}

export default Footer
