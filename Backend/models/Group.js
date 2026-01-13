import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant'
    }],
    isPaymentDone: {
        type: Boolean,
        default: false
    },
    isPresent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);
export default Group;
