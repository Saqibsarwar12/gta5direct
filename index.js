const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Google Drive API setup
const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account.json', 
    scopes: ["https://www.googleapis.com/auth/drive"]
});

const drive = google.drive({ version: 'v3', auth });

// Generate temporary link
app.get('/generate-link', async (req, res) => { 
    try { 
        const fileId = req.query.fileId; // File ID from Google Drive
        if (!fileId) return res.status(400).send("File ID required");

        const expiryTime = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins expiry
        const link = `https://drive.google.com/uc?id=${fileId}&expiry=${expiryTime}`;

        res.json({ downloadLink: link });
    } catch (error) { 
        res.status(500).send('Error generating link'); 
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));