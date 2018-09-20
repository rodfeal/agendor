const plg = require('pluga-plg');
const expect = require('chai').expect;
const trigger = require('../../lib/triggers/deal_ongoing');

describe('Trigger: deal ongoing', () => {
  it('success', (done) => {
    const event = {
      meta: {
        baseURI: process.env.BASE_URI
      },
      auth: {
        token: process.env.TOKEN
      }
    };

    trigger.handle(plg, event).then((results) => {
      results.forEach((deal) => {

        expect(deal.dealStatus.id).to.eq(1);
      });

      done();
    }).catch(done);
  });
});
