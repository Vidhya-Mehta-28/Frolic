import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ListGroup, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FiCalendar, FiClock, FiAward, FiBell, FiCheckCircle, FiUsers, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ParticipantDashboard = () => {
    const { user } = useAuth();
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyRegistrations();
    }, []);

    const fetchMyRegistrations = async () => {
        try {
            setLoading(true);
            // Fetch all participants and filter by user's email
            const { data } = await api.get('/participants');
            if (data.success) {
                const participants = data.data.participants || data.data;
                const myParticipations = participants.filter(p => p.email === user?.email);
                setMyRegistrations(myParticipations);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-5 d-flex align-items-center justify-content-between">
                <div>
                    <h2 className="fw-bold text-gradient">Hello, {user?.username || 'Student'}!</h2>
                    <p className="text-muted">Ready for your next challenge?</p>
                </div>
                <Button
                    as={Link}
                    to="/participant/events"
                    variant="primary"
                    className="d-flex align-items-center gap-2 px-4"
                >
                    Browse Events
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading your registrations...</p>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row className="g-4 mb-5">
                    <Col md={8}>
                        <h5 className="fw-bold text-dark mb-3">My Registered Events</h5>
                        {myRegistrations.length > 0 ? (
                            <Row className="g-3">
                                {myRegistrations.map((registration, index) => (
                                    <Col md={6} key={index}>
                                        <Card className="glass-card border-0 h-100 hover-lift">
                                            <Card.Body className="p-3">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <Badge bg="soft-gold" className="text-gold-accent">
                                                        {registration.group?.event?.category || 'Event'}
                                                    </Badge>
                                                    {registration.isGroupLeader && (
                                                        <Badge bg="soft-green" className="text-emerald-green">
                                                            Leader
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h5 className="fw-bold text-dark mb-2">
                                                    {registration.group?.event?.title || 'Event'}
                                                </h5>
                                                <p className="text-muted small mb-2">
                                                    <FiUsers className="me-1" /> Group: {registration.group?.name}
                                                </p>
                                                <p className="text-muted small mb-2">
                                                    <FiMapPin className="me-1" /> {registration.group?.event?.location}
                                                </p>
                                                <p className="text-muted small mb-3">
                                                    <FiCalendar className="me-1" />
                                                    {registration.group?.event?.date ?
                                                        new Date(registration.group.event.date).toLocaleDateString() :
                                                        'TBA'}
                                                </p>
                                                <div className="d-flex gap-2">
                                                    {registration.group?.isPaymentDone ? (
                                                        <Badge bg="success" className="px-3 py-2">✓ Paid</Badge>
                                                    ) : (
                                                        <Badge bg="warning" className="text-dark px-3 py-2">Pending Payment</Badge>
                                                    )}
                                                    {registration.group?.isPresent && (
                                                        <Badge bg="info" className="px-3 py-2">Attended</Badge>
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Card className="glass-panel border-0 text-center py-5">
                                <Card.Body>
                                    <FiCalendar size={48} className="text-muted mb-3" />
                                    <h5 className="text-muted mb-3">No Registrations Yet</h5>
                                    <p className="text-muted mb-4">Start by browsing available events!</p>
                                    <Button as={Link} to="/participant/events" variant="primary" className="px-4">
                                        Browse Events
                                    </Button>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>

                    <Col md={4}>
                        <Card className="glass-panel border-0 h-100">
                            <Card.Header className="bg-transparent border-0 p-4 pb-2">
                                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                                    <FiAward className="text-warning" /> Quick Stats
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <div className="mb-4 p-3 bg-soft-gold rounded-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <small className="text-muted fw-bold">Total Registrations</small>
                                            <h3 className="fw-bold text-dark mb-0">{myRegistrations.length}</h3>
                                        </div>
                                        <FiCalendar size={32} className="text-gold-accent" />
                                    </div>
                                </div>
                                <div className="mb-4 p-3 bg-soft-green rounded-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <small className="text-muted fw-bold">As Leader</small>
                                            <h3 className="fw-bold text-dark mb-0">
                                                {myRegistrations.filter(r => r.isGroupLeader).length}
                                            </h3>
                                        </div>
                                        <FiUsers size={32} className="text-emerald-green" />
                                    </div>
                                </div>
                                <Button as={Link} to="/winners" variant="outline-primary" className="w-100">
                                    View All Winners
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default ParticipantDashboard;
