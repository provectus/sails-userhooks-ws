/**
 * WS hook
 *
 * @description :: WS support for sails.js
 * @help        :: See http://example.com
 */


"use strict";
module.exports = function (sails) {

    /**
     * Module dependencies
     */

    var WebSocketServer = require('ws').Server,
        connection = require('./connection')(sails);

    /**
     * Expose `ws` hook definition
     */
    return {
        // sails.config.ws default values
        defaults: {
            ws: {
                // port for ws://
                port: 9090,

                // connection open callback
                onConnect: function (ws) { /* override me */ },

                // connection close callback
                onDisconnect: function (ws) { /* override me */ }
            }
        },

        /**
         * Pre-initialize configuration
         *
         * @api public
         */
        configure: function () {
            //TODO: some configurations
        },

        /**
         * Create WS-server
         *
         * @api public
         * @param {function} callback
         */
        initialize: function (callback) {
            sails.log.info('WS::Starting WS server on port ' + sails.config.ws.port);

            var server = new WebSocketServer({
                port: sails.config.ws.port
            });

            server.on('connection', function (socket) {
                sails.log.debug('WS::Connection opened');
                sails.config.ws.onConnect(socket);
                connection(socket, server);

                socket.on('close', function (code, message) {
                    sails.config.ws.onDisconnect(socket, code, message);
                    sails.log.debug('WS::Connection closed');
                });
            });

            callback && callback();
        }
    };
};
