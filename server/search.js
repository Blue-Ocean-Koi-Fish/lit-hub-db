const axios = require('axios');

const url = 'http://gutendex.com/books';

function search(querys) {
  console.log(querys);
  let addQuery = '';
  if (querys) {
    const queryKeys = Object.keys(querys);

    queryKeys.forEach((element) => {
      addQuery += `${element}=${querys[element]}&`;
    });
  }
  return axios.get(`${url}?${addQuery}`)
    .catch((err) => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

function getTxt(txtUrl = 'https://www.gutenberg.org/files/11/11-0.zip') {
  const checkPostFix = txtUrl.substr((txtUrl.length - 3));
  let newUrl = txtUrl;
  let isHTML = false;

  if (checkPostFix === 'zip') {
    newUrl = txtUrl.substr(0, (txtUrl.length - 3));
    newUrl += 'txt';
  } else if (checkPostFix === 'htm') {
    isHTML = true;
  }

  return axios.get(newUrl)
    .then((data) => {
      const dataResults = data;
      if (isHTML) {
        let deleteIndex = dataResults.data.indexOf('<body>');
        dataResults.data = dataResults.data.slice(deleteIndex);
        deleteIndex = dataResults.data.indexOf('</body>');
        dataResults.data = dataResults.data.slice(0, (deleteIndex + 7));
      }
      return dataResults;
    })
    .catch((err) => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

module.exports = {
  search,
  getTxt,
};
