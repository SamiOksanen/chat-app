const passport = require('../config/passport');
const { User } = require('../db/schema');
const { errorHandler } = require('../db/errors');
const { check, validationResult } = require('express-validator');

/**
 * POST /login
 * Sign in using username and password.
 */
exports.postLogin = async (req, res, next) => {
    await check('username', 'Username is not valid').notEmpty().run(req);
    await check('password', 'Password cannot be blank').notEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 'errors': errors });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) { return handleResponse(res, 400, { 'error': err }) }
        if (user) {
            handleResponse(res, 200, user.getUser());
        }
    })(req, res, next);
};


/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = async (req, res, next) => {
    await check('username', 'Username is not valid').notEmpty().run(req);
    await check('password', 'Password must be at least 8 characters long').isLength({ min: '8' }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);
    await check('email', 'Email is not valid').isEmail().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.info(
            `validation results: ${JSON.stringify(
                errors,
            )}, is empty? ${errors.isEmpty()}`,
        );
        return res.status(400).json({ 'errors': errors });
    }

    try {
        const user = await User.query()
            .insert({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
            });
    } catch (err) {
        errorHandler(err, res);
        return;
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) { return handleResponse(res, 400, { 'error': err }) }
        if (user) {
            handleResponse(res, 200, user.getUser());
        }
    })(req, res, next);
};

exports.getWebhook = async (req, res, next) => {
    passport.authenticate('bearer', (err, user, info) => {
        if (err) { return handleResponse(res, 401, { 'error': err }); }
        if (user) {
            handleResponse(res, 200, {
                'X-Hasura-Role': 'user',
                'X-Hasura-User-Id': `${user.userid}`
            });
        } else {
            handleResponse(res, 200, { 'X-Hasura-Role': 'anonymous' });
        }
    })(req, res, next);
}


function handleResponse(res, code, statusMsg) {
    res.status(code).json(statusMsg);
}