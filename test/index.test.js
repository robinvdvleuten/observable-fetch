import 'whatwg-fetch';
import fetch from '../src';
import 'rxjs/add/operator/toPromise';

const createResponse = (status, statusText, response) =>
  new window.Response(response, {
    status,
    statusText,
    headers: {
      'content-type': 'application/json',
    },
  });

describe('request', () => {
  let request;

  beforeEach(() => {
    window.fetch = jest.fn();
  });

  it('should return a parsed JSON response', () => {
    expect.assertions(2);

    window.fetch.mockReturnValue(
      Promise.resolve(createResponse(200, 'OK', '{"foo": "bar"}'))
    );

    return fetch('http://example.com/foo').toPromise().then(result => {
      expect(result).toEqual({ foo: 'bar' });
      expect(window.fetch.mock.calls).toEqual([
        [
          'http://example.com/foo',
          { headers: new Headers({ accept: 'application/json' }) },
        ],
      ]);
    });
  });

  it('should send a JSON encoded body with correct headers.', () => {
    expect.assertions(1);

    window.fetch.mockReturnValue(
      Promise.resolve(createResponse(200, 'OK', '{}'))
    );

    return fetch('http://example.com/foo', { body: { foo: 'bar' } })
      .toPromise()
      .then(result => {
        expect(window.fetch.mock.calls).toEqual([
          [
            'http://example.com/foo',
            {
              body: '{"foo":"bar"}',
              headers: new Headers({
                accept: 'application/json',
                'content-type': 'application/json',
              }),
            },
          ],
        ]);
      });
  });

  it('should thrown an error on non successful responses', () => {
    expect.assertions(3);

    const response = createResponse(
      401,
      'Unauthorized',
      '{ "error": "Unauthorized" }'
    );
    window.fetch.mockReturnValue(Promise.resolve(response));

    return fetch('http://example.com/foo').toPromise().catch(error => {
      expect(error.message).toEqual('Unauthorized');
      expect(error.response).toEqual(response);
      expect(window.fetch.mock.calls).toEqual([
        [
          'http://example.com/foo',
          { headers: new Headers({ accept: 'application/json' }) },
        ],
      ]);
    });
  });
});
