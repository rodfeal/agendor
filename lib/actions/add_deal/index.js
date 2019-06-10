/**
 * Action handler
 *
 * @param {object} plg - Pluga developer platform toolbox.
 * @param {object} plg.axios - [axios](https://github.com/axios/axios)
 *
 * @param {object} event - Event bundle to handle.
 * @param {object} event.meta - Pluga event meta data.
 * @param {string} event.meta.baseURI - Environment base URI.
 * @param {object} event.auth - Your app.json auth fields.
 * @param {object} event.input - Your meta.json fields.
 *
 * @returns {Promise} Promise object represents an array of resources to handle.
 */

const compact = (obj) => {
  const res = {}
  Object.keys(obj).forEach(key => {
    if(!!obj[key]) res[key] = obj[key];
  });
  return res;
};

const getOrganizationId = (plg, event) => {
  const organization = event.input.organization;
  const values = [
    organization.name,
    organization.legalName,
    organization.cnpj,
    organization.ranking,
    organization.description,
    organization.ownerUser,
    organization.contact.email,
    organization.contact.work,
    organization.contact.mobile,
    organization.contact.fax,
    organization.contact.whatsapp,
    organization.contact.facebook,
    organization.contact.twitter,
    organization.contact.instagram,
    organization.contact.linked_in,
    organization.contact.skype,
    organization.address.postal_code,
    organization.address.country,
    organization.address.district,
    organization.address.state,
    organization.address.street_name,
    organization.address.street_number,
    organization.address.additional_info,
    organization.address.city,
    organization.leadOrigin,
    organization.category,
    organization.sector,
    organization.product_service
  ].filter(v => v);
  if (values.length === 0) return null;

  if ((organization.contact.work || '').length > 0){
    organization.contact.work = ('00000000000'+organization.contact.work.replace(/\D/g, '')).split('').reverse().slice(0, 11).reverse().join('');
  }
  if ((organization.contact.mobile || '').length > 0){
    organization.contact.mobile = ('00000000000'+organization.contact.mobile.replace(/\D/g, '')).split('').reverse().slice(0, 11).reverse().join('');
  }

  return plg.axios({
    baseURL: event.meta.baseURI,
    url: '/organizations/upsert',
    method: 'POST',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    data: Object.assign({}, organization, {
      products: [organization.product_service].filter(id => id)
    })
  }).then(res => res.data.data.id).catch((err) => {
    throw `Organization: ${err.response.data.errors.join(', ').toLowerCase()}`;
  });
};

const getPersonId = (plg, event, organizationId) => {
  const person = event.input.person;
  const values = [
    person.name,
    person.cpf,
    person.ranking,
    person.description,
    person.birthday,
    person.ownerUser,
    person.contact.email,
    person.contact.work,
    person.contact.mobile,
    person.contact.fax,
    person.contact.whatsapp,
    person.contact.facebook,
    person.contact.twitter,
    person.contact.instagram,
    person.contact.linked_in,
    person.contact.skype,
    person.address.postal_code,
    person.address.country,
    person.address.district,
    person.address.state,
    person.address.street_name,
    person.address.street_number,
    person.address.additional_info,
    person.address.city,
    person.leadOrigin,
    person.category,
    person.product_service
  ].filter(v => v);
  if (values.length === 0) return null;

  if ((person.contact.work || '').length > 0){
    person.contact.work = ('00000000000'+person.contact.work.replace(/\D/g, '')).split('').reverse().slice(0, 11).reverse().join('');
  }
  if ((person.contact.mobile || '').length > 0){
    person.contact.mobile = ('00000000000'+person.contact.mobile.replace(/\D/g, '')).split('').reverse().slice(0, 11).reverse().join('');
  }

  return plg.axios({
    baseURL: event.meta.baseURI,
    url: '/people/upsert',
    method: 'POST',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    data: Object.assign({}, person, {
      organization: organizationId,
      products: [person.product_service].filter(id => id)
    })
  }).then(res => res.data.data.id).catch((err) => {
    throw `Person: ${err.response.data.errors.join(', ').toLowerCase()}`;
  });
};

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
  }).then(res => (res.data.data.filter(d => d.title === event.input.title)[0] || { id: '' }).id).catch((err) => {
    throw `Deal: ${err.response.data.errors.join(', ').toLowerCase()}`;
  });
};

exports.handle = async (plg, event) => {
  event.input.organization.contact = compact(event.input.organization.contact)
  event.input.person.contact = compact(event.input.person.contact)

  const organizationId = await getOrganizationId(plg, event);
  const personId = await getPersonId(plg, event, organizationId);

  let path, organizationPersonId;

  if (event.input.organization_person === 'person') {
    path = '/people';
    organizationPersonId = personId;
  } else {
    path = '/organizations';
    organizationPersonId = organizationId;
  }

  const dealId = await getDealId(plg, event, organizationPersonId);

  const data = Object.assign({}, event.input, {
    products: [event.input.product_service].filter(id => id),
    organization: null,
    person: null
  });

  return plg.axios({
    baseURL: event.meta.baseURI,
    url: `${path}/${organizationPersonId}/deals/${dealId}`,
    method: dealId ? 'PUT' : 'POST',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    data: data
  }).then(res => res.data.data).catch((err) => {
    throw err.response.data.errors.join(', ').toLowerCase();
  });
};
