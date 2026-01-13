import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPhone } from 'react-icons/fi';
import api from '../utils/api';

const InstituteList = () => {
    const [showModal, setShowModal] = useState(false);
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: '', location: '', contact: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [errors, setErrors] = useState({});

    const fetchInstitutes = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/institutes');
            if (data.success) {
                // Backend returns { success, data: { institutes, pagination }, message }
                setInstitutes(data.data.institutes || data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch institutes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Institute Name is required";
        if (!formData.location.trim()) newErrors.location = "Location is required";
        if (!formData.contact.trim()) newErrors.contact = "Contact is required";
        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            let res;
            if (editMode) {
                res = await api.put(`/institutes/${selectedId}`, formData);
            } else {
                res = await api.post('/institutes', formData);
            }

            if (res.data.success) {
                setShowModal(false);
                setFormData({ name: '', location: '', contact: '' });
                setEditMode(false);
                fetchInstitutes();
            } else {
                setErrors({ general: res.data.message });
            }
        } catch (err) {
            setErrors({ general: err.response?.data?.message || 'Operation failed' });
        }
    };

    const handleOpenModal = (inst = null) => {
        if (inst) {
            setFormData({ name: inst.name, location: inst.location, contact: inst.contact });
            setEditMode(true);
            setSelectedId(inst._id);
        } else {
            setFormData({ name: '', location: '', contact: '' });
            setEditMode(false);
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this institute? This may affect linked departments and events.')) {
            try {
                await api.delete(`/institutes/${id}`);
                fetchInstitutes();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete');
            }
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditMode(false);
        setErrors({});
    };

    return (
        <Container fluid className="py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-gradient mb-1">Institutes</h2>
                    <p className="text-muted small mb-0">Manage participating educational institutes</p>
                </div>
                <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm text-white px-4 py-2" onClick={() => handleOpenModal()}>
                    <FiPlus /> Add Institute
                </Button>
            </div>

            <div className="glass-panel p-0 overflow-hidden border-0">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Loading institutes...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="m-3">{error}</Alert>
                ) : (
                    <Table hover responsive className="mb-0">
                        <thead>
                            <tr>
                                <th className="py-3 px-4">#</th>
                                <th className="py-3">Institute Name</th>
                                <th className="py-3">Location</th>
                                <th className="py-3">Contact</th>
                                <th className="py-3 text-end px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {institutes.length > 0 ? institutes.map((inst, index) => (
                                <tr key={inst._id || inst.id} style={{ verticalAlign: 'middle' }}>
                                    <td className="px-4 text-muted fw-bold">{index + 1}</td>
                                    <td className="fw-bold text-dark">{inst.name}</td>
                                    <td className="text-muted"><FiMapPin className="me-2 text-gold-accent" />{inst.location}</td>
                                    <td className="text-muted"><FiPhone className="me-2 text-gold-accent" />{inst.contact}</td>
                                    <td className="text-end px-4">
                                        <Button variant="outline-gold" size="sm" className="me-2 rounded-3 hover-scale border-0 bg-soft-gold" onClick={() => handleOpenModal(inst)}>
                                            <FiEdit2 />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="rounded-3 hover-scale border-0 bg-light" onClick={() => handleDelete(inst._id)}>
                                            <FiTrash2 />
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">No institutes found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editMode ? 'Edit Institute' : 'Add New Institute'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Institute Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Stanford University"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: null });
                                }}
                                className="py-2"
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Location / Block</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. California, US"
                                value={formData.location}
                                onChange={(e) => {
                                    setFormData({ ...formData, location: e.target.value });
                                    if (errors.location) setErrors({ ...errors, location: null });
                                }}
                                className="py-2"
                                isInvalid={!!errors.location}
                            />
                            <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Contact Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. +1 555 123 4567"
                                value={formData.contact}
                                onChange={(e) => {
                                    setFormData({ ...formData, contact: e.target.value });
                                    if (errors.contact) setErrors({ ...errors, contact: null });
                                }}
                                className="py-2"
                                isInvalid={!!errors.contact}
                            />
                            <Form.Control.Feedback type="invalid">{errors.contact}</Form.Control.Feedback>
                        </Form.Group>
                        {errors.general && <Alert variant="danger" className="py-2 small">{errors.general}</Alert>}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="fw-bold text-muted" onClick={handleClose}>CANCEL</Button>
                    <Button variant="primary" className="fw-bold px-4" onClick={handleSave}>{editMode ? 'UPDATE' : 'SAVE'} INSTITUTE</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default InstituteList;
