const del = require('del');

function atob(a) {
    return Buffer.from(a, 'base64').toString();
};

function btoa(a) {
    return Buffer.from(a).toString('base64');
};

function generate_random_letters() {
    return btoa(Math.random().toString()).substr(10, 5).replace(/[0-9]/g, '').toLowerCase();
}

var fs = require("fs");
var {
    execSync
} = require("child_process");
var express = require("express");
var app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})
app.use(require("express-all-allow")());
app.post("/api/generate_from_code", function(req, res) {
    var ran = generate_random_letters();
    fs.mkdirSync("projects/" + ran);
    console.log("created path " + ran);
    var code = "projects/" + ran + "/Main";
    fs.writeFileSync(code + ".as", `package {
${req.body.code}
}
`);
    var logs = execSync("mxmlc " + code + ".as").toString();
    res.send({
        logs: logs,
        path: code + ".swf"
    });
});

app.post("/api/remove", function(req, res) {
    del(req.body.path);
    console.log("removed path " + req.body.path);
    res.send("success");
});

app.listen(8080);
