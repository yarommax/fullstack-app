const express = require('express');
const router = express.Router();
const passport = require('passport');
const contoller = require('../controllers/order');


router.get('/', passport.authenticate('jwt', {session: false}) , contoller.getAll);
router.post('/', passport.authenticate('jwt', {session: false}) , contoller.create);

module.exports = router;