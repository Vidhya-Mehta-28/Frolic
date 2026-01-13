import mongoose from 'mongoose';

const eventWiseWinnerSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant',
        required: false
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false
    },
    prize: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Compound index to ensure unique rank per event at DB level
eventWiseWinnerSchema.index({ event: 1, rank: 1 }, { unique: true });

const EventWiseWinner = mongoose.model('EventWiseWinner', eventWiseWinnerSchema);
export default EventWiseWinner;
