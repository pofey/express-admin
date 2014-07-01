var user = require("../lib/app/user");
var fs = require('fs'),
    path = require('path');
var args = process.argv.splice(2);
var dpath = args[0];
if (dpath == undefined || !fs.existsSync(dpath)) {
    console.log('Config directory path doesn\'t exists!');
    process.exit();
}
var username = args[1],
    password = args[2];
if(username==undefined){
    console.log('Username is null!');
    process.exit();
}
if(password==undefined){
    console.log('Password is null!');
    process.exit();
}
var json = require(path.join(dpath, "users.json"));
user.create(username, password, true, function (err, user) {
    if (err) return cb(err);
    json[user.name] = user;
    fs.writeFileSync(path.join(dpath, 'users.json'), JSON.stringify(json, null, 4), 'utf8');
    console.log("Create user sucess,username: "+username+" password: "+password);
})