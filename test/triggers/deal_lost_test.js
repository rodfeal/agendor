const plg = require('pluga-plg');
const expect = require('chai').expect;
const trigger = require('../../lib/triggers/deal_lost');

describe('Trigger: deal lost', () => {
  it('test your trigger handle here', (done) => {
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
        expect(deal.dealStatus.id).to.eq(3);
      });
      done();
    }).catch(done);
  });
});
