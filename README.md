# observable-fetch

[RxJS](http://github.com/ReactiveX/RxJS) Observable wrapped around the WHATWG [Fetch](https://fetch.spec.whatwg.org/) API.

[![Build Status](https://travis-ci.org/robinvdvleuten/observable-fetch.svg?branch=master)](https://travis-ci.org/robinvdvleuten/observable-fetch)

## Installation

```
$ yarn add observable-fetch
```

Alternatively using npm:

```
$ npm i observable-fetch --save
```

## Usage

This library is especially built to be complementary to [redux-observable](https://redux-observable.js.org/);

```js
import fetch from 'observable-fetch';

// action creators
const fetchUser = username => ({ type: FETCH_USER, payload: username });
const fetchUserFulfilled = payload => ({ type: FETCH_USER_FULFILLED, payload });

// epic
const fetchUserEpic = action$ =>
  action$.ofType(FETCH_USER)
    .mergeMap(action =>
      fetch(`https://api.github.com/users/${action.payload}`)
        .map(response => fetchUserFulfilled(response))
    );

// later...
dispatch(fetchUser('torvalds'));
```

## License

MIT © [Robin van der Vleuten](https://www.robinvdvleuten.nl)
