import { Participant, Group, Event } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

// @desc    Get all participants in a group
// @route   GET /api/groups/:groupId/participants
export const getGroupParticipants = async (req, res) => {
    try {
        const participants = await Participant.find({ group: req.params.groupId });
        sendResponse(res, 200, true, participants, 'Group participants fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Add participant to a group
// @route   POST /api/groups/:groupId/participants
export const addParticipantToGroup = async (req, res) => {
    try {
        const { fullName, email, phone, institute, department, user, isGroupLeader } = req.body;
        const groupId = req.params.groupId;

        const group = await Group.findById(groupId).populate('event');
        if (!group) {
            return sendResponse(res, 404, false, null, 'Group not found');
        }

        const event = group.event;
        const currentCount = await Participant.countDocuments({ group: groupId });
        if (currentCount >= event.groupMaxParticipants) {
            return sendResponse(res, 400, false, null, `Group capacity exceeded. Max allowed is ${event.groupMaxParticipants}`);
        }

        if (isGroupLeader) {
            const leaderExists = await Participant.findOne({ group: groupId, isGroupLeader: true });
            if (leaderExists) {
                return sendResponse(res, 400, false, null, 'Group already has a leader');
            }
        }

        const participant = await Participant.create({
            fullName, email, phone, institute, department, user,
            group: groupId,
            isGroupLeader: isGroupLeader || false
        });

        group.members.push(participant._id);
        await group.save();

        sendResponse(res, 201, true, participant, 'Participant added to group');
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Update participant
// @route   PUT /api/participants/:id
export const updateParticipant = async (req, res) => {
    try {
        const { isGroupLeader } = req.body;
        const participant = await Participant.findById(req.params.id);

        if (participant) {
            if (isGroupLeader === true && participant.isGroupLeader === false) {
                const leaderExists = await Participant.findOne({
                    group: participant.group,
                    isGroupLeader: true,
                    _id: { $ne: participant._id }
                });
                if (leaderExists) {
                    return sendResponse(res, 400, false, null, 'Group already has a leader');
                }
            }

            Object.assign(participant, req.body);
            const updatedParticipant = await participant.save();
            sendResponse(res, 200, true, updatedParticipant, 'Participant updated');
        } else {
            sendResponse(res, 404, false, null, 'Participant not found');
        }
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Remove participant from group
// @route   DELETE /api/participants/:id
export const removeParticipantFromGroup = async (req, res) => {
    try {
        const participant = await Participant.findById(req.params.id);
        if (participant) {
            const groupId = participant.group;
            if (groupId) {
                await Group.findByIdAndUpdate(groupId, {
                    $pull: { members: participant._id }
                });
            }
            await participant.deleteOne();
            sendResponse(res, 200, true, null, 'Participant removed');
        } else {
            sendResponse(res, 404, false, null, 'Participant not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};
