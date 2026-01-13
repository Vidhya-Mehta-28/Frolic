import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Modal, Table, Badge } from 'react-bootstrap';
import { FiCalendar, FiMapPin, FiClock, FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const EventList = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    // CRUD States
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', time: '', location: '', category: '', rules: '',
        groupMinParticipants: 1, groupMaxParticipants: 4, maxGroupsAllowed: 10
    });
    const [departments, setDepartments] = useState([]);

    const fetchData = async (query = '') => {
        try {
            setLoading(true);
            const { data } = await api.get(`/events?q=${query}`);
            if (data.success) {
                setEvents(data.data.events || data.data);
            }
            const deptRes = await api.get('/departments');
            if (deptRes.data.success) {
                setDepartments(deptRes.data.data.departments || deptRes.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (event = null) => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                date: event.date?.split('T')[0] || event.date,
                time: event.time,
                location: event.location,
                category: event.category,
                department: event.department?._id || event.department,
                rules: Array.isArray(event.rules) ? event.rules.join('\n') : event.rules,
                groupMinParticipants: event.groupMinParticipants,
                groupMaxParticipants: event.groupMaxParticipants,
                maxGroupsAllowed: event.maxGroupsAllowed
            });
            setEditMode(true);
            setSelectedId(event._id);
        } else {
            setFormData({
                title: '', description: '', date: '', time: '', location: '', category: '', rules: '',
                groupMinParticipants: 1, groupMaxParticipants: 4, maxGroupsAllowed: 10, department: ''
            });
            setEditMode(false);
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                rules: formData.rules.split('\n').filter(r => r.trim()),
                department: formData.department || undefined // Send undefined instead of empty string
            };
            let res;
            if (editMode) {
                res = await api.put(`/events/${selectedId}`, payload);
            } else {
                res = await api.post('/events', payload);
            }
            if (res.data.success) {
                setShowModal(false);
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Save failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    // Helper to format date if it's an ISO string
    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <Container fluid>
            <div className="d-md-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-gradient mb-1">Discover <span className="text-dark">Events</span></h2>
                    <p className="text-muted fw-medium">Join the most exciting events of the year</p>
                </div>
                <Form onSubmit={(e) => { e.preventDefault(); fetchData(search); }} className="mt-3 mt-md-0 d-flex gap-2">
                    <div className="input-group overflow-hidden rounded-3 border">
                        <span className="input-group-text bg-white border-0 text-muted"><FiSearch /></span>
                        <Form.Control
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border-0 ps-0 shadow-none py-2"
                        />
                    </div>
                    {(user?.role === 'admin' || user?.role === 'coordinator') && (
                        <Button variant="primary" className="d-flex align-items-center gap-2 px-4 shadow-sm" onClick={() => handleOpenModal()}>
                            <FiPlus /> ADD
                        </Button>
                    )}
                </Form>
            </div>

            <div className="glass-panel p-0 overflow-hidden border-0 shadow-sm mb-4">
                {loading ? (
                    <div className="text-center w-100 py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Searching for events...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="w-100">{error}</Alert>
                ) : (
                    <Table hover responsive className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3 px-4 text-uppercase small fw-bold">Event Title</th>
                                <th className="py-3 text-uppercase small fw-bold">Category</th>
                                <th className="py-3 text-uppercase small fw-bold">Date & Time</th>
                                <th className="py-3 text-uppercase small fw-bold">Location</th>
                                <th className="py-3 text-uppercase small fw-bold">Department</th>
                                <th className="py-3 text-end px-4 text-uppercase small fw-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length > 0 ? events.map((event) => (
                                <tr key={event._id} style={{ verticalAlign: 'middle' }}>
                                    <td className="px-4">
                                        <div className="fw-bold text-dark">{event.title}</div>
                                        <small className="text-muted d-block text-truncate" style={{ maxWidth: '200px' }}>{event.description}</small>
                                    </td>
                                    <td>
                                        <Badge bg="soft-gold" className="text-gold-accent px-3 py-2 rounded-pill">{event.category}</Badge>
                                    </td>
                                    <td>
                                        <div className="small fw-medium d-flex align-items-center gap-2">
                                            <FiCalendar className="text-gold-accent" /> {formatDate(event.date)}
                                        </div>
                                        <div className="text-muted extra-small d-flex align-items-center gap-2 mt-1">
                                            <FiClock className="text-muted" /> {event.time}
                                        </div>
                                    </td>
                                    <td className="text-muted small">
                                        <FiMapPin className="text-gold-accent me-1" /> {event.location}
                                    </td>
                                    <td>
                                        <Badge bg="light" className="text-dark border">{event.department?.name || 'All'}</Badge>
                                    </td>
                                    <td className="text-end px-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button as={Link} to={`/events/${event._id}`} variant="light" size="sm" className="rounded-3 border-0 bg-secondary bg-opacity-10 px-3">
                                                VIEW
                                            </Button>
                                            {(user?.role === 'admin' || user?.role === 'coordinator') && (
                                                <>
                                                    <Button variant="outline-primary" size="sm" className="rounded-3 border-0 bg-soft-gold" onClick={() => handleOpenModal(event)}>
                                                        <FiEdit2 />
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm" className="rounded-3 border-0 bg-light" onClick={() => handleDelete(event._id)}>
                                                        <FiTrash2 />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        No events found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>
            {/* Event CRUD Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-gradient">{editMode ? 'Refine Event' : 'Host New Event'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Event Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Mega Hackathon 2026"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Time</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. 10:00 AM"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Venue / Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Category</Form.Label>
                                    <Form.Select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Sports">Sports</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Department</Form.Label>
                                    <Form.Select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Min Per Group</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.groupMinParticipants}
                                        onChange={(e) => setFormData({ ...formData, groupMinParticipants: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Max Per Group</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.groupMaxParticipants}
                                        onChange={(e) => setFormData({ ...formData, groupMaxParticipants: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Max Teams Allowed</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.maxGroupsAllowed}
                                        onChange={(e) => setFormData({ ...formData, maxGroupsAllowed: e.target.checked })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-muted small">Rules (One per line)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter rules separated by enters..."
                                        value={formData.rules}
                                        onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" className="px-4 fw-bold" onClick={handleSave}>{editMode ? 'UPDATE EVENT' : 'CREATE EVENT'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EventList;
