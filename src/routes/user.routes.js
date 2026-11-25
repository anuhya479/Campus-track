const router = require('express').Router();

const { getUsers } = require('../controllers/user.controller');

const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, restrictTo('admin'), getUsers);

module.exports = router;