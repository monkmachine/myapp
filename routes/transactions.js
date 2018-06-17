var express = require('express');
var router = express.Router();
var getConnection = require('../db/mysql');
var app = express();
const uuidv4 = require('uuid/v4');
const parseJson = require('parse-json');



/* GET transactions listing. */
router.get('/', function (req, res, next) {
    getConnection(function (err, con) {
        googleEmail = 'danC1';
        que = 'CALL elepig.getUser(?, @p_userJSON);';
        con.query(que, [googleEmail], function (err, results) {
            if (err) throw err;
            else
                con.release();
            console.log('>> results: ', results);
            var datapackstr = JSON.stringify(results[0]);
            console.log('>> datapackstr: ', datapackstr);
            if (datapackstr == '[{"@p_userJSON":null}]') { res.send('') }
            else {
                var datapack = JSON.parse(JSON.parse(datapackstr.substring((datapackstr.lastIndexOf('@p_userJSON') + 12) + 1).slice(0, -2)));
                res.json(datapack)
            };
        });
    });


});


/* GET users listing. */

router.post('/', function (req, res, next) {
    getConnection(function (err, con) {
        var guid = 'E';
      //  var guid = guid.replace(/-/g,"");
        var p_userJSON = JSON.stringify(req.body);
        var p_googleEmail = 'DanC@Gmail.com';
        var p_ipCountry = 'UK';
        console.log('req', p_userJSON);
        console.log('req', guid);
        // parameters are p_userJSON, p_googleEmail, p_ipCountry, p_eventId
        que = 'CALL elepig.createUser(\'' + p_userJSON + '\',\'' + p_googleEmail + '\',\'' + p_ipCountry + '\',\'' + guid + '\', @p_return_text, @p_return_code )';
        con.query(que, function (err, result) {
            if (err) throw err;
            con.release();
            res.json(result);
        });
    });
});

module.exports = router;
