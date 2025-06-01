const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    },
    timer: {
        minutes: {
            type: Number,
            default: 0
        },
        seconds: {
            type: Number,
            default: 0
        }
    },
    priority: {
        type: Number,
        enum: [1, 2, 3], 
        default: 3
    },
    category: {
        type: String,
        enum: ['work', 'personal', 'Workout', 'health', 'general'],
        default: 'general'
    }
});

module.exports = mongoose.model('Task', taskSchema);