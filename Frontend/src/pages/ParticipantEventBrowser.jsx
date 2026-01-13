import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiUserPlus } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ParticipantEventBrowser = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrationType, setRegistrationType] = useState('new'); // 'new' or 'existing'
    const [groups, setGroups] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        groupName: '',
        groupId: '',
        name: '',
        email: user?.email || '',
        institute: '',
        department: '',
        isGroupLeader: false
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchEvents();
        fetchInstitutes();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/events');
            if (data.success) {
                setEvents(data.data.events || data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstitutes = async () => {
        try {
            const { data } = await api.get('/institutes');
            if (data.success) {
                setInstitutes(data.data.institutes || data.data);
            }
        } catch (err) {
            console.error('Failed to fetch institutes');
        }
    };

    const handleInstituteChange = async (instId) => {
        setFormData({ ...formData, institute: instId, department: '' });
        if (instId) {
            try {
                const { data } = await api.get(`/institutes/${instId}/departments`);
                if (data.success) {
                    setDepartments(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch departments');
            }
        } else {
            setDepartments([]);
        }
    };

    const handleRegisterClick = async (event) => {
        setSelectedEvent(event);
        setFormData({
            ...formData,
            name: user?.username || '',
            email: user?.email || ''
        });

        // Fetch existing groups for this event
        try {
            const { data } = await api.get(`/events/${event._id}/groups`);
            if (data.success) {
                setGroups(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch groups');
        }

        setShowModal(true);
    };

    const handleSubmit = async () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.institute) errors.institute = 'Institute is required';
        if (!formData.department) errors.department = 'Department is required';

        if (registrationType === 'new' && !formData.groupName.trim()) {
            errors.groupName = 'Group name is required';
        }
        if (registrationType === 'existing' && !formData.groupId) {
            errors.groupId = 'Please select a group';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            let groupId = formData.groupId;

            // Create new group if needed
            if (registrationType === 'new') {
                const groupRes = await api.post(`/events/${selectedEvent._id}/groups`, {
                    name: formData.groupName,
                    event: selectedEvent._id
                });
                if (groupRes.data.success) {
                    groupId = groupRes.data.data._id;
                }
            }

            // Add participant to group
            const participantRes = await api.post(`/groups/${groupId}/participants`, {
                name: formData.name,
                email: formData.email,
                institute: formData.institute,
                department: formData.department,
                isGroupLeader: registrationType === 'new' ? true : formData.isGroupLeader
            });

            if (participantRes.data.success) {
                alert('Successfully registered for the event!');
                setShowModal(false);
                setFormData({
                    groupName: '',
                    groupId: '',
                    name: '',
                    email: user?.email || '',
                    institute: '',
                    department: '',
                    isGroupLeader: false
                });
            }
        } catch (err) {
            setFormErrors({ general: err.response?.data?.message || 'Registration failed' });
        }
    };

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading events...</p>
        </Container>
    );

    if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;

    return (
        <Container fluid className="py-4">
            <div className="mb-5">
                <h1 className="fw-bold display-6 mb-1">Browse <span className="text-gradient">Events</span></h1>
                <p className="text-muted">Register for upcoming events and competitions</p>
            </div>

            <Row className="g-4">
                {events.length > 0 ? events.map(event => (
                    <Col key={event._id} md={6} lg={4}>
                        <Card className="glass-panel border-0 h-100 shadow-sm hover-lift">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <Badge bg="soft-gold" className="text-gold-accent px-3 py-2">{event.category}</Badge>
                                    <Badge bg="soft-green" className="text-emerald-green px-3 py-2">
                                        <FiUsers className="me-1" /> {event.maxGroupsAllowed} teams
                                    </Badge>
                                </div>
                                <h5 className="fw-bold mb-3">{event.title}</h5>
                                <p className="text-muted small mb-4">{event.description?.substring(0, 100)}...</p>

                                <div className="mb-2 small text-muted">
                                    <FiCalendar className="me-2 text-gold-accent" />
                                    {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="mb-2 small text-muted">
                                    <FiClock className="me-2 text-gold-accent" />
                                    {event.time}
                                </div>
                                <div className="mb-4 small text-muted">
                                    <FiMapPin className="me-2 text-gold-accent" />
                                    {event.location}
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-100 fw-bold py-2"
                                    onClick={() => handleRegisterClick(event)}
                                >
                                    <FiUserPlus className="me-2" /> Register Now
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : (
                    <Col>
                        <Alert variant="info">No events available at the moment.</Alert>
                    </Col>
                )}
            </Row>

            {/* Registration Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Register for {selectedEvent?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form>
                        {/* Registration Type Selection */}
                        <div className="mb-4 p-3 bg-light rounded-3">
                            <Form.Label className="fw-bold text-muted small mb-3">Registration Type</Form.Label>
                            <div className="d-flex gap-3">
                                <Form.Check
                                    type="radio"
                                    label="Create New Group"
                                    name="registrationType"
                                    checked={registrationType === 'new'}
                                    onChange={() => setRegistrationType('new')}
                                    className="fw-bold"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Join Existing Group"
                                    name="registrationType"
                                    checked={registrationType === 'existing'}
                                    onChange={() => setRegistrationType('existing')}
                                    className="fw-bold"
                                />
                            </div>
                        </div>

                        {/* Group Selection/Creation */}
                        {registrationType === 'new' ? (
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-muted small">Group Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Team Awesome"
                                    value={formData.groupName}
                                    onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                                    isInvalid={!!formErrors.groupName}
                                />
                                <Form.Control.Feedback type="invalid">{formErrors.groupName}</Form.Control.Feedback>
                            </Form.Group>
                        ) : (
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-muted small">Select Group</Form.Label>
                                <Form.Select
                                    value={formData.groupId}
                                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                                    isInvalid={!!formErrors.groupId}
                                >
                                    <option value="">Choose a group...</option>
                                    {groups.map(group => (
                                        <option key={group._id} value={group._id}>{group.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{formErrors.groupId}</Form.Control.Feedback>
                            </Form.Group>
                        )}

                        {/* Participant Details */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Your Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        isInvalid={!!formErrors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        isInvalid={!!formErrors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Institute</Form.Label>
                                    <Form.Select
                                        value={formData.institute}
                                        onChange={(e) => handleInstituteChange(e.target.value)}
                                        isInvalid={!!formErrors.institute}
                                    >
                                        <option value="">Select Institute</option>
                                        {institutes.map(inst => (
                                            <option key={inst._id} value={inst._id}>{inst.name}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{formErrors.institute}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Department</Form.Label>
                                    <Form.Select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        isInvalid={!!formErrors.department}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{formErrors.department}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {registrationType === 'existing' && (
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="I am the group leader"
                                    checked={formData.isGroupLeader}
                                    onChange={(e) => setFormData({ ...formData, isGroupLeader: e.target.checked })}
                                />
                            </Form.Group>
                        )}

                        {formErrors.general && <Alert variant="danger" className="py-2 small">{formErrors.general}</Alert>}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} className="px-4">
                        Complete Registration
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ParticipantEventBrowser;
