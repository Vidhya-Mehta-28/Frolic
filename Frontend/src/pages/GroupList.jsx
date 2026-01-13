import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FiPlus, FiUsers, FiLayers, FiSearch, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const GroupList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const eventId = queryParams.get('eventId');

    const [groups, setGroups] = useState([]);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', isPaymentDone: false, isPresent: false });
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [errors, setErrors] = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            const endpoint = eventId ? `/events/${eventId}/groups` : '/groups';
            const { data } = await api.get(endpoint);
            if (data.success) {
                setGroups(data.data.groups || data.data);
            }

            if (eventId) {
                const eventRes = await api.get(`/events/${eventId}`);
                if (eventRes.data.success) {
                    setEvent(eventRes.data.data);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [eventId]);

    const handleOpenModal = (group = null) => {
        if (group) {
            setFormData({ name: group.name, isPaymentDone: group.isPaymentDone, isPresent: group.isPresent });
            setEditMode(true);
            setSelectedId(group._id);
        } else {
            setFormData({ name: '', isPaymentDone: false, isPresent: false });
            setEditMode(false);
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setErrors({ name: 'Group Name is required' });
            return;
        }

        try {
            let res;
            if (editMode) {
                res = await api.put(`/groups/${selectedId}`, formData);
            } else {
                if (!eventId) {
                    setErrors({ general: 'Event ID is required to create a group' });
                    return;
                }
                res = await api.post(`/events/${eventId}/groups`, formData);
            }

            if (res.data.success) {
                setShowModal(false);
                fetchData();
            }
        } catch (err) {
            setErrors({ general: err.response?.data?.message || 'Operation failed' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            try {
                await api.delete(`/groups/${id}`);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete');
            }
        }
    };

    return (
        <Container fluid className="py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-gradient mb-1">Collaboration <span className="text-dark">Groups</span></h2>
                    <p className="text-muted small mb-0">
                        {event ? `Managing teams for: ${event.title}` : 'Managing team formations and registrations'}
                    </p>
                </div>
                <div className="d-flex gap-3">
                    <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm text-white px-4" onClick={() => handleOpenModal()}>
                        <FiPlus /> New Group
                    </Button>
                </div>
            </div>

            <div className="glass-panel p-0 overflow-hidden border-0 shadow-sm">
                <Table hover responsive className="mb-0">
                    <thead>
                        <tr>
                            <th className="py-3 px-4">#</th>
                            <th className="py-3">Group Identity</th>
                            <th className="py-3">Member Count</th>
                            <th className="py-3">Registered Events</th>
                            <th className="py-3 text-end px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" /></td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="text-center py-5 text-danger">{error}</td></tr>
                        ) : groups.length > 0 ? groups.map((group, index) => (
                            <tr key={group._id} style={{ verticalAlign: 'middle' }}>
                                <td className="px-4 text-muted fw-bold">{index + 1}</td>
                                <td className="fw-bold text-dark">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 bg-soft-gold rounded-3 text-gold-accent">
                                            <FiUsers size={18} />
                                        </div>
                                        {group.name}
                                    </div>
                                </td>
                                <td className="text-muted fw-medium text-center">
                                    <Badge bg="light" className="text-dark border">{group.participants?.length || 0} Members</Badge>
                                </td>
                                <td className="text-muted fw-medium">
                                    <div className="d-flex flex-column gap-1">
                                        <small className="d-flex align-items-center">
                                            {group.isPaymentDone ? <FiCheck className="text-success me-1" /> : <FiX className="text-danger me-1" />}
                                            Payment: {group.isPaymentDone ? 'Done' : 'Pending'}
                                        </small>
                                        <small className="d-flex align-items-center">
                                            {group.isPresent ? <FiCheck className="text-success me-1" /> : <FiX className="text-danger me-1" />}
                                            Attendance: {group.isPresent ? 'Present' : 'Absent'}
                                        </small>
                                    </div>
                                </td>
                                <td className="text-end px-4">
                                    <Button variant="outline-primary" size="sm" className="me-2 rounded-3 border-0 bg-soft-gold" onClick={() => handleOpenModal(group)}>
                                        <FiEdit2 />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="me-2 rounded-3 border-0 bg-light" onClick={() => handleDelete(group._id)}>
                                        <FiTrash2 />
                                    </Button>
                                    <Button
                                        as={Link}
                                        to={`/admin/participants?groupId=${group._id}`}
                                        variant="light"
                                        size="sm"
                                        className="fw-bold text-muted px-3 py-2 border-0 bg-secondary bg-opacity-10"
                                    >
                                        MEMBERS
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center py-4">No groups found</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {/* Group Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editMode ? 'Edit Group' : 'New Group'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Team Alpha"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex gap-4 mt-4 p-3 bg-light rounded-3">
                            <Form.Check
                                type="switch"
                                label="Payment Done"
                                checked={formData.isPaymentDone}
                                onChange={(e) => setFormData({ ...formData, isPaymentDone: e.target.checked })}
                            />
                            <Form.Check
                                type="switch"
                                label="Present"
                                checked={formData.isPresent}
                                onChange={(e) => setFormData({ ...formData, isPresent: e.target.checked })}
                            />
                        </div>
                        {errors.general && <Alert variant="danger" className="mt-3 py-2 small">{errors.general}</Alert>}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>{editMode ? 'Update group' : 'Create group'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GroupList;
