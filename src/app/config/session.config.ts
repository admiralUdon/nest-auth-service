import { SessionOptions, MemoryStore } from 'express-session';

export const sessionConfig = (): SessionOptions => ({
    secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        maxAge: 3600000, // Session expiration time (in milliseconds), here it's set to 1 hour
        httpOnly: true, // Prevents client side JS from reading the cookie
        secure: false, // Set to true if using HTTPS
    },
    store: new MemoryStore()
})