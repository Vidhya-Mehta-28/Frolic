import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner, Alert, Badge, Container } from 'react-bootstrap';
import { FiCalendar, FiAward, FiBell, FiCheckCircle, FiUsers, FiMapPin, FiArrowRight, FiStar } from 'react-icons/fi';
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

    const totalRegistrations = myRegistrations.length;
    const leaderCount = myRegistrations.filter(r => r.isGroupLeader).length;
    const paidCount = myRegistrations.filter(r => r.group?.isPaymentDone).length;

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <Card 
            className="border-0 shadow-sm h-100 overflow-hidden"
            style={{ 
                borderRadius: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
        >
            <Card.Body className={`p-5 ${colorClass}`}>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <p className="text-muted fw-500 small mb-2" style={{ letterSpacing: '0.5px' }}>
                            {title}
                        </p>
                        <h2 className="fw-bold text-dark mb-0" style={{ fontSize: '2.75rem', lineHeight: '1' }}>
                            {value}
                        </h2>
                    </div>
                    <div 
                        className="p-4 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Icon size={36} style={{ opacity: 0.7 }} />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className="py-5" style={{ background: 'linear-gradient(135deg, #FBF9FE 0%, #F8F5FD 100%)' }}>
            {/* Header Section */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="fw-bold mb-2" style={{ fontSize: '3rem', color: '#2D5A3D', lineHeight: '1.2' }}>
                            Welcome back,
                            <br />
                            <span style={{ background: 'linear-gradient(135deg, #C48FE0 0%, #B399D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {user?.username || 'Student'}
                            </span>
                        </h1>
                        <p className="text-muted fs-5 mt-3" style={{ color: '#4A6B5A', fontWeight: '500' }}>
                            Track your event registrations and achievements
                        </p>
                    </div>
                    <Button
                        as={Link}
                        to="/participant/events"
                        style={{
                            background: 'linear-gradient(135deg, #C48FE0 0%, #B88FD4 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '14px 32px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            boxShadow: '0 8px 24px rgba(196, 143, 224, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 32px rgba(196, 143, 224, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(196, 143, 224, 0.3)';
                        }}
                        className="text-white d-flex align-items-center gap-2"
                    >
                        <FiArrowRight size={20} /> Explore Events
                    </Button>
                </div>

                {/* Stats Cards */}
                <Row className="g-4 mb-5">
                    <Col md={3} sm={6} xs={12}>
                        <StatCard 
                            title="Total Registrations"
                            value={totalRegistrations}
                            icon={FiCalendar}
                            colorClass="bg-gradient-warm"
                            style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fef9f3 100%)' }}
                        />
                    </Col>

                    <Col md={3} sm={6} xs={12}>
                        <StatCard 
                            title="Team Leader In"
                            value={leaderCount}
                            icon={FiUsers}
                            colorClass="bg-gradient-green"
                            style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f6 100%)' }}
                        />
                    </Col>

                    <Col md={3} sm={6} xs={12}>
                        <StatCard 
                            title="Payments Completed"
                            value={paidCount}
                            icon={FiCheckCircle}
                            colorClass="bg-gradient-blue"
                            style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%)' }}
                        />
                    </Col>

                    <Col md={3} sm={6} xs={12}>
                        <StatCard 
                            title="Pending Payments"
                            value={totalRegistrations - paidCount}
                            icon={FiBell}
                            colorClass="bg-gradient-rose"
                            style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fff1f5 100%)' }}
                        />
                    </Col>
                </Row>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" style={{ color: '#C48FE0' }} />
                    <p className="mt-4 text-muted fs-5">Loading your registrations...</p>
                </div>
            ) : error ? (
                <Alert variant="danger" className="border-0 shadow-sm" style={{ borderRadius: '12px', padding: '20px' }}>
                    <FiBell className="me-2" /> {error}
                </Alert>
            ) : (
                <Row className="g-4">
                    {/* Registrations Grid */}
                    <Col lg={8}>
                        <div className="mb-4">
                            <h2 className="fw-bold text-dark d-flex align-items-center gap-3 mb-2" style={{ fontSize: '1.75rem' }}>
                                <div style={{ width: '4px', height: '32px', background: 'linear-gradient(180deg, #C48FE0, #2D5A3D)', borderRadius: '2px' }} />
                                My Event Registrations
                            </h2>
                            <p className="text-muted" style={{ color: '#9ca3af' }}>Manage your competition participation</p>
                        </div>

                        {myRegistrations.length > 0 ? (
                            <Row className="g-4">
                                {myRegistrations.map((registration, index) => (
                                    <Col lg={6} xs={12} key={index}>
                                        <Card 
                                            className="border-0 h-100 overflow-hidden shadow-sm"
                                            style={{ 
                                                borderRadius: '16px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                background: '#ffffff'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-8px)';
                                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
                                            }}
                                        >
                                            {/* Status Bar */}
                                            <div 
                                                style={{
                                                    height: '5px',
                                                    background: registration.group?.isPaymentDone 
                                                        ? 'linear-gradient(90deg, #2D5A3D, #1F4529)' 
                                                        : registration.group?.isPresent
                                                        ? 'linear-gradient(90deg, #C48FE0, #B88FD4)'
                                                        : 'linear-gradient(90deg, #C48FE0, #B88FD4)'
                                                }}
                                            />

                                            <Card.Body className="p-5">
                                                {/* Header */}
                                                <div className="d-flex justify-content-between align-items-start mb-4">
                                                    <div>
                                                        <Badge 
                                                            className="px-3 py-2 fw-600"
                                                            style={{
                                                                background: 'linear-gradient(135deg, rgba(196, 143, 224, 0.2), rgba(230, 217, 240, 0.15))',
                                                                color: '#8b6f47',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '0.8rem',
                                                                letterSpacing: '0.3px'
                                                            }}
                                                        >
                                                            {registration.group?.event?.category || 'Event'}
                                                        </Badge>
                                                    </div>
                                                    {registration.isGroupLeader && (
                                                        <Badge 
                                                            className="px-3 py-2 fw-600 d-flex align-items-center gap-1"
                                                            style={{
                                                                background: 'linear-gradient(135deg, rgba(45, 90, 61, 0.2), rgba(79, 127, 99, 0.15))',
                                                                color: '#059669',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            <FiStar size={13} /> Leader
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <h5 className="fw-bold mb-4" style={{ fontSize: '1.25rem', color: '#2D5A3D' }}>
                                                    {registration.group?.event?.title || 'Event'}
                                                </h5>

                                                {/* Event Details */}
                                                <div className="mb-4" style={{ fontSize: '0.95rem' }}>
                                                    <p className="text-muted mb-3 d-flex align-items-center gap-3" style={{ color: '#6b7280' }}>
                                                        <FiUsers size={16} style={{ color: '#C48FE0' }} /> 
                                                        <span>Group: <span className="fw-600 text-dark">{registration.group?.name}</span></span>
                                                    </p>
                                                    <p className="text-muted mb-3 d-flex align-items-center gap-3" style={{ color: '#6b7280' }}>
                                                        <FiMapPin size={16} style={{ color: '#C48FE0' }} />
                                                        <span>{registration.group?.event?.location || 'TBA'}</span>
                                                    </p>
                                                    <p className="text-muted mb-3 d-flex align-items-center gap-3" style={{ color: '#4A6B5A' }}>
                                                        <FiCalendar size={16} style={{ color: '#C48FE0' }} />
                                                        <span>
                                                            {registration.group?.event?.date
                                                                ? new Date(registration.group.event.date).toLocaleDateString('en-IN', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })
                                                                : 'Date TBA'}
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* Status Badges */}
                                                <div className="d-flex gap-2 pt-4 border-top">
                                                    {registration.group?.isPaymentDone ? (
                                                        <Badge 
                                                            className="px-3 py-2 fw-600 mt-2"
                                                            style={{
                                                                background: 'rgba(16, 185, 129, 0.15)',
                                                                color: '#059669',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            <FiCheckCircle size={13} className="me-1" /> Paid
                                                        </Badge>
                                                    ) : (
                                                        <Badge 
                                                            className="px-3 py-2 fw-600 mt-2"
                                                            style={{
                                                                background: 'rgba(212, 165, 116, 0.15)',
                                                                color: '#92400e',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            <FiBell size={13} className="me-1" /> Pending
                                                        </Badge>
                                                    )}
                                                    {registration.group?.isPresent && (
                                                        <Badge 
                                                            className="px-3 py-2 fw-600 mt-2"
                                                            style={{
                                                                background: 'rgba(59, 130, 246, 0.15)',
                                                                color: '#1e40af',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            <FiCheckCircle size={13} className="me-1" /> Attended
                                                        </Badge>
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Card 
                                className="border-0 shadow-sm text-center py-5"
                                style={{ 
                                    borderRadius: '16px', 
                                    background: 'linear-gradient(135deg, rgba(196, 143, 224, 0.08), #ffffff)',
                                    border: '1px solid rgba(212, 165, 116, 0.2)'
                                }}
                            >
                                <Card.Body className="py-5">
                                    <div 
                                        className="mx-auto mb-4 p-4 rounded-circle"
                                        style={{ 
                                            width: '80px', 
                                            height: '80px', 
                                            background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.15), rgba(139, 111, 71, 0.1))',
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center' 
                                        }}
                                    >
                                        <FiCalendar size={40} style={{ color: '#C48FE0' }} />
                                    </div>
                                    <h4 className="fw-bold text-dark mb-2">No Registrations Yet</h4>
                                    <p className="text-muted mb-4" style={{ color: '#9ca3af' }}>
                                        Start your competition journey by exploring available events
                                    </p>
                                    <Button 
                                        as={Link} 
                                        to="/participant/events" 
                                        style={{
                                            background: 'linear-gradient(135deg, #C48FE0 0%, #B88FD4 100%)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            padding: '12px 28px',
                                            fontWeight: '600'
                                        }}
                                        className="text-white"
                                    >
                                        <FiArrowRight size={18} className="me-2" /> Browse Events
                                    </Button>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>

                    {/* Sidebar */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <Card.Header 
                                className="border-0 p-5 pb-3"
                                style={{ background: 'linear-gradient(135deg, #FBF9FE, #F8F5FD)' }}
                            >
                                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: '#2D5A3D' }}>
                                    <div style={{ width: '4px', height: '20px', background: 'linear-gradient(180deg, #C48FE0, #2D5A3D)', borderRadius: '2px' }} />
                                    Quick Links
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-5">
                                <div className="d-grid gap-3 mb-4">
                                    <Button 
                                        as={Link}
                                        to="/participant/events"
                                        style={{
                                            borderRadius: '12px',
                                            borderWidth: '2px',
                                            borderColor: '#d4a574',
                                            color: '#d4a574',
                                            background: 'transparent',
                                            fontWeight: '600',
                                            padding: '14px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#d4a574';
                                            e.currentTarget.style.color = '#ffffff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#d4a574';
                                        }}
                                    >
                                        <FiArrowRight className="me-2" /> Browse Events
                                    </Button>
                                    <Button 
                                        as={Link}
                                        to="/winners"
                                        style={{
                                            borderRadius: '12px',
                                            borderWidth: '2px',
                                            borderColor: '#d4a574',
                                            color: '#d4a574',
                                            background: 'transparent',
                                            fontWeight: '600',
                                            padding: '14px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#d4a574';
                                            e.currentTarget.style.color = '#ffffff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#d4a574';
                                        }}
                                    >
                                        <FiAward className="me-2" /> View Winners
                                    </Button>
                                </div>

                                <hr className="my-4" style={{ borderColor: '#E6D9F0' }} />

                                <div className="p-4 rounded-3" style={{ background: 'linear-gradient(135deg, rgba(45, 90, 61, 0.15), rgba(230, 250, 245, 0.5))' }}>
                                    <p className="text-muted small fw-600 mb-2" style={{ color: '#2D5A3D' }}>💡 Pro Tip</p>
                                    <p className="text-dark small mb-0" style={{ color: '#1f2937', lineHeight: '1.6' }}>
                                        Complete your payment to secure your spot. Connect with your team and prepare for an amazing competition!
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default ParticipantDashboard;
