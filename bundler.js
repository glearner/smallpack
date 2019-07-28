const bundle = require("./index");
const entry = __dirname + "/app.js";
const fs = require("fs");

fs.writeFileSync("bundle.js", bundle(entry));
