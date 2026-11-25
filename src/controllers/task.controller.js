const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const ALLOWED = [
    'title',
    'subject',
    'description',
    'status',
    'priority',
    'dueDate',
    'tags'
];

const pick = (obj, keys) =>
    Object.fromEntries(
        keys.filter((k) => obj[k] !== undefined)
            .map((k) => [k, obj[k]])
    );

// CREATE ASSIGNMENT
exports.createTask = asyncHandler(async (req, res) => {
    const task = await Task.create({
        ...pick(req.body, ALLOWED),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        task
    });
});

// VIEW ALL ASSIGNMENTS
// FILTERING, SEARCH, SORTING AND PAGINATION

const escapeRegex = (s) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTABLE = [
    'createdAt',
    'dueDate',
    'priority',
    'title',
    'status',
    'subject'
];

exports.getTasks = asyncHandler(async (req, res) => {
    const {
        status,
        priority,
        search,
        tag,
        sort = '-createdAt'
    } = req.query;

    // FILTERING
    const filter = { user: req.user._id };

    if (typeof status === 'string')
        filter.status = status;

    if (typeof priority === 'string')
        filter.priority = priority;

    if (typeof tag === 'string')
        filter.tags = tag;

    // SEARCHING
    if (typeof search === 'string' && search.trim()) {
        const rx = new RegExp(
            escapeRegex(search.trim()), 'i'
        );

        filter.$or = [
            { title: rx },
            { description: rx },
            { subject: rx }
        ];
    }

    // SORTING
    const sortField = typeof sort === 'string'
        ? sort.replace(/^-/, '')
        : '';

    const sortBy = SORTABLE.includes(sortField)
        ? sort
        : '-createdAt';

    // PAGINATION
    const page = Math.max(
        parseInt(req.query.page, 10) || 1, 1
    );

    const limit = Math.min(
        Math.max(parseInt(req.query.limit, 10) || 10, 1),
        100
    );

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
        Task.find(filter)
            .populate('user', 'name email')
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .lean(),
        Task.countDocuments(filter)
    ]);

    res.json({
        success: true,
        count: tasks.length,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        tasks
    });
});

// VIEW ONE ASSIGNMENT
exports.getTask = asyncHandler(async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!task)
        throw new AppError('Assignment not found', 404);

    res.json({ success: true, task });
});

// UPDATE ASSIGNMENT
exports.updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findOneAndUpdate(
        {
            _id: req.params.id,
            user: req.user._id
        },
        {
            $set: pick(req.body, ALLOWED)
        },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    if (!task)
        throw new AppError('Assignment not found', 404);

    res.json({ success: true, task });
});

// DELETE ASSIGNMENT
exports.deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    });

    if (!task)
        throw new AppError('Assignment not found', 404);

    res.status(204).send();
});