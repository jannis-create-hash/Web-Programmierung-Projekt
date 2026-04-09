const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'Homepage.html'));
});

app.get('/HTML/Dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'Dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
