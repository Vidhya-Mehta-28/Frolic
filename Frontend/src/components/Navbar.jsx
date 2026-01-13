import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FiHexagon, FiLogIn } from 'react-icons/fi';

const Navigation = () => {
    return (
        <Navbar expand="lg" className="glass-panel my-3 mx-4 py-2 sticky-top border-0">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2 fw-bold text-gradient fs-4">
                    <FiHexagon size={28} className="text-secondary" style={{ color: 'var(--accent-secondary)' }} />
                    FROLIC
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto gap-4 fw-medium">
                        <Nav.Link as={NavLink} to="/" end className="text-muted hover-gold">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/events" className="text-muted hover-gold">Events</Nav.Link>
                        <Nav.Link as={NavLink} to="/institutes" className="text-muted hover-gold">Institutes</Nav.Link>
                        <Nav.Link as={NavLink} to="/departments" className="text-muted hover-gold">Departments</Nav.Link>
                        <Nav.Link as={NavLink} to="/winners" className="text-muted hover-gold">Winners</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button as={NavLink} to="/login" variant="primary" className="d-flex align-items-center gap-2 px-4 shadow-sm text-white">
                            <FiLogIn /> Login
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
