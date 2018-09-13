/**
 * Trigger handler
 *
 * @param {object} plg - Pluga developer platform toolbox.
 * @param {object} plg.axios - [axios](https://github.com/axios/axios)
 * @param {object} plg.moment - [moment](https://github.com/moment/moment)
 *
 * @param {object} event - Event bundle to handle.
 * @param {object} event.meta - Pluga event meta data.
 * @param {string} event.meta.baseURI - Environment base URI.
 * @param {number} event.meta.lastReqAt - Last task handle timestamp.
 * @param {object} event.auth - Your app.json auth fields.
 * @param {object} event.input - Your meta.json fields.
 *
 * @returns {Promise} Promise object represents an array of resources to handle.
 */
const organization = (plg, event, organization) => {
  if (organization) {
    return plg.axios({
      baseURL: event.meta.baseURI,
      url: `/organizations/${organization.id}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${event.auth.token}`,
      }
    }).then((res) => {
      const organization = res.data.data;
      organization.product_names = organization.products.map(p => p.name).join(', ');
      organization.person_names_emails = organization.people.map(p => `${p.name} - ${p.email}`).join(', ');
      return organization;
    });
  }
  return null;
}

const person = (plg, event, person) => {
  if (person) {
    return plg.axios({
      baseURL: event.meta.baseURI,
      url: `/people/${person.id}`,
      method: 'GET',
      headers: {
        Authorization: `Token ${event.auth.token}`,
      }
    }).then((res) => {
      const person = res.data.data;
      person.product_names = person.products.map(p => p.name).join(', ');
      person.birthday = person.birthday ? person.birthday.substr(5).split('-').reverse().join('/') : null;
      return person;
    });
  }
  return null;
}

exports.handle = (plg, event) => {
  return plg.axios({
    baseURL: event.meta.baseURI,
    url: '/deals',
    method: 'GET',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    params: {
      per_page: 1000,
      dealStatus: 2
    }
  }).then(async (res) => {
    for (const deal of res.data.data) {
      deal.organization = await organization(plg, event, deal.organization);
      deal.person = await person(plg, event, deal.person);
      deal.product_names = deal.products.map(p => p.name).join(', ');
    }
    return res.data.data;
  });
};
