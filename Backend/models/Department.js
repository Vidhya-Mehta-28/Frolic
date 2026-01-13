import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    hod: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
