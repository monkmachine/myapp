var https = require('https');
var toke = 'ya29.GlzdBX-EDff0WhvPmwoWFeii0Hum2eFea7tw_1gaqu4sirvDUbNOLqTzegKVatWOqDZGQ_upwlkUoTNOHzuDNut8Vb9NeIdZx9Nie8_ksWHTxM3lUoyqXypCuJR98g';
var express = require('express');
var request = require('request-promise');

function isAuth( reqToken, body ) {
    reqToken.replace('Bearer ',''); 
    var qualurl = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + reqToken;
   // console.log(qualurl   );
    var options = {
        method: 'GET',
        url: qualurl
    };
    
    request(options, function (error, callback, body) {
        if (error) throw new Error(error);
  //      console.log(options);
        var googleEmail = body.email;
        return callback;
    })
   console.log(callback);
};

module.exports = isAuth;