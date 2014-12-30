"use strict";

var fs = require("fs");
var trumpet = require("trumpet");
var through = require("through2");
var chokidar = require("chokidar");
var scripts = require("./scripts");
var styles = require("./styles");

function generate(scriptStream) {
  var tr = trumpet();
  fs.createReadStream(__dirname + "/template.html").pipe(tr);
  // Inject css
  styles().pipe(tr.select("style").createWriteStream());
  // Inject script
  scriptStream.pipe(tr.select("script").createWriteStream());
  scriptStream.on("error", tr.emit.bind(tr, "error"));
  return tr;
}

function watchSource(fn) {
  chokidar.watch([
    __dirname + "/template.html",
    __dirname + "/styles.css",
  ]).on("change", fn);
}

module.exports = function() {
  return generate(scripts().bundle());
};

module.exports.watch = function() {
  function emit() {
    console.time("scripts");
    var scripts = script.bundle();
    scripts.on("end", console.timeEnd.bind(console, "scripts"));
    output.push(generate(scripts));
  }

  var output = through.obj();
  var script = scripts.watch();
  script.on("update", emit);
  watchSource(emit);
  emit();
  return output;
};
