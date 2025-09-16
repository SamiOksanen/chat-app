import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import passport from '../config/passport.js';
import { User } from '../db/schema.js';
import { errorHandler } from '../db/errors.js';
import type {
    LoginRequest,
    SignupRequest,
    HasuraWebhookResponse,
    UserInsert,
} from '../types/index.js';

/**
 * POST /login
 * Sign in using username and password.
 */
export const postLogin = async (
    req: Request<{}, any, LoginRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    await body('username', 'Username is not valid').notEmpty().run(req);
    await body('password', 'Password cannot be blank').notEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors });
        return;
    }

    passport.authenticate('local', (err: any, user: any) => {
        if (err) {
            handleResponse(res, 400, { error: err });
            return;
        }
        if (user) {
            handleResponse(res, 200, user.getUser());
        }
    })(req, res, next);
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (
    req: Request<{}, any, SignupRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    await body('username', 'Username is not valid').notEmpty().run(req);
    await body('password', 'Password must be at least 8 characters long')
        .isLength({ min: 8 })
        .run(req);
    await body('confirmPassword', 'Passwords do not match')
        .equals(req.body.password)
        .run(req);
    await body('email', 'Email is not valid').isEmail().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.info(
            `validation results: ${JSON.stringify(
                errors
            )}, is empty? ${errors.isEmpty()}`
        );
        res.status(400).json({ errors: errors });
        return;
    }

    try {
        const userInsert: UserInsert = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
        };

        await User.query().insert(userInsert);
    } catch (err) {
        if (err instanceof Error) {
            errorHandler(err, res);
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
        return;
    }

    passport.authenticate('local', (err: any, user: any) => {
        if (err) {
            handleResponse(res, 400, { error: err });
            return;
        }
        if (user) {
            handleResponse(res, 200, user.getUser());
        }
    })(req, res, next);
};

export const getWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    passport.authenticate('bearer', (err: any, user: any) => {
        if (err) {
            handleResponse(res, 401, { error: err });
            return;
        }
        if (user) {
            const response: HasuraWebhookResponse = {
                'X-Hasura-Role': 'user',
                'X-Hasura-User-Id': `${user.userid}`,
            };
            handleResponse(res, 200, response);
        } else {
            const response: HasuraWebhookResponse = {
                'X-Hasura-Role': 'anonymous',
            };
            handleResponse(res, 200, response);
        }
    })(req, res, next);
};

function handleResponse(res: Response, code: number, statusMsg: any): void {
    res.status(code).json(statusMsg);
}
