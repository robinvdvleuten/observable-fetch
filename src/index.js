// @flow
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

export class FetchError extends Error {
  response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

const checkStatus = (response: Response): Response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new FetchError(response);
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
