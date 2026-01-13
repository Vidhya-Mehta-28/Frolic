import { Institute, Department, Event, Participant, EventWiseWinner } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

export const getStats = async (req, res) => {
    try {
        const [institutes, events, participants, winners] = await Promise.all([
            Institute.countDocuments({}),
            Event.countDocuments({}),
            Participant.countDocuments({}),
            EventWiseWinner.countDocuments({})
        ]);

        sendResponse(res, 200, true, {
            institutes,
            events,
            participants,
            winners
        }, 'Dashboard stats fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

export const getRecentRegistrations = async (req, res) => {
    try {
        const recent = await Participant.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('institute', 'name')
            .populate('department', 'name');

        sendResponse(res, 200, true, recent, 'Recent registrations fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};
