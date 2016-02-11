var ModelAnalyzer = function (input) {
	var lines = input.split('\n')

	var line0Pieces = lines[0].split(' ')

	this.mapW = line0Pieces[0]
	this.mapH = line0Pieces[1]

	this.drones = new Array(parseInt(line0Pieces[2]))
	this.deadline = parseInt(line0Pieces[3])
	this.maxLoad = parseInt(line0Pieces[4])

	this.productsWeights = new Array(parseInt(lines[1]))

	var productsWeightsData = lines[2].split(' ')

	for (var i = 0; i < productsWeightsData.length; i++) {
		this.productsWeights[i] = productsWeightsData[i]
	}

	this.warehouses = new Array(parseInt(lines[3]))

	var currentLine = 3

	for (var i = 0; i < this.warehouses.length; i++) {

	}


	console.log(this)
}




module.exports = ModelAnalyzer
