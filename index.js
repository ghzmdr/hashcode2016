var ModelsAnalyzer = require('./models');
var ApplyLogic = require('./logic');

var fs = require('fs')

fs.readFile('./busy_day.in', 'utf8', function (err, data) {
	var ma = new ModelsAnalyzer(data)
	var operations = ApplyLogic(ma)
})
