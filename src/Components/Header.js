import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Badge, Navbar, Nav, Container } from 'react-bootstrap';
import { getCurrentUser, logoutUser } from '../authService';

function Header() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const syncSession = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('auth-changed', syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener('auth-changed', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const logoutHandler = () => {
    logoutUser();
    setCurrentUser(null);
    window.dispatchEvent(new Event('auth-changed'));
  };

  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="bg-primary" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">Service Directory</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/"><i className="fas fa-spa"></i> Services</Nav.Link>
            <Nav.Link as={Link} to="/chatbot"><i className="fas fa-robot"></i> Chatbot</Nav.Link>
            {currentUser ? <Nav.Link as={Link} to="/apply-seller"><i className="fas fa-store"></i> Apply Seller</Nav.Link> : null}
            {currentUser ? <Nav.Link as={Link} to="/profile"><i className="fas fa-id-card"></i> Profile</Nav.Link> : null}
            {currentUser && currentUser.role === 'Seller' ? <Nav.Link as={Link} to="/seller/dashboard"><i className="fas fa-briefcase"></i> Seller Dashboard</Nav.Link> : null}
            {currentUser && currentUser.role === 'Admin' ? <Nav.Link as={Link} to="/users"><i className="fas fa-users"></i> Users</Nav.Link> : null}
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                <Nav.Link disabled>
                  <i className="fas fa-user"></i> {currentUser.first_name}{' '}
                  <Badge bg="light" text="dark" pill>{currentUser.role}</Badge>
                </Nav.Link>
                <Nav.Link as={Link} to="/" onClick={logoutHandler}><i className="fas fa-right-from-bracket"></i> Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signin"><i className="fas fa-right-to-bracket"></i> Sign In</Nav.Link>
                <Nav.Link as={Link} to="/signup"><i className="fas fa-user-plus"></i> Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
