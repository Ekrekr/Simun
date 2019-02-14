"use strict";
var template = "<!DOCTYPE html><html><p id='x'>$</html>";
var data = getTemplateAndData();
var page = template.replace("$", data);
console.log(page);
var fs = require('fs'); 
async function getTemplateAndData() {
	var content = FS.readfile(./index.html, function read(err, data) {
		if (err) {
			throw err;
		}
		content = data;
		console.log(content);
		processFile();
	});
}

