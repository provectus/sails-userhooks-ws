/**
 * WS Response
 *
 * @description :: Build sails.js response object
 * @help        :: See http://example.com
 */

module.exports = function (sails) {
    return function (socket, server) {

        function makeResponseObject(code, body) {
            var struct = {
                status: code,
                body: body
            };
            var str = JSON.stringify(struct);
            if (str === null) {
                str = "{status: 500, body: {}}";
                sails.log.error('WS: Can not serialize response body: ' + body);
            }
            return str;
        }

        return {

            statusCode: null,

            charset: 'utf-8',

            status: function (code) {
                this.statusCode = code;
                return this;
            },

            send: function (data, code, sock) {
                var _code = code || this.code || 200,
                    _socket = sock || socket;
                _socket.send(makeResponseObject(_code, data), function (error) {
                    if (error === null) {
                        sails.log.error('WS: Error while sending response: ' + error);
                    }
                });
            },

            broadcast: function (data, code) {
                for (var i in server.clients) {
                    this.send(data, code, server.client[i]);
                }
            },

            json: function () {
                this.send.apply(this, arguments);
            },

            jsonp: function () {
                this.send.apply(this, arguments);
            }
        };

    }
};