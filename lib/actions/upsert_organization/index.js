exports.handle = function (plg, event) {

  const headers = { Authorization: `Token ${event.auth.api_token}` };
  const url = event.meta.baseURI + '/organizations/' + '/upsert';
  let data = event.input;

  return plg.axios({
    method: 'post',
    url: url,
    headers: headers,
    data: data,
  }).then((res) => res);
};