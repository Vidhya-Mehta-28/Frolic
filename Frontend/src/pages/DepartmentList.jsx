import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiMail } from 'react-icons/fi';
import api from '../utils/api';

const DepartmentList = () => {
    const [showModal, setShowModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [institutes, setInstitutes] = useState([]); // To select institute when adding
    const [formData, setFormData] = useState({ name: '', hod: '', contactEmail: '', institute: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [errors, setErrors] = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            const [deptRes, instRes] = await Promise.all([
                api.get('/departments'),
                api.get('/institutes')
            ]);

            if (deptRes.data.success) {
                setDepartments(deptRes.data.data.departments || deptRes.data.data);
            }
            if (instRes.data.success) {
                setInstitutes(instRes.data.data.institutes || instRes.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Department Name is required";
        if (!formData.hod.trim()) newErrors.hod = "Head of Department is required";
        if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact Email is required";
        if (!formData.institute) newErrors.institute = "Institute is required";
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
                res = await api.put(`/departments/${selectedId}`, formData);
            } else {
                res = await api.post('/departments', formData);
            }

            if (res.data.success) {
                setShowModal(false);
                setFormData({ name: '', hod: '', contactEmail: '', institute: '' });
                setEditMode(false);
                fetchData();
            } else {
                setErrors({ general: res.data.message });
            }
        } catch (err) {
            setErrors({ general: err.response?.data?.message || 'Operation failed' });
        }
    };

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setFormData({
                name: dept.name,
                hod: dept.hod || '',
                contactEmail: dept.contactEmail || '',
                institute: dept.institute?._id || dept.institute
            });
            setEditMode(true);
            setSelectedId(dept._id);
        } else {
            setFormData({ name: '', hod: '', contactEmail: '', institute: '' });
            setEditMode(false);
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department? This will affect linked events.')) {
            try {
                await api.delete(`/departments/${id}`);
                fetchData();
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
                    <h2 className="fw-bold text-gradient mb-1">Departments</h2>
                    <p className="text-muted small mb-0">Organization of academic divisions</p>
                </div>
                <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm text-white px-4 py-2" onClick={() => handleOpenModal()}>
                    <FiPlus /> Add Department
                </Button>
            </div>

            <div className="glass-panel p-0 overflow-hidden border-0">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Loading departments...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="m-3">{error}</Alert>
                ) : (
                    <Table hover responsive className="mb-0">
                        <thead>
                            <tr>
                                <th className="py-3 px-4">#</th>
                                <th className="py-3">Department Name</th>
                                <th className="py-3">Institute</th>
                                <th className="py-3">Description</th>
                                <th className="py-3 text-end px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length > 0 ? departments.map((dept, index) => (
                                <tr key={dept._id || dept.id} style={{ verticalAlign: 'middle' }}>
                                    <td className="px-4 text-muted fw-bold">{index + 1}</td>
                                    <td className="fw-bold text-dark">{dept.name}</td>
                                    <td className="text-muted">{dept.institute?.name || 'N/A'}</td>
                                    <td className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>{dept.description || 'No description'}</td>
                                    <td className="text-end px-4">
                                        <Button variant="outline-gold" size="sm" className="me-2 rounded-3 hover-scale border-0 bg-soft-gold" onClick={() => handleOpenModal(dept)}>
                                            <FiEdit2 />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="rounded-3 hover-scale border-0 bg-light" onClick={() => handleDelete(dept._id)}>
                                            <FiTrash2 />
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">No departments found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editMode ? 'Edit Department' : 'Add Department'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Department Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Computer Science"
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
                            <Form.Label className="fw-bold text-muted small">Institute</Form.Label>
                            <Form.Select
                                value={formData.institute}
                                onChange={(e) => {
                                    setFormData({ ...formData, institute: e.target.value });
                                    if (errors.institute) setErrors({ ...errors, institute: null });
                                }}
                                className="py-2"
                                isInvalid={!!errors.institute}
                            >
                                <option value="">Select Institute</option>
                                {institutes.map(inst => (
                                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.institute}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Head of Department</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Dr. John Smith"
                                value={formData.hod}
                                onChange={(e) => {
                                    setFormData({ ...formData, hod: e.target.value });
                                    if (errors.hod) setErrors({ ...errors, hod: null });
                                }}
                                className="py-2"
                                isInvalid={!!errors.hod}
                            />
                            <Form.Control.Feedback type="invalid">{errors.hod}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Contact Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="e.g. cs@university.edu"
                                value={formData.contactEmail}
                                onChange={(e) => {
                                    setFormData({ ...formData, contactEmail: e.target.value });
                                    if (errors.contactEmail) setErrors({ ...errors, contactEmail: null });
                                }}
                                className="py-2"
                                isInvalid={!!errors.contactEmail}
                            />
                            <Form.Control.Feedback type="invalid">{errors.contactEmail}</Form.Control.Feedback>
                        </Form.Group>
                        {errors.general && <Alert variant="danger" className="py-2 small">{errors.general}</Alert>}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="fw-bold text-muted" onClick={handleClose}>CANCEL</Button>
                    <Button variant="primary" className="fw-bold px-4" onClick={handleSave}>{editMode ? 'UPDATE' : 'SAVE'} DEPARTMENT</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DepartmentList;
