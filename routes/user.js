var express = require('express');
var router = express.Router();
const getConnection = require('../db/mysql');
var uuidv4 = require('uuid/v4');
const isAuth = require('../auth');


/* GET users listing. */
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
            que = 'CALL ep_ico.getUser(?, @token ,@p_userJSON);select @p_userJSON as p_userJSON;';
            con.query(que, [email,"xxx"], function (err, results) {
                if (err) throw err;
                else
                    con.release();
                var datapackstr = results[1];
                if (datapackstr.p_userJSON == null) {
                    res.status(401).end();
                } else {
                    var datapack = datapackstr.p_userJSON;
                    res.json(datapack);

                };
            });
        });
    });
});


/* GET users listing. */

router.post('/', function (req, res) {
            var reqToken = req.header("Authorization").replace('Bearer ', '');
            console.log(reqToken);
            isAuth(reqToken, function (error, googparse) {
                if (error) {
                    res.status(401).end();
                };
                    getConnection(function (err, con) {
                    var email = googparse.email;
                    console.log('email',email);
                    if (err) throw err;
                    var guid = uuidv4();
                    var p_userJSON = JSON.stringify(req.body);
                    var p_ipCountry = 'UK';
                    console.log('req', p_userJSON);
                    console.log('req', guid);
                    // parameters are p_userJSON, p_googleEmail, p_ipCountry, p_eventId
                    que = 'CALL ep_ico.createUser(\'' + p_userJSON + '\',\'' + email + '\',\'' + p_ipCountry + '\',\'' + guid + '\', @token, @p_return_text, @p_return_code ); select @p_return_text as p_return_text, @p_return_code as p_return_code';
                    console.log('>> que: ', que);
                    con.query(que, function (err, results) {
                        if (err) throw err;
                        con.release();
                        console.log('>> results: ', results);
                        res.json(results[1]);
                    });
                });
            });
        }); 

            module.exports = router;