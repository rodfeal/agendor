/**
 * Action handler
 *
 * @param {object} plg - Pluga developer platform toolbox.
 * @param {object} plg.axios - [axios](https://github.com/axios/axios)
 * @param {object} plg.moment - [moment](https://github.com/moment/moment)
 *
 * @param {object} event - Event bundle to handle.
 * @param {object} event.meta - Pluga event meta data.
 * @param {string} event.meta.baseURI - Environment base URI.
 * @param {object} event.auth - Your app.json auth fields.
 * @param {object} event.input - Your meta.json fields.
 *
 * @returns {Promise} Promise object represents an array of resources to handle.
 */

const getOrganizationId = (plg, event) => {
  return plg.axios({
    baseURL: event.meta.baseURI,
    url: '/organizations/upsert',
    method: 'POST',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    data: Object.assign({}, event.input.organization, {
      products: [event.input.organization.product_service].filter(id => id)
    })
  }).then(res => res.data.data.id);
}

const getPersonId = (plg, event, organizationId) => {
  return plg.axios({
    baseURL: event.meta.baseURI,
    url: '/people/upsert',
    method: 'POST',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    data: Object.assign({}, event.input.person, {
      organization: organizationId,
      products: [event.input.person.product_service].filter(id => id)
    })
  }).then(res => res.data.data.id);
}

const getDealId = (plg, event, organization_person_id) => {
  const params = {
    title: event.input.title,
    per_page: 100
  };
  params[event.input.organization_person] = organization_person_id;

  return plg.axios({
    baseURL: event.meta.baseURI,
    url: '/deals',
    method: 'GET',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    params: params
  }).then(res => (res.data.data.filter(d => d.title === event.input.title)[0] || {id: ''}).id);
}

exports.handle = async (plg, event) => {
  const organizationId = await getOrganizationId(plg, event);
  const personId = await getPersonId(plg, event, organizationId);
  const organization_person_id = eval(`${event.input.organization_person}Id`);
  const dealId = await getDealId(plg, event, organization_person_id);
  const path = event.input.organization_person.replace('person', 'people').replace('organization', 'organizations');
  const data = Object.assign({}, event.input, {
    products: [event.input.product_service].filter(id => id)
  });
  data[event.input.organization_person] = organization_person_id;

  return plg.axios({
    baseURL: event.meta.baseURI,
    url: `${path}/${organization_person_id}/deals/${dealId}`,
    method: dealId ? 'PUT' : 'POST',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    data: data
  }).then(res => res.data.data);
}
