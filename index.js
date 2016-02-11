var ModelsAnalyzer = require('./models')
var fs = require('fs')

fs.readFile('./busy_day.in', 'utf8', function (err, data) {
	var md = new ModelsAnalyzer(data)	
})
