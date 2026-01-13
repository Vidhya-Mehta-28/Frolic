import { Department } from '../models/index.js';
import { sendResponse } from '../utils/responseHandler.js';

// @desc    Get all departments
// @route   GET /api/departments
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}).populate('institute', 'name');
        sendResponse(res, 200, true, departments, 'Departments fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Get departments by institute ID
// @route   GET /api/institutes/:id/departments
export const getInstituteDepartments = async (req, res) => {
    try {
        const departments = await Department.find({ institute: req.params.id });
        sendResponse(res, 200, true, departments, 'Institute departments fetched');
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};

// @desc    Create new department
// @route   POST /api/departments
export const createDepartment = async (req, res) => {
    try {
        const { name, hod, contactEmail, institute } = req.body;

        const duplicate = await Department.findOne({ name, institute });
        if (duplicate) {
            return sendResponse(res, 400, false, null, 'A department with this name already exists in this institute');
        }

        const department = await Department.create({
            name,
            hod,
            contactEmail,
            institute
        });

        sendResponse(res, 201, true, department, 'Department created successfully');
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Update department
// @route   PUT /api/departments/:id
export const updateDepartment = async (req, res) => {
    try {
        const { name, hod, contactEmail, institute } = req.body;
        const department = await Department.findById(req.params.id);

        if (department) {
            if (name || institute) {
                const targetName = name || department.name;
                const targetInstitute = institute || department.institute;
                const duplicate = await Department.findOne({
                    name: targetName,
                    institute: targetInstitute,
                    _id: { $ne: req.params.id }
                });
                if (duplicate) {
                    return sendResponse(res, 400, false, null, 'Another department with this name already exists in this institute');
                }
            }

            department.name = name || department.name;
            department.hod = hod || department.hod;
            department.contactEmail = contactEmail || department.contactEmail;
            department.institute = institute || department.institute;

            const updatedDepartment = await department.save();
            sendResponse(res, 200, true, updatedDepartment, 'Department updated successfully');
        } else {
            sendResponse(res, 404, false, null, 'Department not found');
        }
    } catch (error) {
        sendResponse(res, 400, false, null, error.message);
    }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (department) {
            await department.deleteOne();
            sendResponse(res, 200, true, null, 'Department removed');
        } else {
            sendResponse(res, 404, false, null, 'Department not found');
        }
    } catch (error) {
        sendResponse(res, 500, false, null, error.message);
    }
};
