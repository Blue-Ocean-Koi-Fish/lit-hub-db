const axios = require('axios');

const url = 'http://gutendex.com/books';

function search(clientQuery) {
  let addQuery = '';
  if (clientQuery) {
    const queryKeys = Object.keys(clientQuery);

    queryKeys.forEach((element) => {
      addQuery += `${element}=${clientQuery[element]}&`;
    });
  }
  return axios.get(`${url}?${addQuery}`)
    .catch((err) => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

function getTxt(txtUrl) {
  console.log(txtUrl);
  return axios.get(txtUrl)
    .then((data) => {
      console.log(typeof data.data);
      console.log(data.data.indexOf('<body>'), data.data.indexOf('</body>'));
      let parsedData = data.data.slice(data.data.indexOf('<body>'), data.data.indexOf('</body>') + 7);

      // console.log(parsedData);
      // const dataResults = { data: data.data.slice(data.data.indexOf('<body>'), (data.data.indexOf('</body>') + 7)) };
      // const dataString = `${data.data}`;
      // console.log(data);
      return parsedData;
    })
    .catch((err) => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

module.exports = {
  search,
  getTxt,
};
