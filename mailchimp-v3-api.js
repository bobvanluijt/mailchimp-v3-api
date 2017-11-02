'use strict';
/**
 * Mailchimps API V3 integration 
 */
var HTTPS             = require('https'),
    Q                 = require('q'),
    STRINGDECODER     = require('string_decoder').StringDecoder,
    DECODER           = new STRINGDECODER('utf8');

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
     * @param {string}     i Object with key and optional host information
     */
    constructor(i) {
        /**
         * Report error when key is not set, otherwise set key to this.key
         */
        if(typeof i.key === 'undefined'){
            console.warn('WARN: Key is undefined, add your API KEY');
        } else {
            this.key = i.key;
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
        if(typeof i.debug === 'boolean'){
            this.debug = false;
        } else {
            this.debug = true;
        }
    }

    /**
     * Connect()
     * Makes an https connection to the Mailchimp server
     *
     * @param {string}    endpoint Based on http://goo.gl/hAZnhM
     * @param {string}    method Method set for request type
     * @return {Object}    returns the promises then() and error()
     */
    connect(endpoint, method, data){

        var decodedData = JSON.stringify(data);

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
            path: '/3.0' + endpoint,
            method: method
        };

        /**
         * If data is set, add to POST
         */
        if(typeof data !== 'undefined'){
            options['headers'] = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(decodedData)
            };
        } else {
            if(this.debug === true){
                console.log('** No data is set (sometimes this is ok, for example with a GET request)');
            }
        }

        /**
         * Do the actual request, console.logs if debug === true
         */
        var resRaw = [];
        var req = HTTPS.request(options, (res) => {

              if(this.debug === true){
                  console.log('** statusCode: ', res.statusCode);
                  console.log('** headers: ', res.headers);
                  console.log('** response: ' + res);
            }
            res.on('data', (d) => {
                resRaw.push(DECODER.write(d));
            });

            res.on('end', () => {
               /**
                * Sending the response as a deffer
                */
                if(resRaw[0] !== undefined && resRaw[0] !== null){
	                var jsonRes = JSON.parse(resRaw.join(''));
	                deferred.resolve(jsonRes);
	            }
            });

        });

        /**
         * If data is set, add to POST or PATCH or PUT
         */
        if(method === 'POST' || method === 'PATCH' || method === 'PUT'){
            req.write(decodedData);
        }

        /**
         * Send error promise if error occured
         */
        req.on('error', (e) => {
            if(this.debug === true){
                console.error('ERROR: ' + e);
            }
            deferred.reject(e);
        });

        req.end();

        /**
         * Return the promise
         */
        return deferred.promise;
    }

    /**
     * Get()
     * Used for all GET related calls
     *
     * @param {endpoint}    endpoint Based on http://goo.gl/hAZnhM
     * @return {Object}        returns the promises then() and error()
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
            .then(d => {
                deferred.resolve(d);
            });
        return deferred.promise;
    }

    post(endpoint, data){
        /**
         * Using Q for promises
         */
        var deferred = Q.defer();

        /**
         * Do the request and prepare promise
         */
        this
            .connect(endpoint, 'POST', data)
            .then(d => {
                deferred.resolve(d);
            });
        return deferred.promise;
    }

    patch(endpoint, data){
        /**
         * Using Q for promises
         */
        var deferred = Q.defer();

        /**
         * Do the request and prepare promise
         */
        this
            .connect(endpoint, 'PATCH', data)
            .then(d => {
                deferred.resolve(d);
            });
        return deferred.promise;
    }

    put(endpoint, data){
        /**
         * Using Q for promises
         */
        var deferred = Q.defer();
        /**
         * Do the request and prepare promise
         */
        this
            .connect(endpoint, 'PUT', data)
            .then(d => {
                deferred.resolve(d);
            });
        return deferred.promise;
    }

    delete(endpoint){
        /**
         * Using Q for promises
         */
        var deferred = Q.defer();
        /**
         * Do the request and prepare promise
         */
        this
            .connect(endpoint, 'DELETE')
            .then(d => {
                deferred.resolve(d);
            });
        return deferred.promise;
    }

}

/**
 * Return the module
 */
module.exports = MailChimpV3;
