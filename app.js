const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
});
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, '/game.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on PORT: ${PORT}`);
})

