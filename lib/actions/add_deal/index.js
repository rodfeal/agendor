exports.handle = function (plg, event) {
  const headers = { Authorization: `Token ${event.auth.api_key}` };
  let organizationID = event.input.organization_id;
  const url = event.meta.baseURI + '/organizations/' + organizationID + '/deals';

  let data = event.input;

  return plg.axios({
    method: 'post',
    url: url,
    headers: headers,
    data: data
  }).then((res) => res);
};