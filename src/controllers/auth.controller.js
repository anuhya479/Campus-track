const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

function signToken(userId) {
    return jwt.sign(
        { sub: userId.toString() },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        }
    );
}

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password
    });

    res.status(201).json({
        success: true,
        token: signToken(user._id),
        user,
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' ||
        typeof password !== 'string') {
        throw new AppError('Email and password are required', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid email or password', 401);
    }

    res.json({
        success: true,
        token: signToken(user._id),
        user
    });
});

exports.me = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});