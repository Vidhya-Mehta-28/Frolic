import express from 'express';
import {
    updateGroup,
    deleteGroup
} from '../controllers/groupController.js';
import {
    getGroupParticipants,
    addParticipantToGroup
} from '../controllers/participantController.js';
import { protect, coordinatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id')
    .put(protect, coordinatorOnly, updateGroup)
    .delete(protect, coordinatorOnly, deleteGroup);

// Nested participant routes
router.get('/:groupId/participants', getGroupParticipants);
router.post('/:groupId/participants', protect, coordinatorOnly, addParticipantToGroup);

export default router;
