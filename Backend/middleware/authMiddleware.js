import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            sendResponse(res, 401, false, null, 'Not authorized, token failed');
        }
    }

    if (!token) {
        sendResponse(res, 401, false, null, 'Not authorized, no token');
    }
};

// Admin middleware
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        sendResponse(res, 403, false, null, 'Not authorized as an admin');
    }
};

// Coordinator middleware (allows coordinators and admins)
export const coordinatorOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'coordinator' || req.user.role === 'admin')) {
        next();
    } else {
        sendResponse(res, 403, false, null, 'Not authorized as a coordinator');
    }
};
