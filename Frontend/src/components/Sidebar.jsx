import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiAward, FiLogOut, FiLayout } from 'react-icons/fi';

const Sidebar = () => {
    return (
        <div className="glass-panel h-100 d-flex flex-column p-4 m-3 me-0" style={{ width: '260px', borderRadius: '24px' }}>
            <div className="mb-5 px-2">
                <h4 className="fw-bold d-flex align-items-center gap-2 text-gradient">
                    <FiLayout className="text-warning" /> Admin Panel
                </h4>
            </div>

            <Nav className="flex-column gap-3 flex-grow-1">
                <Nav.Link as={NavLink} to="/admin/dashboard" className="text-muted d-flex align-items-center gap-3 px-3 py-2 rounded-pill transition-all hover-soft">
                    <FiHome size={20} /> Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/institutes" className="text-muted d-flex align-items-center gap-3 px-3 py-2 rounded-pill transition-all hover-soft">
                    <FiUsers size={20} /> Institutes
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/departments" className="text-muted d-flex align-items-center gap-3 px-3 py-2 rounded-pill transition-all hover-soft">
                    <FiLayout size={20} /> Departments
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/events" className="text-muted d-flex align-items-center gap-3 px-3 py-2 rounded-pill transition-all hover-soft">
                    <FiCalendar size={20} /> Events
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/participants" className="text-muted d-flex align-items-center gap-3 px-3 py-2 rounded-pill transition-all hover-soft">
                    <FiUsers size={20} /> Participants
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/winners" className="text-muted d-flex align-items-center gap-3 px-3 py-2 rounded-pill transition-all hover-soft">
                    <FiAward size={20} /> Winners
                </Nav.Link>
            </Nav>

            <div className="mt-auto border-top pt-4">
                <Nav.Link as={NavLink} to="/login" className="text-danger d-flex align-items-center gap-3 px-3 py-2 rounded-pill transition-all" style={{ backgroundColor: 'rgba(220, 53, 69, 0.05)' }}>
                    <FiLogOut size={20} /> Logout
                </Nav.Link>
            </div>
        </div>
    );
};

export default Sidebar;
