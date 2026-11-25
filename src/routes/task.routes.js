const router = require('express').Router();

const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    getTaskStats
} = require('../controllers/task.controller');

const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getTaskStats);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .get(getTask)
    .patch(updateTask)
    .delete(deleteTask);

module.exports = router;