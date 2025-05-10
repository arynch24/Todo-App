import express from 'express';
import { google } from 'googleapis';
import { PrismaClient } from "@prisma/client";
import authMiddleware from '../middleware.js';

const router = express.Router();

const prisma = new PrismaClient();

router.get('/auth', (req: any, res: any) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        prompt: 'consent'
    });

    res.redirect(authUrl);

});

router.get('/callback',authMiddleware, async (req: any, res: any) => {
    const code = req.query.code;
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Store the tokens in the session or database
        prisma.user.update({
            where: { id: req.userId },
            data: {
                googleRefreshToken: tokens.refresh_token
            }
        })

        res.redirect('http://localhost:5173/dashboard');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Authentication failed');
    }
});

export default router;