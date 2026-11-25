const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        throw new AppError('Authentication required', 401);
    }

    const token = header.split(' ')[1];

    const decoded = jwt.verify(
        token, process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.sub);

    if (!user) {
        throw new AppError('User no longer exists', 401);
    }

    req.user = user;
    next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError(
            'You do not have permission to do this', 403
        ));
    }

    next();
};