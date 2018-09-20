const plg = require('pluga-plg');
const expect = require('chai').expect;
const action = require('../../lib/actions/add_deal');

const title = `Deal Test-${Date.now()}`;
const event = {
  meta:{
    baseURI: process.env.BASE_URI
  },
  auth: {
    token: process.env.TOKEN
  },
  input:{
    title: title,
    path: 'people',
    person: 21270854
  }
};

describe('Action: Add deal', () => {
  it('Should add a deal', function (done) {
    action.handle(plg, event).then(result => {
      expect(result).to.include({
        title: title
      });

      done();
    }).catch(done);
  });

  it('Should update a deal', function (done) {
    action.handle(plg, event).then(result => {
      expect(result).to.include({
        title: title
      });

      done();
    }).catch(done);
  });
});
