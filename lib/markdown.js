var markdown = module.exports = {},
    request = require("request");

markdown.store = function (req, res, next) {
  var md = req.body.markdown;

  if (md) {
    req.session.history = req.session.history || [];
    req.session.history.push(md);
    next();
  }
  else {
    req.flash("warning", "Woah there, enter some markdown first!");
    return res.redirect("/");
  }
};

markdown.render = function (req, res, next) {
  var id = req.params.id,
      history = req.session.history || [];

  if (!history.length) {
    req.flash("error", "No markdown was found to render; try entering it again.");
    return res.redirect("/");
  }

  var respond = function (error, data) {
    if (error) {
      req.flash("error", "There was a problem rendering: " + error.toString());
      return res.redirect("/");
    }

    res.locals.markdown = data;
    next();
  };

  if (id !== undefined) {
    if (history[id]) {
      return renderMarkdownFromGithub(history[id], respond);
    }
    else {
      req.flash("warning", "That specific bit of markdown wasn't found. Here's your latest rendering instead.");
    }
  }
  else {
    return renderMarkdownFromGithub(history[history.length - 1], respond);
  }
};

var renderMarkdownFromGithub = function (md, callback) {
  var things = {
    url: "https://api.github.com/markdown",
    method: "POST",
    body: JSON.stringify({
      text: md,
      mode: "markdown"
    }),
    headers: {
      "Content-type": "application/json"
    }
  };

  request(things, function (error, response, data) {
    if (error) { return callback(error); }
    if (response.statusCode !== 200) { return callback(response.statusCode); }
    return callback(null, data);
  });
};