import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromPromise';

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

const parseJson = response => {
  return response.json();
};

export default (url, options = {}) => {
  // Set correct accept header as default.
  options.headers = { ...options.headers, accept: 'application/json' };

  if (typeof options.body === 'object' && options.body !== null) {
    options.body = JSON.stringify(options.body);
    options.headers = {
      ...options.headers,
      'content-type': 'application/json',
    };
  }

  const response = fetch(url, options).then(checkStatus).then(parseJson);

  return Observable.fromPromise(response);
};
