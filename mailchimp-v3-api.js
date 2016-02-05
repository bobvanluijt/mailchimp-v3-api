'use strict';
/**
 * Mailchimps API V3 integration 
 */
var HTTPS 		= require('https'),
	Q 		= require('q'),
	STRINGDECODER 	= require('string_decoder').StringDecoder,
	DECODER 	= new STRINGDECODER('utf8');

/**
 * The Mailchimp v3 API integration for nodejs
 * Detailed information can be found in the readme.md file
 * 
 * @author      Bob van Luijt
 * @version     0.1
 */
class MailChimpV3 {
    
   	/**
	 * Constructor function
	 *
	 * @param {string} 	i Object with key and optional host information
	 */
    constructor(i) {
    	/**
    	 * Report error when key is not set, otherwise set key to this.key
    	 */
    	if(typeof i.key === 'undefined'){
    		console.warn('WARN: Key is undefined, add your API KEY');
    	} else {
	    	this.key = key;
	    }
	    /**
    	 * Check if custom server location is set, if not, set to 12
    	 */
    	if(typeof i.location === 'undefined'){
    		this.location = 'us12';
    	} else {
	    	this.location = i.location;
	    }
	    /**
    	 * Check if debug is set, if not, set to false
    	 */
    	if(typeof i.debug === 'undefined'){
    		this.debug = false;
    	} else {
	    	this.debug = true;
	    }
    }

	/**
	 * Connect()
	 * Makes an https connection to the Mailchimp server
	 *
	 * @param {string}	endpoint Based on http://goo.gl/hAZnhM
	 * @param {string}	method Method set for request type
	 * @return {Object}	returns the promises then() and error()
	 */
    connect(endpoint, method){
    	/**
    	 * Using Q for promises
    	 */
    	var deferred = Q.defer();
    	/**
    	 * Set request options
    	 */
    	var options = {
    		headers: {
    			'Content-Type': 'application/json'
    		},
    		auth: 'anystring:' + this.key,
			hostname: this.location + '.api.mailchimp.com',
			port: 443,
			path: '/3.0/Lists',
			method: method
		}
		/**
		 * Do the actual request, console.logs if debug === true
		 */
		var req = HTTPS.request(options, (res) => {
		  	if(this.debug === true){
		  		console.log('statusCode: ', res.statusCode);
		  		console.log('headers: ', res.headers);
			}
			res.on('data', (d) => {
				/**
				 * Sending the response as a deffer
				 */
				deferred.resolve(DECODER.write(d));
			});
		});
		req.end();
		/**
		 * Send error promise if error occured
		 */
		req.on('error', (e) => {
			deferred.reject(new Error(e));
		});
		/**
		 * Return the promise
		 */
		return deferred.promise;
    }

	/**
	 * Get()
	 * Used for all GET related calls
	 *
	 * @param {endpoint}	endpoint Based on http://goo.gl/hAZnhM
	 * @return {Object}		returns the promises then() and error()
	 */
    get(endpoint){
    	/**
    	 * Using Q for promises
    	 */
    	var deferred = Q.defer();
    	/**
    	 * Do the request and prepare promise
    	 */
    	this
	    	.connect(endpoint, 'GET')
	    	.then(function(d){
	    		deferred.resolve(d);
	    	})
	    	.error(function(e){
	    		console.error('OOPS ' + e);
	    	});
    	return deferred.promise;
    }

    post(endpoint){

    }

    patch(endpoint){

    }

    put(endpoint){

    }

    delete(endpoint){

    }

}

/**
 * Return the module
 */
module.exports = MailChimpV3;
