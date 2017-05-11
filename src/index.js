// @flow
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

const checkStatus = (response: Response): Response => {
  if (response.ok) {
    return response;
  }

  // Explicity typecast error instance to "any".
  // This way flow will not throw an error about the undefined property.
  const error: any = new Error(response.statusText);
  error.response = response;

  throw error;
};

const parseJson = (response: Response): Promise<*> => {
  return response.json();
};

export default (input: RequestInfo, init: RequestOptions = {}): Observable => {
  let headers = init.headers || new Headers();

  if (!(headers instanceof Headers)) {
    headers = new Headers(headers);
  }

  // Set correct accept header as default.
  headers.set('accept', 'application/json');

  if (typeof init.body === 'object' && init.body !== null) {
    headers.set('content-type', 'application/json');
    init.body = JSON.stringify(init.body);
  }

  return Observable.fromPromise(
    fetch(input, { ...init, headers }).then(checkStatus).then(parseJson)
  );
};
