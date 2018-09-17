const plg = require('pluga-plg');
const expect = require('chai').expect;
const action = require('../../lib/actions/add_deal');

describe('Action: Add deal', () => {
  it('Should add a deal', function (done) {
    const event = {
      meta:{
        baseURI: process.env.BASE_URI
      },
      auth: {
        api_key: process.env.TOKEN
      },
      input:{
        organization_id: 15022132,
        title: 'Deal Test'
      }
    };
    debugger
    action.handle(plg, event)
      .then((res) => {
        expect(res.status).to.eq(201);
        done();
      })
      .catch(done);
  });
});