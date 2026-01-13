import express from 'express';
import {
    updateParticipant,
    removeParticipantFromGroup
} from '../controllers/participantController.js';
import { protect, coordinatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id')
    .put(protect, coordinatorOnly, updateParticipant)
    .delete(protect, coordinatorOnly, removeParticipantFromGroup);

export default router;
