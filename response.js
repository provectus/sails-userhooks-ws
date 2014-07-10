/**
 * WS Response
 *
 * @description :: Build sails.js response object
 * @help        :: See http://example.com
 */

module.exports = function (sails) {
    return function (socket, server) {

        function makeResponseObject(code, action, resource, body) {
            var struct = {
                status: code,
                action: action,
                resource: resource,
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

            send: function (data, code, action, resource, sock) {
                var _code = code || this.code || 200,
                    _socket = sock || socket,
                    _action = action || 'GET',
                    _resource = resource || '/';
                _socket.send(makeResponseObject(_code, _action, _resource, data), function (error) {
                    if (error === null) {
                        sails.log.error('WS: Error while sending response: ' + error);
                    }
                });
            },

            broadcast: function (data, code, action, resource) {
                for (var i in server.clients) {
                    var args = [].concat.call([].slice.call(arguments, 0), server.clients[i]);
                    this.send.apply(this, args);
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
