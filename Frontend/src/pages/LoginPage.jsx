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
        <div 
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{ 
                background: 'linear-gradient(135deg, #FBF9FE 0%, #F8F5FD 100%)',
                minHeight: '100vh'
            }}
        >
            <div 
                className="shadow-sm"
                style={{ 
                    maxWidth: '450px', 
                    width: '100%',
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '50px 40px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                    margin: '20px'
                }}
            >
                {/* Header */}
                <div className="mb-5 text-center">
                    <div 
                        className="d-inline-block p-4 rounded-circle mb-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(196, 143, 224, 0.2), rgba(230, 217, 240, 0.15))',
                        }}
                    >
                        <FiHexagon size={44} style={{ color: '#C48FE0' }} />
                    </div>
                    <h1 className="fw-bold mb-2" style={{ fontSize: '2rem', color: '#2D5A3D' }}>
                        Welcome Back
                    </h1>
                    <p className="text-muted mb-0" style={{ color: '#4A6B5A', fontSize: '0.95rem' }}>
                        Sign in to access your account
                    </p>
                </div>

                {/* Role Toggle */}
                <div 
                    className="p-1 rounded-pill mb-5 d-flex gap-2"
                    style={{ 
                        background: '#f3f4f6',
                        padding: '6px'
                    }}
                >
                    {['Participant', 'Admin'].map((r) => (
                        <button
                            key={r.toLowerCase()}
                            onClick={() => setRole(r.toLowerCase())}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: role === r.toLowerCase() 
                                    ? 'linear-gradient(135deg, #C48FE0, #B88FD4)' 
                                    : 'transparent',
                                color: role === r.toLowerCase() ? '#ffffff' : '#4A6B5A',
                                letterSpacing: '0.3px'
                            }}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <Form onSubmit={handleLogin}>
                    {/* Username Input */}
                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="fw-600 mb-2 d-flex align-items-center gap-2" style={{ color: '#2D5A3D', fontSize: '0.9rem', letterSpacing: '0.3px' }}>
                            <FiUser size={16} style={{ color: '#C48FE0' }} />
                            Username / Email
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your username or email"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            style={{
                                borderRadius: '12px',
                                border: `2px solid ${errors.username ? '#E68B96' : '#E6D9F0'}`,
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease',
                                background: '#f9fafb'
                            }}
                            onFocus={(e) => {
                                if (!errors.username) {
                                    e.target.style.borderColor = '#C48FE0';
                                    e.target.style.background = '#ffffff';
                                }
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.username ? '#E68B96' : '#E6D9F0';
                                e.target.style.background = '#FDFBFE';
                            }}
                            className="shadow-none"
                        />
                        {errors.username && (
                            <small className="text-danger mt-2 d-block" style={{ fontSize: '0.8rem' }}>
                                {errors.username}
                            </small>
                        )}
                    </Form.Group>

                    {/* Password Input */}
                    <Form.Group className="mb-5 text-start">
                        <Form.Label className="fw-600 mb-2 d-flex align-items-center gap-2" style={{ color: '#2D5A3D', fontSize: '0.9rem', letterSpacing: '0.3px' }}>
                            <FiLock size={16} style={{ color: '#C48FE0' }} />
                            Password
                        </Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{
                                borderRadius: '12px',
                                border: `2px solid ${errors.password ? '#E68B96' : '#E6D9F0'}`,
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease',
                                background: '#f9fafb'
                            }}
                            onFocus={(e) => {
                                if (!errors.password) {
                                    e.target.style.borderColor = '#C48FE0';
                                    e.target.style.background = '#ffffff';
                                }
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.password ? '#E68B96' : '#E6D9F0';
                                e.target.style.background = '#FDFBFE';
                            }}
                            className="shadow-none"
                        />
                        {errors.password && (
                            <small className="text-danger mt-2 d-block" style={{ fontSize: '0.8rem' }}>
                                {errors.password}
                            </small>
                        )}
                    </Form.Group>

                    {/* Error Alert */}
                    {errors.general && (
                        <div 
                            className="alert mb-4 py-3 px-4 d-flex align-items-center gap-2"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '12px',
                                color: '#991b1b',
                                fontSize: '0.9rem'
                            }}
                        >
                            <span>⚠️</span>
                            <span>{errors.general}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 fw-bold text-white shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, #C48FE0 0%, #B88FD4 100%)',
                            border: 'none',
                            padding: '14px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 20px rgba(212, 165, 116, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(212, 165, 116, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 165, 116, 0.3)';
                        }}
                    >
                        SIGN IN
                    </Button>
                </Form>

                {/* Footer */}
                <div className="mt-5 text-center">
                    <p className="text-muted mb-0" style={{ color: '#4A6B5A', fontSize: '0.95rem' }}>
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            style={{
                                color: '#C48FE0',
                                fontWeight: '600',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#B88FD4';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#C48FE0';
                            }}
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
