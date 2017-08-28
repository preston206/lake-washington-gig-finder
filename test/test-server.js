const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
// const server = require('../server.js');

const { app } = require('../server')

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

    it('should test for 200s and html when getting job submit page', function () {
        return chai.request(app)
            .get('/submit')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });
});