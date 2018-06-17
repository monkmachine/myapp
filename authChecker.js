function authChecker(req, res, next) {
    if (req.auth || req.path==='/auth') {
        next();
    } else {
       res.redirect("/auth");
    }
}
module.exports = authChecker;