/**
 * WS Connection
 *
 * @description :: Connection handler for WS Hook
 * @help        :: See http://example.com
 */
"use strict";
module.exports = function (sails) {

    var _ = require('lodash'),
        WSError = require('./wserror'),
        buildResponse = require('./response')(sails),
        buildRequest = require('./request')(sails);

    var ACTION = 'action',
        RESOURCE = 'resource',
        METHODS = ['get', 'post', 'put', 'delete'];

    function parseRequest(message) {
        try {
            return JSON.parse(message);
        } catch (e) {
            throw new WSError(400, "Cannot parse request: " + message);
        }
    }

    function checkRequest(request) {
        if (!_.isObject(request)) {
            throw new WSError(400, "Request is not object: " + JSON.stringify(request));
        }

        if (!(ACTION in request && _.isString(request[ACTION]))) {
            throw new WSError(400, "Bad scheme action: " +  JSON.stringify(request));
        }
        if (!(RESOURCE in request && _.isString(request[RESOURCE]))) {
            throw new WSError(400, "Bad scheme resource: " +  JSON.stringify(request));
        }

        if (METHODS.indexOf(request[ACTION]) === -1) {
            throw new WSError(400, "Unknown action: " + JSON.stringify(request));
        }
    }

    return function (socket, server) {
        socket.on('message', function (message) {
            var object;
            var response = buildResponse(socket, server);
            try {
                object = parseRequest(message);
                checkRequest(object);

                var request = buildRequest(object, socket);

                sails.emit('router:request', request, response);
            } catch (e) {
                if (e.name === 'WSError') {
                    response.send({message: e.message}, e.code);
                } else {
                    sails.log.error(e.message);
                }
            }

        });
    }
};