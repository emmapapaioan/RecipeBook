const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Tesseract = require('tesseract.js');

const app = express();

app.use(cors());

app.get('/ocr', async (req, res) => {
    const imageUrl = req.query.imageUrl;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Missing imageUrl parameter' });
    }

    try {
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        const result = await Tesseract.recognize(imageBuffer, 'eng', { logger: m => console.log(m) });
        return res.json({ text: result.data.text });
    } catch (error) {
        console.error('Error performing OCR:', error);
        return res.status(500).json({ error: 'Error performing OCR' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
