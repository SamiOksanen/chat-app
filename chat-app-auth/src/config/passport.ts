import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { User } from '../db/schema.js';

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        function (
            username: string,
            password: string,
            done: (error: any, user?: any) => void
        ) {
            User.query()
                .where('username', username)
                .orWhere('email', username)
                .first()
                .then(function (user) {
                    if (!user) {
                        return done('Unknown user');
                    }
                    user.verifyPassword(
                        password,
                        function (
                            err: Error | undefined,
                            passwordCorrect: boolean
                        ) {
                            if (err) {
                                return done(err);
                            }
                            if (!passwordCorrect) {
                                return done('Invalid password');
                            }
                            return done(null, user);
                        }
                    );
                })
                .catch(function (err: Error) {
                    done(err);
                });
        }
    )
);

passport.use(
    new BearerStrategy(function (
        token: string,
        done: (error: any, user?: any) => void
    ) {
        User.query()
            .where('token', token)
            .first()
            .then(function (user) {
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            })
            .catch(function (err: Error) {
                done(err);
            });
    })
);

export default passport;
