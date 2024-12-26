const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    // Load the index.html file from the parent directory
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000);