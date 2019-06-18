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
        email: organizationEmail,
        mobile: '21999998888'
      },
      address: {}
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

  it('Should returns error when contact.worker greater than 10', function (done) {

    event.input.organization.contact.work = '(11) 1234-56789';

    action.handle(plg, event).catch(err => {
      expect(err.message).to.eq('O número de telefone (contact[work]) deve conter no máximo 10 dígitos');
      done();
    }).catch(done);
  });
});
