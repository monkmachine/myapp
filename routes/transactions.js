var express = require('express');
var router = express.Router();
const getConnection = require('../db/mysql');
var uuidv4 = require('uuid/v4');
const isAuth = require('../auth');


/* GET transactions listing. */
router.get('/', function (req, res) {
    var reqToken = req.header("Authorization").replace('Bearer ', '');
    console.log(reqToken);
    isAuth(reqToken, function (error, googparse) {
        if (error) {
            res.status(401).end();
        };

        getConnection(function (err, con) {
            if (err) throw err;
            var email = googparse.email;
            if (email == undefined) {
                res.status(401).end()
            } else {
                que = 'CALL ep_ico.getusertransactions(\'' + email + '\', @token ,@p_userJSON);select @p_userJSON as p_userJSON;';
                console.log(que);
                con.query(que, function (err, results) {
                    if (err) throw err;
                    else
                        con.release();
                    var datapackstr = results[2];
                    console.log(datapackstr);
                    if (datapackstr.RowDataPacket.p_userJSON == null) {
                        res.status(401).end();
                    } else {
                        var datapack = datapackstr.p_userJSON;
                        res.json(datapack);

                    };
                });
            }
        });
    });
});


/* GET transactions listing. */

router.post('/', function (req, res) {
    var reqToken = req.header("Authorization").replace('Bearer ', '');
    console.log(reqToken);
    isAuth(reqToken, function (error, googparse) {
        if (error) {
            res.status(401).end();
        };
        getConnection(function (err, con) {
            var email = googparse.email;
            if (email == undefined) {
                res.status(401).end()
                console.log('email', email);
            } else {
                console.log('email', email);
                if (err) throw err;
                var guid = uuidv4();
                var p_userJSON = JSON.stringify(req.body);
                var p_ipCountry = 'NA';
                // parameters are p_userJSON, p_googleEmail, p_ipCountry, p_eventId
                que = 'CALL ep_ico.createproposedtransaction(\'' + p_userJSON + '\',\'' + email + '\',\'' + p_ipCountry + '\',\'' + guid + '\', @token, @p_return_text, @p_return_code ); select @p_return_text as return_text, @p_return_code as returncode';
                console.log('>> que: ', que);
                con.query(que, function (err, results) {
                    if (err) throw err;
                    con.release();
                    console.log('>> results: ', results);
                    res.json(results[1]);
                });
            }
        });
    });
});

module.exports = router;