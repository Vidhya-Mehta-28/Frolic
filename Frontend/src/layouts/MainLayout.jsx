import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navbar';
import { Container } from 'react-bootstrap';

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navigation />
            <Container className="flex-grow-1 py-4">
                <Outlet />
            </Container>
            <footer className="glass-panel mt-auto py-3 text-center text-muted mx-4 mb-3">
                <small>&copy; 2026 Frolic Event Management System. All rights reserved.</small>
            </footer>
        </div>
    );
};

export default MainLayout;
