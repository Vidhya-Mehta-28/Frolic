import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiCheckCircle, FiArrowLeft, FiEdit } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/events/${id}`);
                if (data.success) {
                    setEvent(data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch event details');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading event details...</p>
        </Container>
    );

    if (error) return (
        <Container className="py-5 text-center">
            <Alert variant="danger">{error}</Alert>
            <Link to="/events" className="btn btn-outline-primary">Back to Events</Link>
        </Container>
    );

    if (!event) return null;

    return (
        <Container className="py-2">
            <Link to="/events" className="text-muted fw-bold text-decoration-none mb-4 d-inline-block hover-gold transition-all">
                <FiArrowLeft className="me-2" /> Back to Explore
            </Link>

            <div className="glass-panel overflow-hidden border-0">
                <div style={{ height: '350px', background: event.image }} className="d-flex align-items-end p-5 position-relative">
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-20"></div>
                    <div className="position-relative z-1">
                        <Badge bg="white" className="text-dark py-2 px-3 mb-3 shadow-sm">{event.category}</Badge>
                        <h1 className="fw-bold display-3 text-white text-shadow mb-0">{event.title}</h1>
                    </div>
                </div>

                <div className="p-4 p-md-5 bg-white">
                    <Row className="g-5">
                        <Col lg={8}>
                            <h4 className="fw-bold mb-3">Event Insight</h4>
                            <p className="text-muted lead mb-5 lh-lg">{event.description}</p>

                            <h5 className="fw-bold mb-4">Guidelines & Conduct</h5>
                            <div className="glass-panel bg-light border-0 p-4">
                                <ul className="list-unstyled mb-0">
                                    {event.rules && typeof event.rules === 'string' ? (
                                        <li className="mb-3 d-flex align-items-start">
                                            <FiCheckCircle className="text-emerald-green me-3 mt-1 flex-shrink-0" size={20} />
                                            <span className="text-muted fw-medium">{event.rules}</span>
                                        </li>
                                    ) : (
                                        Array.isArray(event.rules) && event.rules.map((rule, idx) => (
                                            <li key={idx} className="mb-3 d-flex align-items-start">
                                                <FiCheckCircle className="text-emerald-green me-3 mt-1 flex-shrink-0" size={20} />
                                                <span className="text-muted fw-medium">{rule}</span>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div className="p-4 rounded-4 border bg-white shadow-sm sticky-top" style={{ top: '100px' }}>
                                <h5 className="fw-bold mb-4 pb-2 border-bottom">Logistics</h5>
                                <div className="mb-4 d-flex align-items-start">
                                    <div className="p-2 bg-soft-gold rounded-3 me-3">
                                        <FiCalendar size={22} className="text-gold-accent" />
                                    </div>
                                    <div>
                                        <small className="text-muted fw-bold text-uppercase ls-1">Date</small>
                                        <div className="fw-bold text-dark">{event.date}</div>
                                    </div>
                                </div>
                                <div className="mb-4 d-flex align-items-start">
                                    <div className="p-2 bg-soft-gold rounded-3 me-3">
                                        <FiClock size={22} className="text-gold-accent" />
                                    </div>
                                    <div>
                                        <small className="text-muted fw-bold text-uppercase ls-1">Time</small>
                                        <div className="fw-bold text-dark">{event.time}</div>
                                    </div>
                                </div>
                                <div className="mb-5 d-flex align-items-start">
                                    <div className="p-2 bg-soft-gold rounded-3 me-3">
                                        <FiMapPin size={22} className="text-gold-accent" />
                                    </div>
                                    <div>
                                        <small className="text-muted fw-bold text-uppercase ls-1">Venue</small>
                                        <div className="fw-bold text-dark">{event.location}</div>
                                    </div>
                                </div>

                                <Button variant="primary" size="lg" className="w-100 fw-bold py-3 shadow-lg rounded-3 mb-3">
                                    SECURE YOUR SPOT
                                </Button>

                                {(user?.role === 'admin' || user?.role === 'coordinator') && (
                                    <Button
                                        as={Link}
                                        to={`/admin/groups?eventId=${id}`}
                                        variant="outline-primary"
                                        size="lg"
                                        className="w-100 fw-bold py-3 rounded-3"
                                    >
                                        MANAGE GROUPS
                                    </Button>
                                )}
                                <p className="text-center text-muted small mt-3 mb-0">Max Groups: {event.maxGroupsAllowed || 'Unlimited'}</p>
                                <p className="text-center text-muted small mt-1 mb-0">Team Size: {event.groupMinParticipants}-{event.groupMaxParticipants}</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    );
};

export default EventDetail;
