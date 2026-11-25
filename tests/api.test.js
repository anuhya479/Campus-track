process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'campustrack-test-secret-key';

const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;
let token;
let taskId;

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
}, { timeout: 180000 });

after(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('CampusTrack API Tests', () => {

    // TEST 1: Register a new user
    test('Register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Student',
                email: 'student@test.com',
                password: 'Test1234'
            });

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.success, true);
    });

    // TEST 2: Login
    test('Login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'student@test.com',
                password: 'Test1234'
            });

        assert.equal(res.statusCode, 200);
        assert.ok(res.body.token);

        token = res.body.token;
    });

    // TEST 3: Reject unauthenticated requests
    test('Reject request without token', async () => {
        const res = await request(app)
            .get('/api/tasks');

        assert.equal(res.statusCode, 401);
    });

    // TEST 4: Create an assignment
    test('Create an assignment', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Java Assignment',
                subject: 'Java',
                description: 'Complete Java programs',
                priority: 'high',
                status: 'todo',
                dueDate: '2027-12-10'
            });

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.success, true);

        taskId = res.body.task._id;
        assert.ok(taskId);
    });

    // TEST 5: View all assignments
    test('View all assignments', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.tasks));
        assert.ok(res.body.tasks.length > 0);
    });

    // TEST 6: Validate assignment title
    test('Reject assignment with empty title', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: '',
                subject: 'Java',
                priority: 'high'
            });

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
    });

    // TEST 7: Update an assignment
    test('Update an assignment', async () => {
        const res = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'done'
            });

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.task.status, 'done');
    });

    // TEST 8: Delete an assignment
    test('Delete an assignment', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.statusCode, 204);
    });

});