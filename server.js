const express = require('express');
const app = express();

// express static middleware
app.use(express.static('public'));



// get root
app.get('/', (request, response) => {
    response.sendFile('/index.html');
});

// get job search page
app.get('/find', (req, res) => {
    res.sendFile(__dirname + '/public/find.html');
});

// get job post page
app.get('/post', (req, res) => {
    res.sendFile(__dirname + '/public/post.html');
});

// get job edit page
app.get('/edit', (req, res) => {
    res.sendFile(__dirname + '/public/edit.html');
});


app.listen(process.env.PORT || 8080, () => {
    let dateTime = new Date();
    let hourMinute = dateTime.getHours() + ":" + (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes();

    console.log(hourMinute + " I'm listening on 8080...");
});

module.exports = { app };