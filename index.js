var port = process.env.PORT || 3000,
    util = require("./lib/util"),
    md = require("./lib/markdown"),
    request = require("request"),
    express = require("express"),
    app = express();

app.set("view engine", "jade");

app.use(require("connect-assets")());
app.use(express.static(__dirname + "/public"));
app.use(express.cookieParser("098645EA-0233-4150-AEEF-1C68ABA5E92B"));

if (process.env.NODE_ENV === "production") {
  var RedisStore = require("connect-redis")(express),
      rtg = require("url").parse(process.env.REDISTOGO_URL),
      redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);

  app.use(express.session({
    store: new RedisStore({ client: redis }),
    secret: "098645EA-0233-4150-AEEF-1C68ABA5E92B"
  }));
}
else {
  app.use(express.session({
    secret: "098645EA-0233-4150-AEEF-1C68ABA5E92B"
  }));
}

app.use(express.bodyParser());
app.use(require("connect-flash")());
app.use(util.flashMiddleware);

app.get("/", util.render("input"));
app.post("/upload", md.store, util.redirect("/render"));
app.get("/render", md.render, util.render("render"));
app.get("/render/:id", md.render, util.render("render"));

app.listen(port, function () { console.log("Listenting at %s", port); });