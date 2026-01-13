import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ProgressBar, Badge, Spinner, Alert } from 'react-bootstrap';
import { FiUsers, FiCalendar, FiBriefcase, FiAward, FiActivity, FiTrendingUp, FiArrowRight, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, icon, color, trend }) => (
    <Card className="glass-card h-100 border-0 shadow-sm overflow-hidden">
        <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className={`p-3 rounded-2`} style={{ backgroundColor: `${color}15`, color: color }}>
                    {icon}
                </div>
                {trend && (
                    <Badge bg="transparent" className="text-success border border-success border-opacity-25 px-2 py-1">
                        <FiTrendingUp className="me-1" /> {trend}
                    </Badge>
                )}
            </div>
            <div>
                <h6 className="text-muted mb-2 fw-semibold text-uppercase small ls-1">{title}</h6>
                <h2 className="fw-bold mb-0 text-dark" style={{ fontSize: '2rem' }}>{count}</h2>
            </div>
        </Card.Body>
        <div style={{ height: '4px', background: color, opacity: 0.3 }}></div>
    </Card>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        participants: 0,
        events: 0,
        institutes: 0,
        winners: 0
    });
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, recentRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/recent')
            ]);

            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
            if (recentRes.data.success) {
                setRecent(recentRes.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading dashboard intelligence...</p>
        </div>
    );

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="animate-fade-in">
            <div className="mb-5 d-flex justify-content-between align-items-end">
                <div>
                    <h1 className="fw-bold display-6 mb-1">General <span className="text-gradient">Overview</span></h1>
                    <p className="text-muted mb-0">System heartbeat is stable. Managed by Admin.</p>
                </div>
                <div className="text-end d-none d-md-block">
                    <h6 className="fw-bold text-dark mb-0">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h6>
                    <small className="text-muted">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </div>
            </div>

            <Row className="g-4 mb-5">
                <Col md={3}>
                    <StatCard title="Total Participants" count={stats.participants} icon={<FiUsers size={24} />} color="#D4AF37" />
                </Col>
                <Col md={3}>
                    <StatCard title="Active Events" count={stats.events} icon={<FiCalendar size={24} />} color="#10B981" />
                </Col>
                <Col md={3}>
                    <StatCard title="Institutes" count={stats.institutes} icon={<FiBriefcase size={24} />} color="#6366F1" />
                </Col>
                <Col md={3}>
                    <StatCard title="Winners Declared" count={stats.winners} icon={<FiAward size={24} />} color="#EC4899" />
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="glass-panel border-0 h-100 p-2 overflow-hidden">
                        <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
                            <h5 className="mb-0 fw-bold">Recent Registrations</h5>
                            <Link to="/admin/participants" className="btn btn-link text-gold-accent p-0 text-decoration-none fw-bold small">VIEW ALL <FiArrowRight /></Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="bg-light small text-uppercase">
                                        <tr>
                                            <th className="px-4">Participant</th>
                                            <th>Institute</th>
                                            <th>Time</th>
                                            <th className="text-end px-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent.length > 0 ? recent.map((reg, i) => (
                                            <tr key={reg._id} style={{ verticalAlign: 'middle' }}>
                                                <td className="px-4 fw-bold text-dark">{reg.name}</td>
                                                <td className="text-muted small">{reg.institute?.name}</td>
                                                <td className="text-muted small">
                                                    <FiClock className="me-1" />
                                                    {new Date(reg.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="text-end px-4">
                                                    <Link to="/admin/participants" className="btn btn-sm btn-outline-gold border-0">MANAGE</Link>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">No recent registrations found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="glass-panel border-0 h-100 p-2">
                        <Card.Header className="bg-transparent border-0 p-4">
                            <h5 className="mb-0 fw-bold">System Status</h5>
                        </Card.Header>
                        <Card.Body className="p-4 pt-2">
                            <div className="text-center mb-5">
                                <div className="position-relative d-inline-block">
                                    <div className="p-4 rounded-circle bg-soft-green mb-3">
                                        <FiCheckCircle size={50} className="text-emerald-green" />
                                    </div>
                                    <span className="position-absolute top-0 end-0 p-2 bg-success border border-white rounded-circle shadow-sm animate-pulse"></span>
                                </div>
                                <h4 className="fw-bold mb-1">Excellent</h4>
                                <p className="text-muted small">All systems are running smoothly.</p>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between small mb-2">
                                    <span className="text-muted fw-bold text-uppercase">Server Load</span>
                                    <span className="fw-bold">24%</span>
                                </div>
                                <ProgressBar now={24} variant="success" style={{ height: '6px', borderRadius: '10px' }} />
                            </div>

                            <div>
                                <div className="d-flex justify-content-between small mb-2">
                                    <span className="text-muted fw-bold text-uppercase">Disk Usage</span>
                                    <span className="fw-bold">68%</span>
                                </div>
                                <ProgressBar now={68} variant="warning" style={{ height: '6px', borderRadius: '10px' }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
