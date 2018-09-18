const plg = require('pluga-plg');
const expect = require('chai').expect;
const action = require('../../lib/actions/upsert_organization');

const event = {
  meta: {
    baseURI: process.env.BASE_URI
  },
  auth: {
    api_token: process.env.TOKEN
  },
  input: {
    name: 'Organization 1',
    description: 'Organization 1'
  }
};

describe('Action: Upsert organization', () => {
  it('Should add an organization', function (done) {

    action.handle(plg, event)
      .then(res => {
        expect(res.statusText).to.eq('Created');
        done();
      })
      .catch(done);
  });
});