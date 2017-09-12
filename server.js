const express = require('express');
// const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// express static middleware
app.use(express.static('public'));

const { jobs } = require('./models');


// create some mock data
// params: company, title, [technologies]
jobs.create("TechNinja", "Engineer", ["html", "css"]);
jobs.create("IT-Crowd", "Dev", ["React", "Node"]);
jobs.create("ModernCode", "MongoDB Admin", ["MongoDB", "JS", "Express"]);


// CRUD endpoints
// post job enpoint
app.post('/jobs', jsonParser, (req, res) => {
    let requiredFields = ["company", "title", "technologies"];
    for (let i = 0; i < requiredFields.length; i++) {
        let field = requiredFields[i];
        if (!(field in req.body)) {
            let message = `${field} missing from request body`;
            console.error(message);
            return res.status(400).send(message);
        };
    };
    // use this method to create the request body nodes for
    // the required fields
    const item = jobs.create(
        req.body.company,
        req.body.title,
        req.body.technologies);

    res.status(201).json(item);
});

// get jobs endpoint
app.get('/jobs', (req, res) => {
    res.json(jobs.get());
});

// put job endpoint
app.put('/jobs/:id', jsonParser, (request, response) => {
    let requiredFields = ["id", "company", "title", "technologies"];
    for (let i = 0; i < requiredFields.length; i++) {
        let field = requiredFields[i];
        if (!(field in request.body)) {
            let message = `${field} missing from request body`;
            console.error(message);
            response.status(400).send(message);
        };
    };

    if (request.params.id !== request.body.id) {
        const idMatchMessage =
            `URL param ID: ${request.params.id} and body ID: ${request.body.id} must match`;
        console.log(idMatchMessage);
        return response.status(400).send(idMatchMessage);
    };

    jobs.update({
        id: request.params.id,
        company: request.body.company,
        title: request.body.title,
        technologies: request.body.technologies
    });
    console.log(`Job ID ${request.params.id} has been updated.`);
    response.status(204).end();
});

// delete job endpoint
app.delete('/jobs/:id', (req, res) => {
    jobs.delete(req.params.id);
    console.log(`Job ID ${req.params.id} deleted.`);
    res.status(204).end();
});


// API for getting individual pages
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


// start server
app.listen(process.env.PORT || 8080, () => {
    let dateTime = new Date();
    let hourMinute =
        dateTime.getHours() +
        ":" + (dateTime.getMinutes() < 10 ? '0' : '') +
        dateTime.getMinutes();

    console.log(hourMinute + " - I'm listening on 8080...");
});

module.exports = { app };