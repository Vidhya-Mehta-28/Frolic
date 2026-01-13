import { Institute } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

// @desc    Get all institutes
// @route   GET /api/institutes
export const getInstitutes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const total = await Institute.countDocuments({});
        const institutes = await Institute.find({})
            .skip(skip)
            .limit(Number(limit))
            .sort({ name: 1 });

        sendResponse(res, 200, true, {
            institutes,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        }, 'Institutes fetched successfully');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Get institute by ID
// @route   GET /api/institutes/:id
export const getInstituteById = async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);
        if (institute) {
            sendResponse(res, 200, true, institute, 'Institute details fetched');
        } else {
            sendResponse(res, 404, false, null, 'Institute not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Create new institute
// @route   POST /api/institutes
export const createInstitute = async (req, res) => {
    try {
        const { name, location, contact } = req.body;

        const instituteExists = await Institute.findOne({ name });
        if (instituteExists) {
            return sendResponse(res, 400, false, null, 'Institute already exists');
        }

        const institute = await Institute.create({
            name,
            location,
            contact
        });

        sendResponse(res, 201, true, institute, 'Institute created successfully');
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Update institute
// @route   PUT /api/institutes/:id
export const updateInstitute = async (req, res) => {
    try {
        const { name, location, contact } = req.body;
        const institute = await Institute.findById(req.params.id);

        if (institute) {
            institute.name = name || institute.name;
            institute.location = location || institute.location;
            institute.contact = contact || institute.contact;

            const updatedInstitute = await institute.save();
            sendResponse(res, 200, true, updatedInstitute, 'Institute updated successfully');
        } else {
            sendResponse(res, 404, false, null, 'Institute not found');
        }
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Delete institute
// @route   DELETE /api/institutes/:id
export const deleteInstitute = async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);
        if (institute) {
            await institute.deleteOne();
            sendResponse(res, 200, true, null, 'Institute removed');
        } else {
            sendResponse(res, 404, false, null, 'Institute not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Get institute summary
// @route   GET /api/institutes/:id/summary
export const getInstituteSummary = async (req, res) => {
    try {
        const instituteId = req.params.id;
        const { Department, Event, Participant } = await import('../models/index.js');

        const departments = await Department.find({ institute: instituteId }).select('_id');
        const deptIds = departments.map(d => d._id);
        const eventsCount = await Event.countDocuments({ department: { $in: deptIds } });
        const participantsCount = await Participant.countDocuments({ institute: instituteId });

        sendResponse(res, 200, true, {
            instituteId,
            eventsCount,
            participantsCount
        }, 'Institute summary fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};
