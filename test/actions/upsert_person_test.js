const plg = require('pluga-plg');
const expect = require('chai').expect;
const action = require('../../lib/actions/upsert_person');

const event = {
  meta: {
    baseURI: process.env.BASE_URI
  },
  auth: {
    api_token: process.env.TOKEN
  },
  input: {
    name: 'Pessoa 123',
    contact: {email: 'pluga@mail.com'}
  }
};

describe('Upsert: person', () => {
  it('Should upsert a person', function (done) {

    action.handle(plg, event)
      .then( res => {
        expect(res.statusText).to.eq('Created');
        done();
      })
      .catch(done);
  });
});