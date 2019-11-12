//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Product = require('../api/models/products');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

//Parent Block
describe('Products', () => {
  /*
  * Test the /GET route
  */
  describe('/GET products', () => {
      it('it should GET all the products', (done) => {
        chai.request(app)
            .get('/products')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.products.should.be.a('array');
                  res.body.products.length.should.be.eql(4);
              done();
            });
      });
  });

});