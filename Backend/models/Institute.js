import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Institute = mongoose.model('Institute', instituteSchema);
export default Institute;
