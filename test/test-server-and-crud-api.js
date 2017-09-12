const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
// const server = require('../server.js');

const { app } = require('../server');

chai.use(chaiHttp);

describe('server', function () {
    it('should test for 200s and html when getting root', function () {
        return chai.request(app)
            .get('/')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });

    it('should test for 200s and html when getting job search page', function () {
        return chai.request(app)
            .get('/find')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });

    it('should test for 200s and html when getting job post page', function () {
        return chai.request(app)
            .get('/post')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });

    it('should test for 200s and html when getting job edit page', function () {
        return chai.request(app)
            .get('/edit')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });
});

describe('Jobs API', function () {
    it('should list jobs on GET', function () {
        return chai.request(app)
            .get('/jobs')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.length.should.be.at.least(1);
                
                const expectedKeys = ['id', 'company', 'title', 'technologies'];
                response.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

    it('should create a job on POST', function () {
        const newJob = {
            company: "Blockbuster Code",
            title: "Engineer",
            technologies: "XML"
        };

        return chai.request(app)
            .post('/jobs')
            .send(newJob)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys(
                    'id', 'company', 'title', 'technologies'
                );
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(
                    Object.assign(newJob, { id: res.body.id })
                );
            });
    });

    it('should modify a job on PUT', function () {
        const updateData = {
            company: "ZombieCode",
            title: "Devs",
            technologies: "XML"
        };

        return chai.request(app)
            .get('/jobs')
            .then(function (res) {
                updateData.id = res.body[0].id;

                return chai.request(app)
                    .put(`/jobs/${updateData.id}`)
                    .send(updateData)
            })
            .then(function (res) {
                res.should.have.status(204);
                // res.should.be.json;
                // res.body.should.be.a('object');
                // res.body.should.deep.equal(updateData);
            });
    });

    it('should delete a job on DELETE', function () {
        return chai.request(app)
            .get('/jobs')
            .then(function (res) {
                return chai.request(app)
                    .delete(`/jobs/${res.body[0].id}`)
            })
            .then(function (res) {
                res.should.have.status(204);
            });
    });
});