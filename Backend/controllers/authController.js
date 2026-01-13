import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExists) {
            return sendResponse(res, 400, false, null, 'User already exists');
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'student'
        });

        if (user) {
            sendResponse(res, 201, true, {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }, 'User registered successfully');
        } else {
            sendResponse(res, 400, false, null, 'Invalid user data');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            sendResponse(res, 200, true, {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }, 'Login successful');
        } else {
            sendResponse(res, 401, false, null, 'Invalid email or password');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            sendResponse(res, 200, true, {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }, 'User profile fetched');
        } else {
            sendResponse(res, 404, false, null, 'User not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};
