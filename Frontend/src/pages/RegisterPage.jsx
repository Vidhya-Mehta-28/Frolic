import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiHexagon } from 'react-icons/fi';
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = "Invalid email format";
        if (formData.phone.length < 10) newErrors.phone = "Phone number must be at least 10 digits";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        return newErrors;
    };

    const { register } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const result = await register({
                username: formData.fullName.split(' ')[0] + Math.floor(Math.random() * 1000), // Simple username gen
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: formData.role
            });

            if (result.success) {
                alert("Registration Successful!");
                // Redirect based on role
                if (formData.role === 'admin' || formData.role === 'coordinator') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/participant/dashboard');
                }
            } else {
                setErrors({ general: result.message });
            }
        } catch (err) {
            setErrors({ general: 'Failed to connect to server' });
        }
    };

    return (
        <div 
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{ 
                background: 'linear-gradient(135deg, #FBF9FE 0%, #F8F5FD 100%)',
                minHeight: '100vh',
                padding: '20px'
            }}
        >
            <div 
                className="shadow-sm"
                style={{ 
                    maxWidth: '520px', 
                    width: '100%',
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '50px 40px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
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
                        Create Account
                    </h1>
                    <p className="text-muted mb-0" style={{ color: '#4A6B5A', fontSize: '0.95rem' }}>
                        Join the competition and show your skills
                    </p>
                </div>

                <Form onSubmit={handleRegister}>
                    {/* Full Name Input */}
                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="fw-600 mb-2 d-flex align-items-center gap-2" style={{ color: '#6D5C54', fontSize: '0.9rem' }}>
                            <FiUser size={16} style={{ color: '#C48FE0' }} />
                            Full Name
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={{
                                borderRadius: '12px',
                                border: `2px solid ${errors.fullName ? '#F5A6A0' : '#F0E0D8'}`,
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                if (!errors.fullName) {
                                    e.target.style.borderColor = '#10b981';
                                    e.target.style.background = '#ffffff';
                                }
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.fullName ? '#F5A6A0' : '#F0E0D8';
                                e.target.style.background = '#FFFBF8';
                            }}
                            className="shadow-none"
                        />
                        {errors.fullName && (
                            <small className="text-danger mt-2 d-block" style={{ fontSize: '0.8rem' }}>{errors.fullName}</small>
                        )}
                    </Form.Group>

                    {/* Email Input */}
                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="fw-600 mb-2 d-flex align-items-center gap-2" style={{ color: '#6D5C54', fontSize: '0.9rem' }}>
                            <FiMail size={16} style={{ color: '#A8E6D9' }} />
                            Email Address
                        </Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                borderRadius: '12px',
                                border: `2px solid ${errors.email ? '#F5A6A0' : '#F0E0D8'}`,
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                if (!errors.email) {
                                    e.target.style.borderColor = '#10b981';
                                    e.target.style.background = '#ffffff';
                                }
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.email ? '#F5A6A0' : '#F0E0D8';
                                e.target.style.background = '#FFFBF8';
                            }}
                            className="shadow-none"
                        />
                        {errors.email && (
                            <small className="text-danger mt-2 d-block" style={{ fontSize: '0.8rem' }}>{errors.email}</small>
                        )}
                    </Form.Group>

                    {/* Phone Input */}
                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="fw-600 mb-2 d-flex align-items-center gap-2" style={{ color: '#6D5C54', fontSize: '0.9rem' }}>
                            <FiPhone size={16} style={{ color: '#A8E6D9' }} />
                            Phone Number
                        </Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            placeholder="10-digit phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{
                                borderRadius: '12px',
                                border: `2px solid ${errors.phone ? '#F5A6A0' : '#F0E0D8'}`,
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                if (!errors.phone) {
                                    e.target.style.borderColor = '#10b981';
                                    e.target.style.background = '#ffffff';
                                }
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.phone ? '#F5A6A0' : '#F0E0D8';
                                e.target.style.background = '#FFFBF8';
                            }}
                            className="shadow-none"
                        />
                        {errors.phone && (
                            <small className="text-danger mt-2 d-block" style={{ fontSize: '0.8rem' }}>{errors.phone}</small>
                        )}
                    </Form.Group>

                    {/* Role Selection */}
                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="fw-600 mb-2" style={{ color: '#374151', fontSize: '0.9rem' }}>
                            Account Type
                        </Form.Label>
                        <Form.Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{
                                borderRadius: '12px',
                                border: '2px solid #e5e7eb',
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#A8E6D9';
                                e.target.style.background = '#ffffff';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#F0E0D8';
                                e.target.style.background = '#FFFBF8';
                            }}
                            className="shadow-none"
                        >
                            <option value="student">Student / Participant</option>
                            <option value="coordinator">Coordinator</option>
                            <option value="admin">Administrator</option>
                        </Form.Select>
                        <small className="text-muted mt-2 d-block" style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                            Choose your role in the system
                        </small>
                    </Form.Group>

                    {/* Password Input */}
                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="fw-600 mb-2 d-flex align-items-center gap-2" style={{ color: '#374151', fontSize: '0.9rem' }}>
                            <FiLock size={16} style={{ color: '#10b981' }} />
                            Password
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                borderRadius: '12px',
                                border: `2px solid ${errors.password ? '#F5A6A0' : '#F0E0D8'}`,
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                if (!errors.password) {
                                    e.target.style.borderColor = '#10b981';
                                    e.target.style.background = '#ffffff';
                                }
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.password ? '#F5A6A0' : '#F0E0D8';
                                e.target.style.background = '#FFFBF8';
                            }}
                            className="shadow-none"
                        />
                        {errors.password && (
                            <small className="text-danger mt-2 d-block" style={{ fontSize: '0.8rem' }}>{errors.password}</small>
                        )}
                    </Form.Group>

                    {/* Confirm Password Input */}
                    <Form.Group className="mb-5 text-start">
                        <Form.Label className="fw-600 mb-2 d-flex align-items-center gap-2" style={{ color: '#6D5C54', fontSize: '0.9rem' }}>
                            <FiLock size={16} style={{ color: '#A8E6D9' }} />
                            Confirm Password
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={{
                                borderRadius: '12px',
                                border: `2px solid ${errors.confirmPassword ? '#F5A6A0' : '#F0E0D8'}`,
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                if (!errors.confirmPassword) {
                                    e.target.style.borderColor = '#10b981';
                                    e.target.style.background = '#ffffff';
                                }
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.confirmPassword ? '#F5A6A0' : '#F0E0D8';
                                e.target.style.background = '#FFFBF8';
                            }}
                            className="shadow-none"
                        />
                        {errors.confirmPassword && (
                            <small className="text-danger mt-2 d-block" style={{ fontSize: '0.8rem' }}>{errors.confirmPassword}</small>
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
                                color: '#C85A54',
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
                            background: 'linear-gradient(135deg, #2D5A3D 0%, #1F4529 100%)',
                            border: 'none',
                            padding: '14px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 20px rgba(168, 230, 217, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(168, 230, 217, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(168, 230, 217, 0.3)';
                        }}
                    >
                        CREATE ACCOUNT
                    </Button>
                </Form>

                {/* Footer */}
                <div className="mt-5 text-center">
                    <p className="text-muted mb-0" style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            style={{
                                color: '#A8E6D9',
                                fontWeight: '600',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#8CDCC9';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#A8E6D9';
                            }}
                        >
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
