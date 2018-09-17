exports.handle = function (plg, event) {
  let dealType = '';
  
  if(event.input.type === 'people'){
    dealType = ['people', 'person_id'];
  }
  else{
    dealType = ['organizations', 'organization_id'];
  }
  
  const headers = { Authorization: `Token ${event.auth.api_key}` };
  let id = event.input[dealType[1]];
  let data = event.input;
  const url = event.meta.baseURI + '/' + dealType[0] + '/' + id + '/deals';

  return plg.axios({
    method: 'get',
    url: `${event.meta.baseURI}/deals/`,
    headers: headers,
    params: {
      title: event.input.title
    }
  }).then((res) => { 
    if (res.data.meta.totalCount === 0) {
      return plg.axios({
        method: 'post',
        url: url,
        headers: headers,
        data: data
      });
    }
    else {
      return plg.axios({
        method: 'put',
        url: `${url}/${res.data.data[0].id}`,
        headers: headers,
        data: data
      });
    }
  });
};