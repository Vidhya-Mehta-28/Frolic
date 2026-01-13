import { Event } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

// @desc    Get all events (with pagination, search, and filtering)
// @route   GET /api/events
export const getEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, q, department, location } = req.query;
        const query = {};

        // Search by name (case-insensitive)
        if (q) {
            query.title = { $regex: q, $options: 'i' };
        }

        // Filter by department
        if (department) {
            query.department = department;
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const skip = (page - 1) * limit;
        const total = await Event.countDocuments(query);
        const events = await Event.find(query)
            .populate('department', 'name')
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        sendResponse(res, 200, true, {
            events,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        }, 'Events fetched successfully');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('department', 'name');
        if (event) {
            sendResponse(res, 200, true, event, 'Event details fetched');
        } else {
            sendResponse(res, 404, false, null, 'Event not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Get events by department ID
// @route   GET /api/departments/:id/events
export const getDepartmentEvents = async (req, res) => {
    try {
        const events = await Event.find({ department: req.params.id });
        sendResponse(res, 200, true, events, 'Department events fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Create new event
// @route   POST /api/events
export const createEvent = async (req, res) => {
    try {
        const {
            title, description, date, time, location, category,
            rules, department, maxParticipants,
            groupMinParticipants, groupMaxParticipants, maxGroupsAllowed
        } = req.body;

        if (groupMinParticipants > groupMaxParticipants) {
            return sendResponse(res, 400, false, null, 'Minimum group participants cannot be greater than maximum');
        }

        if (maxGroupsAllowed <= 0) {
            return sendResponse(res, 400, false, null, 'Max groups allowed must be greater than 0');
        }

        const event = await Event.create({
            title, description, date, time, location, category,
            rules, department, maxParticipants,
            groupMinParticipants, groupMaxParticipants, maxGroupsAllowed
        });

        sendResponse(res, 201, true, event, 'Event created successfully');
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
export const updateEvent = async (req, res) => {
    try {
        const {
            groupMinParticipants, groupMaxParticipants, maxGroupsAllowed
        } = req.body;

        if (groupMinParticipants !== undefined && groupMaxParticipants !== undefined) {
            if (groupMinParticipants > groupMaxParticipants) {
                return sendResponse(res, 400, false, null, 'Minimum group participants cannot be greater than maximum');
            }
        }

        if (maxGroupsAllowed !== undefined && maxGroupsAllowed <= 0) {
            return sendResponse(res, 400, false, null, 'Max groups allowed must be greater than 0');
        }

        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (event) {
            sendResponse(res, 200, true, event, 'Event updated successfully');
        } else {
            sendResponse(res, 404, false, null, 'Event not found');
        }
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            await event.deleteOne();
            sendResponse(res, 200, true, null, 'Event removed');
        } else {
            sendResponse(res, 404, false, null, 'Event not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Get event summary (counts)
// @route   GET /api/events/:id/summary
export const getEventSummary = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { Group, Participant } = await import('../models/index.js');

        const totalGroups = await Group.countDocuments({ event: eventId });
        const groups = await Group.find({ event: eventId }).select('_id');
        const groupIds = groups.map(g => g._id);
        const totalParticipants = await Participant.countDocuments({ group: { $in: groupIds } });

        sendResponse(res, 200, true, {
            eventId,
            totalGroups,
            totalParticipants
        }, 'Event summary fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};
