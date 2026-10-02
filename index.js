const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// مسار البحث
app.get('/search', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        if (!targetUrl) return res.status(400).json({ error: 'Missing URL' });

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'VLSub 0.10.3',
                'X-User-Agent': 'VLSub 0.10.3',
                'Accept': 'application/json'
            },
            timeout: 8000
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// مسار التحميل: يمرر الملف كما هو (بدون تحويل لنص)
app.get('/download', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        if (!targetUrl) return res.status(400).send('Missing URL');

        // حماية: فقط روابط opensubtitles
        if (!/^https?:\/\/([a-z0-9-]+\.)*opensubtitles\.org\//i.test(targetUrl)) {
            return res.status(403).send('Forbidden host');
        }

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'VLSub 0.10.3',
                'X-User-Agent': 'VLSub 0.10.3',
                'Accept': '*/*'
            },
            responseType: 'arraybuffer',
            decompress: false,
            timeout: 10000
        });

        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(Buffer.from(response.data));
    } catch (error) {
        res.status(error.response?.status || 500).send('Download Failed');
    }
});

module.exports = app;
