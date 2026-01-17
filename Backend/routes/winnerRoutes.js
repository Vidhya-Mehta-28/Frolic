import express from 'express';
import {
    getWinners,
    updateWinner,
    deleteWinner
} from '../controllers/winnerController.js';
import { protect, coordinatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getWinners);

router.route('/:id')
    .put(protect, coordinatorOnly, updateWinner)
    .delete(protect, coordinatorOnly, deleteWinner);

export default router;
