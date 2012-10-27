var util = module.exports = {};

util.render = function (viewName) {
  return function (req, res) { res.render(viewName); };
};

util.redirect = function (route) {
   return function (req, res) { res.redirect(route); };
};

util.flashMiddleware = function (req, res, next) {
   res.locals.flash = req.flash();
   return next();
};