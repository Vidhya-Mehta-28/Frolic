import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiHexagon } from 'react-icons/fi';
import { Button, Form, ButtonGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('participant');
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // We use email for login in the backend
        if (!formData.username) newErrors.username = "Email / Username is required";
        if (!formData.password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const result = await login(formData.username, formData.password);
            if (result.success) {
                // Determine redirect based on role (from backend response)
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (userInfo.role === 'coordinator') {
                    navigate('/admin/dashboard'); // Or coordinator specific
                } else {
                    navigate('/participant/results');
                }
            } else {
                setErrors({ general: result.message });
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to connect to server';
            setErrors({ general: errorMessage });
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="glass-panel p-5 text-center shadow-lg" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="mb-4 text-center">
                    <div className="d-inline-block p-3 rounded-circle bg-soft-gold mb-3">
                        <FiHexagon size={40} className="text-gold-accent" />
                    </div>
                    <h2 className="fw-bold text-gradient">Welcome Back</h2>
                    <p className="text-muted">Sign in to access Frolic Portal</p>
                </div>

                <div className="p-1 bg-light rounded-pill mb-4 border shadow-sm">
                    <ButtonGroup className="w-100">
                        <Button
                            variant={role === 'participant' ? 'primary' : 'light'}
                            className={`rounded-pill border-0 small fw-bold py-2 ${role === 'participant' ? '' : 'text-muted'}`}
                            onClick={() => setRole('participant')}
                        >
                            Participant
                        </Button>
                        <Button
                            variant={role === 'admin' ? 'primary' : 'light'}
                            className={`rounded-pill border-0 small fw-bold py-2 ${role === 'admin' ? '' : 'text-muted'}`}
                            onClick={() => setRole('admin')}
                        >
                            Admin
                        </Button>
                    </ButtonGroup>
                </div>

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="fw-bold text-muted small ms-1">Username / Email</Form.Label>
                        <div className="input-group overflow-hidden rounded-3 border">
                            <span className="input-group-text bg-white border-0 text-muted"><FiUser /></span>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className={`bg-white border-0 ps-0 shadow-none py-2 ${errors.username ? 'is-invalid' : ''}`}
                            />
                        </div>
                        {errors.username && <small className="text-danger ms-1">{errors.username}</small>}
                    </Form.Group>

                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="fw-bold text-muted small ms-1">Password</Form.Label>
                        <div className="input-group overflow-hidden rounded-3 border">
                            <span className="input-group-text bg-white border-0 text-muted"><FiLock /></span>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`bg-white border-0 ps-0 shadow-none py-2 ${errors.password ? 'is-invalid' : ''}`}
                            />
                        </div>
                        {errors.password && <small className="text-danger ms-1">{errors.password}</small>}
                    </Form.Group>

                    {errors.general && <div className="alert alert-danger p-2 small mb-3">{errors.general}</div>}

                    <Button variant="primary" type="submit" className="w-100 py-3 fw-bold shadow-sm rounded-3">
                        SIGN IN
                    </Button>
                </Form>

                <div className="mt-4 text-muted small">
                    <p>Don't have an account? <Link to="/register" className="text-gold-accent fw-bold text-decoration-none">Create Account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
