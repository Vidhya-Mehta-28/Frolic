import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Container } from 'react-bootstrap';

const AdminLayout = () => {
    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <main className="flex-grow-1 p-4" style={{ overflowY: 'auto', height: '100vh' }}>
                <Container fluid>
                    <Outlet />
                </Container>
            </main>
        </div>
    );
};

export default AdminLayout;
