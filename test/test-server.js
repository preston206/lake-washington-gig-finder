const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
// const server = require('../server.js');

const { app } = require('../server')

chai.use(chaiHttp);

describe('server', function () {
    it('should test for 200s and html', function () {
        return chai.request(app)
            .get('/')
            .then(function (response) {
                response.should.have.status(200);
                response.should.be.html;
            });
    });
});