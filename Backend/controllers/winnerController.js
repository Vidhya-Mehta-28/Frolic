import { EventWiseWinner, Event } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

// @desc    Get all winners for an event
// @route   GET /api/events/:eventId/winners
export const getEventWinners = async (req, res) => {
    try {
        const winners = await EventWiseWinner.find({ event: req.params.eventId })
            .sort({ rank: 1 })
            .populate('participant', 'fullName email')
            .populate('group', 'name');
        sendResponse(res, 200, true, winners, 'Event winners fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Add a winner to an event
// @route   POST /api/events/:eventId/winners
export const createWinner = async (req, res) => {
    try {
        const { rank, participant, group, prize } = req.body;
        const eventId = req.params.eventId;

        const duplicate = await EventWiseWinner.findOne({ event: eventId, rank });
        if (duplicate) {
            return sendResponse(res, 400, false, null, `Rank ${rank} already assigned for this event`);
        }

        const winner = await EventWiseWinner.create({
            event: eventId,
            rank,
            participant,
            group,
            prize
        });

        sendResponse(res, 201, true, winner, 'Winner added successfully');
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Update a winner rank/details
// @route   PUT /api/winners/:id
export const updateWinner = async (req, res) => {
    try {
        const { rank, prize, participant, group } = req.body;
        const winner = await EventWiseWinner.findById(req.params.id);

        if (winner) {
            if (rank !== undefined && rank !== winner.rank) {
                const duplicate = await EventWiseWinner.findOne({
                    event: winner.event,
                    rank,
                    _id: { $ne: req.params.id }
                });
                if (duplicate) {
                    return sendResponse(res, 400, false, null, `Rank ${rank} is already taken for this event`);
                }
            }

            winner.rank = rank !== undefined ? rank : winner.rank;
            winner.prize = prize !== undefined ? prize : winner.prize;
            winner.participant = participant !== undefined ? participant : winner.participant;
            winner.group = group !== undefined ? group : winner.group;

            const updatedWinner = await winner.save();
            sendResponse(res, 200, true, updatedWinner, 'Winner updated successfully');
        } else {
            sendResponse(res, 404, false, null, 'Winner entry not found');
        }
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Delete a winner entry
// @route   DELETE /api/winners/:id
export const deleteWinner = async (req, res) => {
    try {
        const winner = await EventWiseWinner.findById(req.params.id);
        if (winner) {
            await winner.deleteOne();
            sendResponse(res, 200, true, null, 'Winner removed');
        } else {
            sendResponse(res, 404, false, null, 'Winner entry not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};
