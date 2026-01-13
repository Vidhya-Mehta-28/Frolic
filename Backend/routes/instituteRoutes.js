import express from 'express';
import {
    getInstitutes,
    getInstituteById,
    createInstitute,
    updateInstitute,
    deleteInstitute,
    getInstituteSummary
} from '../controllers/instituteController.js';
import { getInstituteDepartments } from '../controllers/departmentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getInstitutes)
    .post(protect, adminOnly, createInstitute);

router.route('/:id')
    .get(getInstituteById)
    .put(protect, adminOnly, updateInstitute)
    .delete(protect, adminOnly, deleteInstitute);

router.get('/:id/summary', getInstituteSummary);

// Nested route for departments within an institute
router.get('/:id/departments', getInstituteDepartments);

export default router;
