import { Group, Event } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

// @desc    Get all groups for an event
// @route   GET /api/events/:eventId/groups
export const getEventGroups = async (req, res) => {
    try {
        const groups = await Group.find({ event: req.params.eventId }).populate('members');
        sendResponse(res, 200, true, groups, 'Event groups fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Create a new group for an event
// @route   POST /api/events/:eventId/groups
export const createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return sendResponse(res, 404, false, null, 'Event not found');
        }

        const group = await Group.create({
            name,
            event: eventId
        });

        sendResponse(res, 201, true, group, 'Group created successfully');
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Update group details
// @route   PUT /api/groups/:id
export const updateGroup = async (req, res) => {
    try {
        const { name, isPaymentDone, isPresent } = req.body;
        const group = await Group.findById(req.params.id);

        if (group) {
            group.name = name !== undefined ? name : group.name;
            group.isPaymentDone = isPaymentDone !== undefined ? isPaymentDone : group.isPaymentDone;
            group.isPresent = isPresent !== undefined ? isPresent : group.isPresent;

            const updatedGroup = await group.save();
            sendResponse(res, 200, true, updatedGroup, 'Group updated successfully');
        } else {
            sendResponse(res, 404, false, null, 'Group not found');
        }
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Delete a group
// @route   DELETE /api/groups/:id
export const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (group) {
            await group.deleteOne();
            sendResponse(res, 200, true, null, 'Group removed');
        } else {
            sendResponse(res, 404, false, null, 'Group not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};
