/**
 * WS Request
 *
 * @description :: Build sails.js request object
 * @help        :: See http://example.com
 */

module.exports = function (sails) {

    var QueryString = require('querystring');


    return function (request, socket) {
        var queryStringPos = request['resource'].indexOf('?');
        var queryParams = queryStringPos === -1 ? {} : QueryString.parse(request['resource'].substr(queryStringPos + 1));

        return {
            transport: 'ws',

            method: request['action'].toUpperCase(),

            protocol: 'ws',

            port: sails.config.ws.port,

            url: request['resource'],

            socket: [socket],

            query: queryParams,

            body: request['body'] || {},

            param: function(paramName) {
                var key, params = {};

                for (key in (req.params || {}) ) {
                    if (req.params.hasOwnProperty(key))
                        params[key] = req.params[key];
                }

                for (key in (req.query || {}) ) {
                    if (req.query.hasOwnProperty(key))
                        params[key] = req.query[key];
                }

                for (key in (req.body || {}) ) {
                    if (req.query.hasOwnProperty(key))
                        params[key] = req.body[key];
                }

                return params[paramName];
            }

        };
    }
};
