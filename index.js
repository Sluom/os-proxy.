const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// مسار البحث: يجيب نتائج البحث (روابط الترجمات)
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

// مسار التحميل: يحمل ملف الترجمة كـ Text ويسلمه لـ Render
app.get('/download', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        if (!targetUrl) return res.status(400).send('Missing URL');

        const response = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'VLSub 0.10.3' },
            responseType: 'text', // نجبره يقراه كنص صافي
            timeout: 10000
        });
        
        // نرجع النص الصافي لـ Render
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Download Failed');
    }
});

module.exports = app;
