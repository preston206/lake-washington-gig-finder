require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false });
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require('morgan');
// const jade = require('jade');
const { router: usersRouter } = require('./users');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');
const { router: jobsRouter } = require('./jobs');
mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');

// express static middleware
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Logging
app.use(morgan('common'));

// const { Job } = require('./models');
// const { users } = require('./models');

// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});


app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
app.use('/jobs/', jobsRouter);

// A protected endpoint which needs a valid JWT to access it
app.get('/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        return res.json({
            data: 'Beware of clowns!'
        });
    }
);


// ----- CRUD ENDPOINTS ----- 
// (Create) post job enpoint
// app.post('/job', jsonParser, urlencodedParser, (req, res, next) => {

//     let requiredFields = [
//         "company",
//         "title",
//         "salary",
//         "region",
//         "city",
//         "email",
//         "technologies",
//         "description"
//     ];
//     for (let i = 0; i < requiredFields.length; i++) {
//         let field = requiredFields[i];
//         if (!(field in req.body)) {
//             let message = `${field} is missing from the request body`;
//             console.error(message);
//             return res.status(400).send(message);
//         };
//     };

//     let { company, title, salary, region, city, email, technologies, description } = req.body;

//     // console.log(req.body);
//     // console.log(req.body.email);
//     // console.log(job);


//     // TODO: try to refactor the job edit page to hit the PUT endpoint
//     // e.g. using AJAX method: 'PUT'
//     if (req.body.id) {
//         let id = req.body.id;
//         let idTrimmed = id.trim();

//         const jobFieldsToUpdate = {};
//         const updateableJobFields = [
//             'company',
//             'title',
//             'salary',
//             'region',
//             'city',
//             'email',
//             'technologies',
//             'description'
//         ];

//         updateableJobFields.forEach(jobField => {
//             if (jobField in req.body) {
//                 jobFieldsToUpdate[jobField] = req.body[jobField];
//             };
//         });

//         return Job
//             .findByIdAndUpdate(idTrimmed, { $set: jobFieldsToUpdate }, { new: true })
//             .exec()
//             .then(job => {
//                 return res.status(201).json({
//                     message: "job has been updated.",
//                     data: job.apiRepr()
//                 });
//             })
//             .catch(error => {
//                 return res.status(500).json({
//                     message: "Internal Server Error."
//                 });
//             });
//     }
//     else {
//         return Job
//             .create({
//                 company,
//                 title,
//                 salary,
//                 region,
//                 city,
//                 email,
//                 technologies,
//                 description
//             })
//             .then(job => {
//                 res.status(201);
//                 res.render('test');
//             })
//             .catch(error => {
//                 return res.status(500).json({
//                     message: "Internal Server Error."
//                 });
//             });
//     }
// });

// // test route
// // app.post('/test', (req, res, next) => {
// //     res.render('test');
// // })

// // (Read) get ALL jobs
// app.get('/jobs', (req, res) => {
//     return Job
//         .find()
//         .then(jobs => res.json(jobs.map(job => job.apiRepr())))
//         .catch(error => res.status(500).json({
//             message: 'Internal Server Error.'
//         }));
// });

// // (Read) get ONE job
// app.get('/job/:id', (req, res) => {
//     return Job
//         .findById(req.params.id)
//         .then(job => res.json(job.apiRepr()))
//         .catch(error => res.status(500).json({
//             message: 'Internal Server Error.'
//         }));
// });

// // (Update) put job
// app.put('/job/:id', jsonParser, (request, response) => {

//     let requiredFields = [
//         'id',
//         'company',
//         'title',
//         'salary',
//         'region',
//         'city',
//         'email',
//         'technologies',
//         'description'
//     ];

//     for (let i = 0; i < requiredFields.length; i++) {
//         let field = requiredFields[i];
//         if (!(field in request.body)) {
//             let message = `${field} missing from request body`;
//             console.error(message);
//             response.status(400).send(message);
//         };
//     };

//     if (request.params.id !== request.body.id) {
//         const idMatchMessage =
//             `URL param ID: ${request.params.id} and body ID: ${request.body.id} must match`;
//         console.log(idMatchMessage);
//         return response.status(400).send(idMatchMessage);
//     };

//     const jobFieldsToUpdate = {};
//     const updateableJobFields = [
//         'company',
//         'title',
//         'salary',
//         'region',
//         'city',
//         'email',
//         'technologies',
//         'description'
//     ];

//     updateableJobFields.forEach(jobField => {
//         if (jobField in request.body) {
//             jobFieldsToUpdate[jobField] = request.body[jobField];
//         };
//     });

//     return Job
//         .findByIdAndUpdate(request.params.id, { $set: jobFieldsToUpdate }, { new: true })
//         .exec()
//         .then(job => {
//             return response.status(201).json({
//                 message: "job has been updated.",
//                 data: job.apiRepr()
//             });
//         })
//         .catch(error => {
//             return response.status(500).json({
//                 message: "Internal Server Error."
//             });
//         });
// });

// // (Delete) delete job
// app.delete('/job/delete/:id', (req, res) => {
//     return Job
//         .findByIdAndRemove(req.params.id)
//         .exec()
//         .then(res.status(204).end())
//         .catch(error => res.status(500).json({
//             message: "Internal Server Error."
//         }));
// });


//  ----- API FOR GETTING INDIVIDUAL PAGES ----- 
// get root
app.get('/', (request, response) => {
    response.sendFile('/index.html');
});

// get job search page
app.get('/find', (req, res) => {
    res.sendFile(__dirname + '/public/find.html');
});

// get job post page
// app.get('/post', (req, res) => {
//     res.sendFile(__dirname + '/public/post.html');
// });

// get job edit page
app.get('/edit', (req, res) => {
    res.sendFile(__dirname + '/public/edit.html');
});

// 9/25/17 added removeHeader to fix dialog box popup when passport sends back 401
app.use(function (err, req, res, next) {
    res.removeHeader('www-authenticate');
    next(err);
});

let server;

function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, err => {
            useMongoClient: true;
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                let dateTime = new Date();
                let hourMinute =
                    dateTime.getHours() +
                    ":" + (dateTime.getMinutes() < 10 ? '0' : '') +
                    dateTime.getMinutes();

                console.log(hourMinute + ` - I'm listening on ${PORT}...`);

                resolve();
            })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Server is down.');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };