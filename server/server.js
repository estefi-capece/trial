var express = require('express');
var app = express();
var path    = require("path");
var jsToHtml = require('js-to-html')

//app.use(express.static(path.resolve(path.join(process.cwd(),'/client'))));
app.use(express.static(path.resolve(__dirname,'..','client')));
app.use(jsToHtml.html);
//console.log(path.resolve(__dirname,'..','node_modules/js-to-html.js'))

app.listen(9876,function(){
    console.log('Example app listening on port 9876!');
});