const express = require('express');
const router = express.Router();
const contoller = require('../controllers/auth');

// localhost:5000/api/auth/login
router.post('/login', contoller.login);

// localhost:5000/api/auth/register
router.post('/register', contoller.register);

module.exports = router;