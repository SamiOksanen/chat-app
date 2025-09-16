import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Controllers (route handlers).
 */
import * as userController from './controllers/user.js';

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
const port = process.env['PORT'] || 8084;
const sessionSecret = process.env['SESSION_SECRET'];

if (!sessionSecret) {
    console.error('SESSION_SECRET environment variable is required');
    process.exit(1);
}

app.set('port', port);
app.set('json spaces', 2); // number of spaces for indentation
app.use(bodyParser.json());
app.use(
    session({
        secret: sessionSecret,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.post('/login', userController.postLogin);
app.post('/signup', userController.postSignup);
app.get('/webhook', userController.getWebhook);

/*
app.get("/logout", (req, res, next) => {
    req.session.destroy(() => {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect("/");
        });
    });
});
*/

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log(`Server listening port ${app.get('port')}`);
});

export default app;
