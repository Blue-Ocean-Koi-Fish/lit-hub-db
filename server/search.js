const axios = require('axios');

const url = 'http://gutendex.com/books';

function search(querys) {
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
  let newUrl;
  if (checkPostFix === 'zip') {
    newUrl = txtUrl.substr(0, (txtUrl.length - 3));
    newUrl += 'txt';
  } else {
    newUrl = txtUrl;
  }

  return axios.get(newUrl)
    .catch((err) => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

module.exports = {
  search,
  getTxt,
};
