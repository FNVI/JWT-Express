process.env.NODE_ENV = 'test';
process.env.secret = "secretstring";

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../test-server');
let jwt = require('jsonwebtoken');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('no middleware config', ()=>{

    it('should issue token via header', done =>{
        chai.request(server)
        .get('/noMiddleware/issue')
        .end((err,res)=>{
            res.should.have.header('X-Access-Token');
            let decoded = jwt.verify(res.header['x-access-token'],process.env.secret);
            expect(decoded).to.be.an('object');
            expect(decoded).to.have.property('iat');
            expect(decoded).to.have.property('exp');
            expect(decoded).to.have.property('dummy',"payload");
            expect(decoded.exp - decoded.iat).to.equal(60);
            done();
        });
    });

    it('should verify allowed token', done =>{
        chai.request(server)
        .get('/noMiddleware/verify')
        .set('X-Access-Token',jwt.sign({},process.env.secret))
        .end((err,res)=>{
            res.should.have.status(204);
            done();
        });
    });

    it('should not allow no token', done =>{
        chai.request(server)
        .get('/noMiddleware/verify')
        .end((err,res)=>{
            res.should.have.status(403);
            done();
        });
    });

    it('should not allow invalid token', done =>{
        chai.request(server)
        .get('/noMiddleware/verify')
        .set('X-Access-Token',jwt.sign({},process.env.secret+"1"))
        .end((err,res)=>{
            res.should.have.status(401);
            done();
        });
    });
});

describe('custom middleware config', ()=>{

    it('should issue header', done =>{
        chai.request(server)
        .get('/noMiddleware/issue')
        .end((err,res)=>{
            res.should.have.header('X-Access-Token');
            let decoded = jwt.verify(res.header['x-access-token'],process.env.secret);
            expect(decoded).to.be.an('object');
            expect(decoded).to.have.property('iat');
            expect(decoded).to.have.property('exp');
            expect(decoded).to.have.property('dummy',"payload");
            expect(decoded.exp - decoded.iat).to.equal(60);
            done();
        });
    });

    it('should verify allowed token', done =>{
        chai.request(server)
        .get('/noMiddleware/verify')
        .set('X-Access-Token',jwt.sign({},process.env.secret))
        .end((err,res)=>{
            res.should.have.status(204);
            done();
        });
    });

    it('should not allow no token', done =>{
        chai.request(server)
        .get('/noMiddleware/verify')
        .end((err,res)=>{
            res.should.have.status(403);
            done();
        });
    });

    it('should not allow invalid token', done =>{
        chai.request(server)
        .get('/noMiddleware/verify')
        .set('X-Access-Token',jwt.sign({},process.env.secret+"1"))
        .end((err,res)=>{
            res.should.have.status(401);
            done();
        });
    });
});