import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { FiAward, FiStar, FiUser, FiPlus, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const WinnerDisplay = () => {
    const { user } = useAuth();
    const [eventResults, setEventResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // CRUD States
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        event: '', rank: 1, group: '', participant: '', prize: ''
    });

    // Dropdown data
    const [events, setEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [participants, setParticipants] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            try {
                const { data } = await api.get('/admin/winners');
                if (data.success) {
                    // Group winners by event
                    const grouped = data.data.reduce((acc, curr) => {
                        const eventId = curr.event?._id || curr.event;
                        const eventTitle = curr.event?.title || 'Unknown Event';
                        if (!acc[eventId]) acc[eventId] = { _id: eventId, eventName: eventTitle, winners: [] };
                        acc[eventId].winners.push(curr);
                        return acc;
                    }, {});
                    setEventResults(Object.values(grouped));
                }
            } catch (winnersErr) {
                console.log('Winners endpoint note:', winnersErr.message);
                setEventResults([]);
            }

            if (user?.role === 'admin' || user?.role === 'coordinator') {
                try {
                    const eRes = await api.get('/events?limit=1000');
                    const gRes = await api.get('/groups');
                    const pRes = await api.get('/participants');
                    
                    // Handle events response - get events from nested structure
                    let eventsList = [];
                    if (eRes.data.data?.events && Array.isArray(eRes.data.data.events)) {
                        eventsList = eRes.data.data.events;
                    } else if (Array.isArray(eRes.data.data)) {
                        eventsList = eRes.data.data;
                    } else if (eRes.data.success && eRes.data.data) {
                        // Try to extract events from response
                        eventsList = Object.values(eRes.data.data).find(val => Array.isArray(val)) || [];
                    }
                    console.log('Final events list:', eventsList);
                    setEvents(eventsList);
                    
                    // Handle groups response
                    let groupsList = [];
                    if (gRes.data.data?.groups && Array.isArray(gRes.data.data.groups)) {
                        groupsList = gRes.data.data.groups;
                    } else if (Array.isArray(gRes.data.data)) {
                        groupsList = gRes.data.data;
                    }
                    setGroups(groupsList);
                    
                    // Handle participants response
                    let participantsList = [];
                    if (pRes.data.data?.participants && Array.isArray(pRes.data.data.participants)) {
                        participantsList = pRes.data.data.participants;
                    } else if (Array.isArray(pRes.data.data)) {
                        participantsList = pRes.data.data;
                    }
                    setParticipants(participantsList);
                } catch (dropdownErr) {
                    console.error('Error fetching dropdown data:', dropdownErr);
                    alert('Error loading form data: ' + dropdownErr.message);
                }
            } else {
                console.log('User is not admin/coordinator:', user?.role);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch results');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (winner = null) => {
        if (winner) {
            setFormData({
                event: winner.event?._id || winner.event,
                rank: winner.rank,
                group: winner.group?._id || winner.group || '',
                participant: winner.participant?._id || winner.participant || '',
                prize: winner.prize
            });
            setEditMode(true);
            setSelectedId(winner._id);
        } else {
            setFormData({ event: '', rank: 1, group: '', participant: '', prize: '' });
            setEditMode(false);
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (!formData.event) {
                alert('Please select an event');
                return;
            }

            let res;
            if (editMode) {
                // Update existing winner
                res = await api.put(`/admin/winners/${selectedId}`, formData);
            } else {
                // Create new winner - use event-specific endpoint
                const payload = {
                    rank: formData.rank,
                    prize: formData.prize,
                    participant: formData.participant || undefined,
                    group: formData.group || undefined
                };
                res = await api.post(`/events/${formData.event}/winners`, payload);
            }
            if (res.data.success) {
                setShowModal(false);
                fetchData();
            }
        } catch (err) {
            console.error('Save error:', err);
            alert(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this winner record?')) {
            try {
                await api.delete(`/admin/winners/${id}`);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    const renderPodium = (winners) => {
        if (!winners || winners.length === 0) return null;

        const first = winners.find(w => w.rank === 1);
        const second = winners.find(w => w.rank === 2);
        const third = winners.find(w => w.rank === 3);

        return (
            <Row className="justify-content-center align-items-end g-3 mt-4">
                {/* 2nd Place */}
                {second && (
                    <Col xs={4} className="order-1">
                        <div className="text-center">
                            <div className="position-relative d-inline-block mb-2">
                                <div className="rounded-circle d-flex align-items-center justify-content-center bg-white border border-light shadow-sm mx-auto" style={{ width: '60px', height: '60px' }}>
                                    <span className="fw-bold text-muted fs-4">2</span>
                                </div>
                            </div>
                            <h6 className="fw-bold text-dark mb-0 small text-truncate">{second.group?.name || second.participant?.name || 'N/A'}</h6>
                            <small className="text-muted d-block">{second.prize}</small>
                            <div className="mt-2 rounded-top" style={{ height: '60px', background: 'linear-gradient(to top, #C0C0C0, transparent)', opacity: 0.1 }}></div>
                        </div>
                    </Col>
                )}

                {/* 1st Place */}
                {first && (
                    <Col xs={4} className="order-2">
                        <div className="text-center">
                            <div className="position-relative d-inline-block mb-3">
                                <FiAward size={40} className="text-gold-accent mb-2" />
                                <div className="rounded-circle d-flex align-items-center justify-content-center bg-white border-2 border-gold-accent mx-auto shadow" style={{ width: '80px', height: '80px' }}>
                                    <span className="fw-bold text-gold-accent fs-2">1</span>
                                </div>
                            </div>
                            <h5 className="fw-bold text-dark mb-0 text-truncate">{first.group?.name || first.participant?.name || 'N/A'}</h5>
                            <small className="text-gold-accent fw-bold d-block">{first.prize}</small>
                            <div className="mt-2 rounded-top" style={{ height: '80px', background: 'linear-gradient(to top, var(--gold-accent), transparent)', opacity: 0.15 }}></div>
                        </div>
                    </Col>
                )}

                {/* 3rd Place */}
                {third && (
                    <Col xs={4} className="order-3">
                        <div className="text-center">
                            <div className="position-relative d-inline-block mb-2">
                                <div className="rounded-circle d-flex align-items-center justify-content-center bg-white border border-light shadow-sm mx-auto" style={{ width: '60px', height: '60px' }}>
                                    <span className="fw-bold text-muted fs-4" style={{ color: '#CD7F32' }}>3</span>
                                </div>
                            </div>
                            <h6 className="fw-bold text-dark mb-0 small text-truncate">{third.group?.name || third.participant?.name || 'N/A'}</h6>
                            <small className="text-muted d-block">{third.prize}</small>
                            <div className="mt-2 rounded-top" style={{ height: '50px', background: 'linear-gradient(to top, #CD7F32, transparent)', opacity: 0.1 }}></div>
                        </div>
                    </Col>
                )}
            </Row>
        );
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="text-center flex-grow-1">
                    <h2 className="fw-bold display-5 text-gradient">Tournament Results</h2>
                    <p className="text-muted text-uppercase letter-spacing-2 fw-bold small">Hall of Champions</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'coordinator') && (
                    <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm text-white px-4 py-2" onClick={() => handleOpenModal()}>
                        <FiPlus /> DECLARE WINNER
                    </Button>
                )}
            </div>

            <Row xs={1} lg={2} className="g-4">
                {loading ? (
                    <Col xs={12} className="text-center py-5"><Spinner animation="border" /></Col>
                ) : eventResults.length > 0 ? eventResults.map((event, idx) => (
                    <Col key={idx}>
                        <Card className="glass-card h-100 border-0 shadow-sm overflow-hidden">
                            <Card.Header className="bg-transparent border-bottom border-light p-3 d-flex justify-content-between align-items-center">
                                <h4 className="fw-bold text-dark mb-0">{event.eventName}</h4>
                                {(user?.role === 'admin' || user?.role === 'coordinator') && (
                                    <Badge bg="light" className="text-muted border cursor-pointer" onClick={() => setShowModal(true)}>MNG</Badge>
                                )}
                            </Card.Header>
                            <Card.Body>
                                {renderPodium(event.winners)}
                                {(user?.role === 'admin' || user?.role === 'coordinator') && (
                                    <div className="mt-4 border-top pt-3">
                                        <Table size="sm" hover responsive className="mb-0 small">
                                            <thead>
                                                <tr>
                                                    <th>Rank</th>
                                                    <th>Winner</th>
                                                    <th>Prize</th>
                                                    <th className="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {event.winners.map(w => (
                                                    <tr key={w._id} style={{ verticalAlign: 'middle' }}>
                                                        <td className="fw-bold">{w.rank}</td>
                                                        <td className="text-muted">{w.group?.name || w.participant?.name}</td>
                                                        <td className="text-gold-accent fw-bold">{w.prize}</td>
                                                        <td className="text-end">
                                                            <Button variant="link" size="sm" className="p-0 me-2" onClick={() => handleOpenModal(w)}><FiEdit2 size={12} /></Button>
                                                            <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleDelete(w._id)}><FiTrash2 size={12} /></Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                )) : (
                    <Col xs={12} className="text-center py-5 text-muted">No results declared yet.</Col>
                )}
            </Row>

            {/* Winner CRUD Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editMode ? 'Edit Result' : 'Declare Result'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Event</Form.Label>
                            <Form.Select value={formData.event} onChange={(e) => setFormData({ ...formData, event: e.target.value })}>
                                <option value="">Select Event</option>
                                {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Rank</Form.Label>
                                    <Form.Select value={formData.rank} onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) })}>
                                        <option value={1}>1st Place</option>
                                        <option value={2}>2nd Place</option>
                                        <option value={3}>3rd Place</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted small">Prize</Form.Label>
                                    <Form.Control type="text" value={formData.prize} onChange={(e) => setFormData({ ...formData, prize: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold text-muted small">Winner Type</Form.Label>
                            <div className="d-flex gap-3 mb-2">
                                <Form.Check type="radio" label="Group" name="winnerType" checked={!!formData.group} onChange={() => setFormData({ ...formData, participant: '', group: 'placeholder' })} />
                                <Form.Check type="radio" label="Individual" name="winnerType" checked={!!formData.participant} onChange={() => setFormData({ ...formData, group: '', participant: 'placeholder' })} />
                            </div>
                            {formData.group !== '' && (
                                <Form.Select value={formData.group === 'placeholder' ? '' : formData.group} onChange={(e) => setFormData({ ...formData, group: e.target.value })}>
                                    <option value="">Select Group</option>
                                    {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                                </Form.Select>
                            )}
                            {formData.participant !== '' && (
                                <Form.Select value={formData.participant === 'placeholder' ? '' : formData.participant} onChange={(e) => setFormData({ ...formData, participant: e.target.value })}>
                                    <option value="">Select Participant</option>
                                    {participants.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </Form.Select>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" className="fw-bold px-4" onClick={handleSave}>{editMode ? 'UPDATE' : 'DECLARE'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default WinnerDisplay;
