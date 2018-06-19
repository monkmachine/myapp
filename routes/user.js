var express = require('express');
var router = express.Router();
const getConnection = require('../db/mysql');
var uuidv4 = require('uuid/v4');
var parseJson = require('parse-json');
const isAuth = require('../auth');


/* GET users listing. */
router.get('/', function (req, res) {
    var reqToken = req.header("Authorization").replace('Bearer ','');
    console.log(reqToken);
    isAuth(reqToken, function(error, email) {
        if (error) {
            // do something with this error
        }

        getConnection(function (err, con) {
            if (err) throw err;
            // googleEmail = 'danC1';
            que = 'CALL elepig.getUser(?, @p_userJSON);';
            con.query(que, [email], function (err, results) {
                if (err) throw err;
                else
                    con.release();
                console.log('>> results: ', results);
                var datapackstr = JSON.stringify(results[0]);
                console.log('>> datapackstr: ', datapackstr);
                if (datapackstr == '[{"@p_userJSON":null}]') {
                    res.send('')
                } else {
                    var datapack = JSON.parse(JSON.parse(datapackstr.substring((datapackstr.lastIndexOf('@p_userJSON') + 12) + 1).slice(0, -2)));
                    res.json(datapack);
                };
            });
        });
    });
});


/* GET users listing. */

router.post('/', function (req, res) {
    getConnection(function (err, con) {
        if (err) throw err;
        var guid = uuidv4();
        var p_userJSON = JSON.stringify(req.body);
        var p_googleEmail = 'dan@g.com';
        var p_ipCountry = 'UK';
        console.log('req', p_userJSON);
        console.log('req', guid);
        // parameters are p_userJSON, p_googleEmail, p_ipCountry, p_eventId
        que = 'CALL elepig.createUser(\'' + p_userJSON + '\',\'' + p_googleEmail + '\',\'' + p_ipCountry + '\',\'' + guid + '\', @p_return_text, @p_return_code )';
        console.log('>> que: ', que);
        con.query(que, function (err, results) {
            if (err) throw err;
            con.release();
            console.log('>> results: ', results);
            res.json(results);
        });
    });
});

module.exports = router;