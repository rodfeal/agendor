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

const getDealId = (plg, event) => {
  return plg.axios({
    baseURL: event.meta.baseURI,
    url: '/deals',
    method: 'GET',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    params: {
      title: event.input.title,
      person: event.input.person,
      per_page: 1000
    }
  }).then(res => (res.data.data.filter(d => d.title === event.input.title)[0] || {id: ''}).id);
}

exports.handle = async (plg, event) => {
  const dealId = await getDealId(plg, event);
  const person_organization = event.input.person;


  return plg.axios({
    baseURL: event.meta.baseURI,
    url: `${event.input.path}/${person_organization}/deals/${dealId}`,
    method: dealId ? 'PUT' : 'POST',
    headers: {
      Authorization: `Token ${event.auth.token}`,
    },
    params: event.input
  }).then(res => res.data.data);
}

// exports.handle = function (plg, event) {
//   let dealType = {};

//   if(event.input.type === 'people'){
//     dealType = {
//       url: 'people',
//       entity: 'person'
//     };
//   }
//   else{
//     dealType = {
//       url: 'organizations',
//       entity: 'organization'
//     };
//   }

//   const headers = { Authorization: `Token ${event.auth.api_key}` };
//   let data = event.input;
//   const url = event.meta.baseURI + '/' + dealType.url;

//   const upsertEntity = (plg, event) => {
//     return plg.axios({
//       method: 'post',
//       url: `${event.meta.baseURI}/${dealType.url}/upsert`,
//       headers: headers,
//       data: data[dealType.entity]
//     });
//   };

//   const createDeal = (plg, entity) => {
//     return plg.axios({
//       method: 'post',
//       url: `${url}/${entity.data.data.id}/deals`,
//       headers: headers,
//       data: data
//     });
//   };

//   const updateDeal = (plg, entity, deal) => {
//     return plg.axios({
//       method: 'put',
//       url: `${url}/${entity.data.data.id}/deals/${deal.data.data[0].id}`,
//       headers: headers,
//       data: data
//     })
//   };

//   const getDeal = (plg, event) => {
//     return plg.axios({
//       method: 'get',
//       url: `${event.meta.baseURI}/deals/`,
//       headers: headers,
//       params: {
//         title: event.input.title
//       }
//     });
//   };

//   return upsertEntity(plg, event)
//     .then((entity) => {
//       return getDeal(plg, event)
//       .then(deal => {
//         if (deal.data.meta.totalCount === 0){
//           return createDeal(plg, entity);
//         }
//         else {
//           return updateDeal(plg, entity, deal);
//         }
//       })
//     })
//     .catch( err => {
//       console.log(err);
//     });



//   /* return plg.axios({
//     method: 'get',
//     url: `${event.meta.baseURI}/deals/`,
//     headers: headers,
//     params: {
//       title: event.input.title
//     }
//   }).then((res) => {
//     if (res.data.meta.totalCount === 0) {
//       upsertEntity(plg, event)
//         .then(() => {
//           delete event.input[dealType.entity];
//           console.log(event);
//           return plg.axios({
//             method: 'post',
//             url: url,
//             headers: headers,
//             data: data
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//     else {
//       upsertEntity(plg, event)
//         .then(() => {
//           console.log('Segunda promise');
//         })
//         .catch( () => {
//           console.log('Erro na segunda promisse');
//         });
//     }
//   }); */
// };