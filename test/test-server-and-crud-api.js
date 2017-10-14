const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

// const { app } = require('../server');
// const { router: jobsRouter } = require('../jobs');
// app.use('/jobs/', jobsRouter);

//import db urls, port, run\close server, models
const { PORT, TEST_DATABASE_URL } = require('../config');
const { runServer, closeServer, app } = require('../server');
const { Job } = require('../jobs/models');
const { User } = require('../users/models');
// const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);


// drop db
function dropDB() {
    return new Promise((resolve, reject) => {
        console.warn('dropping db...');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err))
    });
};

// seed db
function seedDB() {
    console.info('seeding db...');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push({
            company: faker.company.companyName(),
            title: faker.name.title(),
            salary: "80K - 89K",
            region: "NE",
            city: faker.address.city(),
            email: faker.internet.email(),
            technologies: [
                "HTML",
                "CSS",
                "JS"
            ],
            description: faker.random.words(),
            postedBy: "59dc02c61f0fdf1c344a129f"
        });
    }

    // this will return a promise
    return Job.insertMany(seedData);
}


// server.js test
describe('Server', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedDB();
    });

    afterEach(function () {
        return dropDB();
    });

    after(function () {
        return closeServer();
    });

    it('should test for 200 and html when getting index', function () {
        return chai.request(app)
            .get('/')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });

    it('should test for 200 and html when getting job search page', function () {
        return chai.request(app)
            .get('/find')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });

    it('should test for 200 and html when getting user registration page', function () {
        return chai.request(app)
            .get('/register')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });

    // it('should test for 200 when getting job search data', function () {

    //     return chai.request(app)
    //         .get('/jobs/')
    //         .then(function (response) {
    //             response.body.should.be.a('array');
    //         })
    // });

    // it('should fail when hitting the auth protected post route', function () {
    //     return chai.request(app)
    //         .get('/auth/post')
    //         .then(function (response) {
    //             response.should.fail();
    //         });
    // });

    // it('should fail when hitting the auth protected edit route', function () {
    //     return chai.request(app)
    //         .get('/auth/edit')
    //         .then(function (response) {
    //             response.should.fail();
    //         });
    // });

});


// jobs API test
describe('Jobs API', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedDB();
    });

    afterEach(function () {
        return dropDB();
    });

    after(function () {
        return closeServer();
    });

    it('should list jobs on GET', function () {

        return chai.request(app)
            .get('/jobs/')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.length.should.be.at.least(1);

                const expectedKeys = [
                    'id',
                    'postDate',
                    'company',
                    'title',
                    'salary',
                    'region',
                    'city',
                    'email',
                    'technologies',
                    'description',
                    'postedBy'
                ];

                response.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

    it('should create a job on POST', function () {
        const newJob = {
            company: faker.company.companyName(),
            title: faker.name.title(),
            salary: "80K - 89K",
            region: "NE",
            city: faker.address.city(),
            email: faker.internet.email(),
            technologies: [
                "HTML",
                "CSS",
                "JS"
            ],
            description: faker.random.words(),
            postedBy: "59dc02c61f0fdf1c344a129f"
        };

        return chai.request(app)
            .post('/jobs/post')
            .send(newJob)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys(
                    'data',
                    'message'
                );
                // the POST endpoint is actually
                // sending message and data keys
                // and so the the following keys
                // are found under "data"
                res.body.data.should.include.keys(
                    'id',
                    'company',
                    'title',
                    'salary',
                    'region',
                    'city',
                    'email',
                    'technologies',
                    'description',
                    'postedBy'
                );
                // "id" is found under "data"
                res.body.data.id.should.not.be.null;
                res.body.data.company.should.equal(newJob.company);
                res.body.data.description.should.equal(newJob.description);
                return Job.findById(res.body.data.id).exec();
            })
            .then(function (post) {
                post.company.should.equal(newJob.company);
                post.title.should.equal(newJob.title);
                post.description.should.equal(newJob.description);
            });
    });

    it('should modify a job on PUT', function () {
        const updateJob = {
            id: "",
            company: faker.company.companyName(),
            title: faker.name.title(),
            salary: "80K - 89K",
            region: "NE",
            city: faker.address.city(),
            email: faker.internet.email(),
            technologies: [
                "HTML",
                "CSS",
                "JS"
            ],
            description: faker.random.words(),
            postedBy: "59dc02c61f0fdf1c344a129f"
        };

        return chai.request(app)
            .get('/jobs/')
            .then(function (res) {
                updateJob.id = res.body[0].id;

                return chai.request(app)
                    .put(`/jobs/update/${updateJob.id}`)
                    .send(updateJob)
            })
            .then(function (res) {
                res.should.have.status(204);
                // res.should.be.json;
                // res.body.should.be.a('object');
                // res.body.should.deep.equal(updateJob);
            });
    });

    it('should delete a job on DELETE', function () {
        return chai.request(app)
            .get('/jobs/')
            .then(function (res) {
                return chai.request(app)
                    .delete(`/jobs/delete/${res.body[0].id}`)
            })
            .then(function (res) {
                res.should.have.status(204);
            });
    });
});