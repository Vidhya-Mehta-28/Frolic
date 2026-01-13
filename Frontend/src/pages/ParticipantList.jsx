import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Badge, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { FiPlus, FiUser, FiMail, FiBriefcase, FiFilter, FiEdit2, FiTrash2, FiStar, FiArrowLeft } from 'react-icons/fi';
import { useLocation, Link } from 'react-router-dom';
import api from '../utils/api';

const ParticipantList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupId = queryParams.get('groupId');

    const [participants, setParticipants] = useState([]);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', institute: '', department: '', isGroupLeader: false });
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [errors, setErrors] = useState({});

    // For dropdowns
    const [institutes, setInstitutes] = useState([]);
    const [departments, setDepartments] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const endpoint = groupId ? `/groups/${groupId}/participants` : '/participants';
            const { data } = await api.get(endpoint);
            if (data.success) {
                setParticipants(data.data.participants || data.data);
            }

            if (groupId) {
                const groupRes = await api.get(`/groups/${groupId}`);
                if (groupRes.data.success) {
                    setGroup(groupRes.data.data);
                }
            }

            // Fetch institutes for the dropdown
            const instRes = await api.get('/institutes');
            if (instRes.data.success) {
                setInstitutes(instRes.data.data.institutes || instRes.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch participants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId]);

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

    const handleOpenModal = (p = null) => {
        if (p) {
            setFormData({
                name: p.name,
                email: p.email,
                institute: p.institute?._id || p.institute,
                department: p.department?._id || p.department,
                isGroupLeader: p.isGroupLeader
            });
            if (p.institute) handleInstituteChange(p.institute?._id || p.institute);
            setEditMode(true);
            setSelectedId(p._id);
        } else {
            setFormData({ name: '', email: '', institute: '', department: '', isGroupLeader: false });
            setEditMode(false);
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            setErrors({ general: 'Name and Email are required' });
            return;
        }

        try {
            let res;
            if (editMode) {
                res = await api.put(`/participants/${selectedId}`, formData);
            } else {
                if (!groupId) {
                    setErrors({ general: 'Group ID is required to add participant' });
                    return;
                }
                res = await api.post(`/groups/${groupId}/participants`, formData);
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
        if (window.confirm('Are you sure you want to remove this participant?')) {
            try {
                await api.delete(`/participants/${id}`);
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
                    <h2 className="fw-bold text-gradient mb-1">Participants <span className="text-dark">Registry</span></h2>
                    <p className="text-muted small mb-0">
                        {group ? `Team: ${group.name} | Event: ${group.event?.title || 'Unknown'}` : 'Full database of active event participants'}
                    </p>
                </div>
                <div className="d-flex gap-3">
                    {groupId && (
                        <Button variant="light" as={Link} to={`/admin/groups?eventId=${group?.event?._id}`} className="d-flex align-items-center gap-2 shadow-sm border-0 bg-white text-muted px-3">
                            <FiArrowLeft /> BACK TO GROUPS
                        </Button>
                    )}
                    <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm text-white px-4" onClick={() => handleOpenModal()}>
                        <FiPlus /> Add Participant
                    </Button>
                </div>
            </div>

            <div className="glass-panel p-0 overflow-hidden border-0 shadow-sm">
                <Table hover responsive className="mb-0">
                    <thead>
                        <tr>
                            <th className="py-3 px-4">#</th>
                            <th className="py-3">Participant Name</th>
                            <th className="py-3">Contact Email</th>
                            <th className="py-3">Enrolled Institute</th>
                            <th className="py-3">Status</th>
                            <th className="py-3 text-end px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" /></td></tr>
                        ) : error ? (
                            <tr><td colSpan="6" className="text-center py-5 text-danger">{error}</td></tr>
                        ) : participants.length > 0 ? participants.map((p, index) => (
                            <tr key={p._id} style={{ verticalAlign: 'middle' }}>
                                <td className="px-4 text-muted fw-bold">{index + 1}</td>
                                <td className="fw-bold">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center bg-soft-green text-emerald-green" style={{ width: '40px', height: '40px' }}>
                                            {p.isGroupLeader ? <FiStar className="text-gold-accent" /> : <FiUser size={20} />}
                                        </div>
                                        <div className="text-dark">
                                            {p.name}
                                            {p.isGroupLeader && <Badge bg="soft-gold" className="text-gold-accent ms-2 small">LEADER</Badge>}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-muted fw-medium small"><FiMail className="me-2 text-muted" />{p.email}</td>
                                <td className="text-muted fw-medium small">
                                    <FiBriefcase className="me-2 text-muted" />
                                    {p.institute?.name || 'N/A'}
                                    <div className="text-xs text-muted ps-4">{p.department?.name}</div>
                                </td>
                                <td>
                                    <Badge bg="transparent" className={`px-3 py-2 rounded-pill font-weight-bold border ${p.isGroupLeader ? 'text-gold-accent border-gold-accent' : 'text-primary border-primary'}`}>
                                        {p.isGroupLeader ? 'Leader' : 'Member'}
                                    </Badge>
                                </td>
                                <td className="text-end px-4">
                                    <Button variant="outline-primary" size="sm" className="me-2 rounded-3 border-0 bg-soft-gold" onClick={() => handleOpenModal(p)}>
                                        <FiEdit2 />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="me-2 rounded-3 border-0 bg-light" onClick={() => handleDelete(p._id)}>
                                        <FiTrash2 />
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="text-center py-4 text-muted">No participants found in this group</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {/* Participant Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editMode ? 'Edit Participant' : 'Add New Participant'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
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
                                    >
                                        <option value="">Select Institute</option>
                                        {institutes.map(inst => <option key={inst._id} value={inst._id}>{inst.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Department</Form.Label>
                                    <Form.Select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mt-2">
                            <Form.Check
                                type="checkbox"
                                label="Assign as Group Leader"
                                checked={formData.isGroupLeader}
                                onChange={(e) => setFormData({ ...formData, isGroupLeader: e.target.checked })}
                                className="fw-bold text-gold-accent"
                            />
                        </Form.Group>
                        {errors.general && <Alert variant="danger" className="mt-3 py-2 small">{errors.general}</Alert>}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>{editMode ? 'Save Changes' : 'Add to Group'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ParticipantList;
