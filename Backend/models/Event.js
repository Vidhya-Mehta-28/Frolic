import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rules: [{
        type: String
    }],
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: false
    },
    maxParticipants: {
        type: Number,
        default: 100
    },
    groupMinParticipants: {
        type: Number,
        default: 1
    },
    groupMaxParticipants: {
        type: Number,
        default: 1
    },
    maxGroupsAllowed: {
        type: Number,
        default: 50
    }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
