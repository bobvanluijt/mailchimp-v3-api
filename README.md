# mailchimp-v3
[![NPM](https://img.shields.io/npm/v/mailchimp-v3.svg)](https://www.npmjs.com/package/mailchimp-v3)
[![Build Status](https://travis-ci.org/kubrickology/mailchimp-v3.svg)](https://travis-ci.org/kubrickology/mailchimp-v3)
Node module for Mailchimp API v3
For more information see: http://developer.mailchimp.com/documentation/mailchimp/

## Installation:
`npm install mailchimp-v3 --save`

## Usage:
_note: You need a nodejs or iojs version that supports ES6_

- First include the Mailchimp-v3 script and add the key.

```js
var MAILCHIMP_V3 = require('./mailchimp-v3.js');
var MAILCHIMP = new MAILCHIMP_V3({
  key: '[KEY]',       // mandatory, API key http://kb.mailchimp.com/accounts/management/about-api-keys
  debug: [boolean],   // optional, auto set to false
  location: [string]  // optional, one of Mailchimp locations: http://developer.mailchimp.com/status/ example: 'us12' 
});
```

- Next you can call all API references mentioned here: http://developer.mailchimp.com/documentation/mailchimp/reference/overview/

- You can include the method as function and the endpoint as first parameter and call a then() promise on the result

### .GET(endpoint)

All attributes that have GET methods attached can be called through the get(endpoint) function. Where the param is the endpoint. (endpoints overview: http://goo.gl/s0zf63)

_Note: Always include the complete path, like '/lists' or '/lists/{list_id}/interest-categories'_

Example:
```js
MAILCHIMP
	.get('/lists')
	.then(function(response){
		console.log(response);
	})
```
