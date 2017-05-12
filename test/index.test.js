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

describe('observable-fetch', () => {
  let request;

  beforeEach(() => {
    window.fetch = jest.fn();
  });

  it('should return a parsed JSON response', async () => {
    expect.assertions(3);

    window.fetch.mockReturnValue(
      Promise.resolve(createResponse(200, 'OK', '{"foo": "bar"}'))
    );

    const result = await fetch('http://example.com/foo').toPromise();

    expect(result).toEqual({ foo: 'bar' });

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith('http://example.com/foo', {
      headers: new Headers({ accept: 'application/json' }),
    });
  });

  it('should return nothing when response contains no content', async () => {
    expect.assertions(3);

    window.fetch.mockReturnValue(Promise.resolve(createResponse(204, 'OK')));

    const result = await fetch('http://example.com/foo').toPromise();

    expect(result).toEqual(null);

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith('http://example.com/foo', {
      headers: new Headers({ accept: 'application/json' }),
    });
  });

  it('should send a JSON encoded body with correct headers.', async () => {
    expect.assertions(2);

    window.fetch.mockReturnValue(
      Promise.resolve(createResponse(200, 'OK', '{}'))
    );

    await fetch('http://example.com/foo', { body: { foo: 'bar' } });

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith('http://example.com/foo', {
      body: '{"foo":"bar"}',
      headers: new Headers({
        accept: 'application/json',
        'content-type': 'application/json',
      }),
    });
  });

  it('should append required headers to given headers.', async () => {
    expect.assertions(2);

    window.fetch.mockReturnValue(
      Promise.resolve(createResponse(200, 'OK', '{}'))
    );

    await fetch('http://example.com/foo', {
      body: { foo: 'bar' },
      headers: new Headers({ foo: 'bar' }),
    }).toPromise();

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith('http://example.com/foo', {
      body: '{"foo":"bar"}',
      headers: new Headers({
        accept: 'application/json',
        'content-type': 'application/json',
        foo: 'bar',
      }),
    });
  });

  it('should not overwrite given headers with default headers.', async () => {
    expect.assertions(2);

    window.fetch.mockReturnValue(
      Promise.resolve(createResponse(200, 'OK', '{}'))
    );

    await fetch('http://example.com/foo', {
      body: { foo: 'bar' },
      headers: new Headers({
        accept: 'text/html',
        'content-type': 'text/plain',
      }),
    }).toPromise();

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith('http://example.com/foo', {
      body: '{"foo":"bar"}',
      headers: new Headers({
        accept: 'text/html',
        'content-type': 'text/plain',
      }),
    });
  });

  it('should accept headers as plain object.', async () => {
    expect.assertions(2);

    window.fetch.mockReturnValue(
      Promise.resolve(createResponse(200, 'OK', '{}'))
    );

    await fetch('http://example.com/foo', {
      body: { foo: 'bar' },
      headers: { accept: 'text/html', 'content-type': 'text/plain' },
    }).toPromise();

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith('http://example.com/foo', {
      body: '{"foo":"bar"}',
      headers: new Headers({
        accept: 'text/html',
        'content-type': 'text/plain',
      }),
    });
  });

  it('should thrown an error on non successful responses', async () => {
    expect.assertions(4);

    const response = createResponse(
      401,
      'Unauthorized',
      '{ "error": "Unauthorized" }'
    );

    window.fetch.mockReturnValue(Promise.resolve(response));

    try {
      await fetch('http://example.com/foo').toPromise();
    } catch (error) {
      expect(error.message).toBe('Unauthorized');
      expect(error.response).toBe(response);

      expect(window.fetch).toHaveBeenCalledTimes(1);
      expect(window.fetch).toHaveBeenCalledWith('http://example.com/foo', {
        headers: new Headers({ accept: 'application/json' }),
      });
    }
  });
});
