import express from 'express';
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getDepartmentEvents,
    getEventSummary
} from '../controllers/eventController.js';
import { getEventGroups, createGroup } from '../controllers/groupController.js';
import { getEventWinners, createWinner } from '../controllers/winnerController.js';
import { protect, coordinatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, coordinatorOnly, createEvent);

router.route('/:id')
    .get(getEventById)
    .put(protect, coordinatorOnly, updateEvent)
    .delete(protect, coordinatorOnly, deleteEvent);

router.get('/:id/summary', getEventSummary);

// Nested routes
router.get('/:eventId/groups', getEventGroups);
router.post('/:eventId/groups', createGroup);

router.get('/:eventId/winners', getEventWinners);
router.post('/:eventId/winners', protect, coordinatorOnly, createWinner);

export default router;
