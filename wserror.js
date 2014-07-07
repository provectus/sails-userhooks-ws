"use strict";
function WSError (code, message) {
    this.name = 'WSError';
    this.message = message;
    this.code = code;
}

WSError.prototype = new Error();
WSError.prototype.constructor = WSError;

module.exports = WSError;