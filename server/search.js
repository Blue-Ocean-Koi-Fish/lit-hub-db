const axios = require('axios');

const url = 'http://gutendex.com/books'

function search(querys) {
  let addQuery = '';
  if (querys) {
    let queryKeys = Object.keys(querys);

    queryKeys.forEach(element => {
      addQuery += `${element}=${querys[element]}&`
    });
  }
  return axios.get(`${url}?${addQuery}`)
  .catch(err => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

function getTxt(txtUrl = 'https://www.gutenberg.org/files/11/11-0.zip') {
  let checkPostFix = txtUrl.substr((txtUrl.length - 3));



  if (checkPostFix === 'zip') {
    txtUrl = txtUrl.substr(0, (txtUrl.length - 3));
    txtUrl += 'txt';
  } else {
    console.log('Check postfix : ', checkPostFix);
  }

  return axios.get(txtUrl)
  .catch(err => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

module.exports = {
  search,
  getTxt
}

// Start with creating a copy for each of the routes already created in gutendex
// Check what data is actually desired: Just the books, language, and ????
// Check what data is going to be saved in the database?
// Create routes for sending what books a person is currently reading
// Check out what is expected.

// When query's come in the default value should be blank
// Use map to go through each of the values.
// Test with node first