import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navigation from '../components/Navbar';
import { Container, Nav } from 'react-bootstrap';
import { FiHome, FiCalendar, FiAward } from 'react-icons/fi';

const ParticipantLayout = () => {
    const location = useLocation();

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navigation />
            <Container className="flex-grow-1 py-4">
                <div className="mb-4">
                    <h5 className="text-muted mb-3 fw-bold">My Portal</h5>
                    <Nav variant="pills" className="glass-panel p-2 d-inline-flex">
                        <Nav.Item>
                            <Nav.Link
                                as={Link}
                                to="/participant/dashboard"
                                active={location.pathname === '/participant/dashboard'}
                                className="d-flex align-items-center gap-2"
                            >
                                <FiHome /> Dashboard
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                as={Link}
                                to="/participant/events"
                                active={location.pathname === '/participant/events'}
                                className="d-flex align-items-center gap-2"
                            >
                                <FiCalendar /> Browse Events
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                as={Link}
                                to="/participant/results"
                                active={location.pathname === '/participant/results'}
                                className="d-flex align-items-center gap-2"
                            >
                                <FiAward /> Results
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <Outlet />
            </Container>
            <footer className="glass-panel mt-auto py-3 text-center text-muted mx-4 mb-3">
                <small>&copy; 2026 Frolic Event Management System. All rights reserved.</small>
            </footer>
        </div>
    );
};

export default ParticipantLayout;
