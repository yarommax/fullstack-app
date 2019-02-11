const express = require('express');
const router = express.Router();
const contoller = require('../controllers/analytics');
const passport = require('passport')


router.get('/overview', passport.authenticate('jwt', {session: false}) ,contoller.overview);
router.get('/analytics', passport.authenticate('jwt', {session: false}) ,contoller.analytics);

module.exports = router;