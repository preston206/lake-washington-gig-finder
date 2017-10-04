// require('dotenv').config();
const express = require('express');
// const router = express();
// const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const passport = require('passport');
// const mongoose = require('mongoose');
const router = express.Router();

// const { router: usersRouter } = require('../users');
// const { router: authRouter, basicStrategy, jwtStrategy } = require('../auth');
// mongoose.Promise = global.Promise;
// const { PORT, DATABASE_URL } = require('../config');

const { Job } = require('./models');
const { User } = require('../users/models');

// ----- CRUD ENDPOINTS ----- 
// (Create) post job enpoint
router.post('/post', jsonParser, urlencodedParser, (req, res, next) => {

    let requiredFields = [
        "company",
        "title",
        "salary",
        "region",
        "city",
        "email",
        "technologies",
        "description",
        "postedBy"
    ];

    for (let i = 0; i < requiredFields.length; i++) {
        let field = requiredFields[i];
        if (!(field in req.body)) {
            let message = `${field} is missing from the request body`;
            console.error(message);
            return res.status(400).send(message);
        };
    };

    let { company, title, salary, region, city, email, technologies, description, postedBy } = req.body;

    return Job
        .create({
            company,
            title,
            salary,
            region,
            city,
            email,
            technologies,
            description,
            postedBy
        })
        .then(job => {
            return res.status(201).json({
                message: "Job has been posted.",
                data: job.apiRepr()
            });
        })
        .catch(error => {
            return res.status(500).json({
                message: "Internal Server Error."
            });
        });
});




// copy of job post code
// return Job
// .create({
//     company,
//     title,
//     salary,
//     region,
//     city,
//     email,
//     technologies,
//     description
// })
// .then(job => {
//     res.status(201);
//     res.render('test');
// })
// .catch(error => {
//     return res.status(500).json({
//         message: "Internal Server Error."
//     });
// });




// (Read) get ALL jobs
router.get('/', (req, res) => {
    return Job
        .find()
        .sort({ postDate: -1 })
        .then(jobs => res.json(jobs.map(job => job.apiRepr())))
        .catch(error => res.status(500).json({
            message: 'Internal Server Error.'
        }));
});

// (Read) get ONE job by ID
router.get('/getone/:id', (req, res) => {
    return Job
        .findById(req.params.id)
        .then(job => res.json(job.apiRepr()))
        .catch(error => res.status(500).json({
            message: 'Internal Server Error.'
        }));
});

// (Read) find and get jobs posted by user
router.get('/getmyjobs/:id', (req, res) => {
    return Job
        .find({ postedBy: req.params.id })
        .sort({ postDate: -1 })
        .then(jobs => res.json(jobs.map(job => job.apiRepr())))
        .catch(error => res.status(500).json({
            message: 'Internal Server Error.'
        }));
});

// (Read) find and get jobs by region
router.get('/region/:region', (req, res) => {
    return Job
        .find({ region: req.params.region })
        .sort({ postDate: -1 })
        .then(jobs => res.json(jobs.map(job => job.apiRepr())))
        .catch(error => res.status(500).json({
            message: 'Internal Server Error.'
        }));
});

// (Update / PUT) modify job post
router.put('/update/:id', jsonParser, urlencodedParser, (request, response) => {
    // let technologies = request.body.technologies;

    // technologies.map(function (technology, index) {
    //     technologies[index] = technology.trim();
    // });

    let requiredFields = [
        'id',
        'company',
        'title',
        'salary',
        'region',
        'city',
        'email',
        'technologies',
        'description'
    ];

    for (let i = 0; i < requiredFields.length; i++) {
        let field = requiredFields[i];
        if (!(field in request.body)) {
            let message = `${field} is missing from the request body`;
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

    const jobFieldsToUpdate = {};
    const updateableJobFields = [
        'company',
        'title',
        'salary',
        'region',
        'city',
        'email',
        'technologies',
        'description'
    ];

    updateableJobFields.forEach(jobField => {
        if (jobField in request.body) {
            jobFieldsToUpdate[jobField] = request.body[jobField];
        };
    });

    return Job
        .findByIdAndUpdate(request.params.id, { $set: jobFieldsToUpdate }, { new: true })
        .exec()
        .then(job => {
            return response.status(201).json({
                message: "job has been updated.",
                data: job.apiRepr()
            });
        })
        .catch(error => {
            return response.status(500).json({
                message: "Internal Server Error."
            });
        });
});

// (Delete) delete job
router.delete('/delete/:id', (req, res) => {
    return Job
        .findByIdAndRemove(req.params.id)
        .exec()
        .then(res.status(204).end())
        .catch(error => res.status(500).json({
            message: "Internal Server Error."
        }));
});

// TODO create some middleware to auth for job update, del, post
function authorizeJobTask() {
    // code
};


module.exports = { router };