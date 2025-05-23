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
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ],
        prompt: 'consent'
    });

    res.redirect(authUrl);

});

router.get('/callback', authMiddleware, async (req: any, res: any) => {
    const code = req.query.code;
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log('Refresh Token:', tokens.refresh_token);

        // Store the tokens in the session or database
        await prisma.user.update({
            where: { id: req.userId },
            data: {
                googleRefreshToken: tokens.refresh_token
            }
        })

        res.redirect('https://routine-three-nu.vercel.app/dashboard');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Authentication failed');
    }
});

function googleAuthMiddleware(req: any, res: any, next: any) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: req.googleRefreshToken
    });
    req.oauth2Client = oauth2Client;

    next();
}

router.post('/events/create', authMiddleware, googleAuthMiddleware, async (req: any, res: any) => {
    const oauth2Client = req.oauth2Client;
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: req.body
        });
        res.json(response.data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/events', authMiddleware, googleAuthMiddleware, async (req: any, res: any) => {
    const oauth2Client = req.oauth2Client;
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    try {
        const events = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startOfMonth,
            timeMax: endOfMonth,
            singleEvents: true,
            orderBy: 'startTime',
        });
        res.json(events.data.items);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/events/:id', authMiddleware, googleAuthMiddleware, async (req: any, res: any) => {
    const oauth2Client = req.oauth2Client;
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        const response = await calendar.events.update({
            calendarId: 'primary',
            eventId: req.params.id,
            requestBody: req.body
        });
        res.json(response.data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/events/:id', authMiddleware, googleAuthMiddleware, async (req: any, res: any) => {
    const oauth2Client = req.oauth2Client;
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: req.params.id
        });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/check', authMiddleware, googleAuthMiddleware, async (req: any, res: any) => {
    const oauth2Client = req.oauth2Client;

    if (!oauth2Client) {
        return res.status(401).json({ error: "No Refresh Token" });
    }

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });

    try {
        const userInfo = await oauth2.userinfo.get();
        res.status(200).json(userInfo.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
});

export default router;