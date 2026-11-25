const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// GET ALL USERS - ADMIN ONLY
exports.getUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .select('-password -__v')
        .lean();

    res.json({
        success: true,
        count: users.length,
        users
    });
});