import express from 'express';
import {
    getParticipants,
    updateParticipant,
    removeParticipantFromGroup
} from '../controllers/participantController.js';
import { protect, coordinatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getParticipants);

router.route('/:id')
    .put(protect, coordinatorOnly, updateParticipant)
    .delete(protect, coordinatorOnly, removeParticipantFromGroup);

export default router;
