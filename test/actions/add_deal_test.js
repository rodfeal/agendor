const plg = require('pluga-plg');
const expect = require('chai').expect;
const action = require('../../lib/actions/add_deal');

const timestamp = Date.now();
const title = `Deal Test-${timestamp}`;
const organizationName = `Org Test-${timestamp}`;
const organizationEmail = `org-${timestamp}@email.com`;
const personName = `Person Test-${timestamp}`;
const personEmail = `person-${timestamp}@email.com`;

const event = {
  meta:{
    baseURI: process.env.BASE_URI
  },
  auth: {
    token: process.env.TOKEN
  },
  input:{
    title: title,
    organization_person: 'organization',
    product_service: 322902,
    value: 1000,
    organization: {
      name: organizationName,
      product_service: 322903,
      contact: {
        email: organizationEmail
      }
    },
    person: {
      contact: {},
      address: {}
    }
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
