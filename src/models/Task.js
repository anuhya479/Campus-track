const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Assignment title is required'],
            trim: true,
            maxlength: 100,
        },

        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: '',
        },

        status: {
            type: String,
            enum: ['todo', 'in-progress', 'done'],
            default: 'todo',
        },

        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },

        dueDate: {
            type: Date,
        },

        tags: {
            type: [String],
            default: [],
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for filtering assignments by status
taskSchema.index({
    user: 1,
    status: 1,
    createdAt: -1
});

// Index for sorting assignments by creation date
taskSchema.index({
    user: 1,
    createdAt: -1
});

// Index for sorting assignments by deadline
taskSchema.index({
    user: 1,
    dueDate: 1
});

module.exports = mongoose.model('Task', taskSchema);