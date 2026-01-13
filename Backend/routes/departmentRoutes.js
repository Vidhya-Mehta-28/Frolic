import express from 'express';
import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';
import { getDepartmentEvents } from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getDepartments)
    .post(protect, adminOnly, createDepartment);

router.route('/:id')
    .put(protect, adminOnly, updateDepartment)
    .delete(protect, adminOnly, deleteDepartment);

// Nested route for events within a department
router.get('/:id/events', getDepartmentEvents);

export default router;
