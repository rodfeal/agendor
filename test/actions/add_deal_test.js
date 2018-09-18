const plg = require('pluga-plg');
const expect = require('chai').expect;
const action = require('../../lib/actions/add_deal');

const title = `Deal Test-${Date.now()}`;
const event = {
  meta:{
    baseURI: process.env.BASE_URI
  },
  auth: {
    api_key: process.env.TOKEN
  },
  input:{
    title: title,
    type: 'organization',
    organization: {
      name: 'Organization 2',
      description: 'Organization 1'
    }
  }
};

describe('Action: Add deal', () => {
  it('Should add a deal', function (done) {

    action.handle(plg, event)
      .then(res => {
        expect(res.statusText).to.eq('Created');
        done();
      })
      .catch(done);
  });

  it('Should update a deal', function (done) {
    action.handle(plg, event)
      .then(res => {
        expect(res.statusText).to.eq('OK');
        done();
      })
      .catch(done);
  });
});