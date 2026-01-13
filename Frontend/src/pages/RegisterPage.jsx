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
        <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="glass-panel p-5 text-center shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="mb-4 text-center">
                    <div className="d-inline-block p-3 rounded-circle bg-soft-green mb-3">
                        <FiHexagon size={40} className="text-emerald-green" />
                    </div>
                    <h2 className="fw-bold text-gradient">Create Account</h2>
                    <p className="text-muted">Start your journey with Frolic Events</p>
                </div>

                <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="fw-bold text-muted small ms-1">Full Name</Form.Label>
                        <div className="input-group overflow-hidden rounded-3 border">
                            <span className="input-group-text bg-white border-0 text-muted"><FiUser /></span>
                            <Form.Control
                                type="text"
                                name="fullName"
                                placeholder="Enter your name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`bg-white border-0 ps-0 shadow-none py-2 ${errors.fullName ? 'is-invalid' : ''}`}
                            />
                        </div>
                        {errors.fullName && <small className="text-danger ms-1">{errors.fullName}</small>}
                    </Form.Group>

                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="fw-bold text-muted small ms-1">Email Address</Form.Label>
                        <div className="input-group overflow-hidden rounded-3 border">
                            <span className="input-group-text bg-white border-0 text-muted"><FiMail /></span>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`bg-white border-0 ps-0 shadow-none py-2 ${errors.email ? 'is-invalid' : ''}`}
                            />
                        </div>
                        {errors.email && <small className="text-danger ms-1">{errors.email}</small>}
                    </Form.Group>

                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="fw-bold text-muted small ms-1">Phone Number</Form.Label>
                        <div className="input-group overflow-hidden rounded-3 border">
                            <span className="input-group-text bg-white border-0 text-muted"><FiPhone /></span>
                            <Form.Control
                                type="text"
                                name="phone"
                                placeholder="1234567890"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`bg-white border-0 ps-0 shadow-none py-2 ${errors.phone ? 'is-invalid' : ''}`}
                            />
                        </div>
                        {errors.phone && <small className="text-danger ms-1">{errors.phone}</small>}
                    </Form.Group>

                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="fw-bold text-muted small ms-1">Account Type</Form.Label>
                        <Form.Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="py-2 rounded-3"
                        >
                            <option value="student">Student / Participant</option>
                            <option value="coordinator">Coordinator</option>
                            <option value="admin">Administrator</option>
                        </Form.Select>
                        <small className="text-muted ms-1">Choose your role in the system</small>
                    </Form.Group>

                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="fw-bold text-muted small ms-1">Password</Form.Label>
                        <div className="input-group overflow-hidden rounded-3 border">
                            <span className="input-group-text bg-white border-0 text-muted"><FiLock /></span>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`bg-white border-0 ps-0 shadow-none py-2 ${errors.password ? 'is-invalid' : ''}`}
                            />
                        </div>
                        {errors.password && <small className="text-danger ms-1">{errors.password}</small>}
                    </Form.Group>

                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="fw-bold text-muted small ms-1">Confirm Password</Form.Label>
                        <div className="input-group overflow-hidden rounded-3 border">
                            <span className="input-group-text bg-white border-0 text-muted"><FiLock /></span>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`bg-white border-0 ps-0 shadow-none py-2 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            />
                        </div>
                        {errors.confirmPassword && <small className="text-danger ms-1">{errors.confirmPassword}</small>}
                    </Form.Group>

                    {errors.general && <div className="alert alert-danger p-2 small mb-3">{errors.general}</div>}

                    <Button variant="primary" type="submit" className="w-100 py-3 fw-bold shadow-sm rounded-3">
                        CREATE ACCOUNT
                    </Button>
                </Form>

                <div className="mt-4 text-muted small">
                    <p>Already have an account? <Link to="/login" className="text-emerald-green fw-bold text-decoration-none">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
