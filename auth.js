var https = require('https');
var toke = 'ya29.GlzdBX-EDff0WhvPmwoWFeii0Hum2eFea7tw_1gaqu4sirvDUbNOLqTzegKVatWOqDZGQ_upwlkUoTNOHzuDNut8Vb9NeIdZx9Nie8_ksWHTxM3lUoyqXypCuJR98g';
var express = require('express');
var request = require('request');

function isAuth(reqToken, callback) {
    var qualurl = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + reqToken;
    var options = { method: 'GET', url: qualurl };

    request(options, function (error, response, body) {
        if (error) {
            callback(error);
        }

        callback(null, body.email);
    })
};

module.exports = isAuth;