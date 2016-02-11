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
		var firstLine = lines[++currentLine]
		var secondLine = lines[++currentLine]

		this.warehouses[i] = {
			position: {
				x: firstLine.split(' ')[0],
				y: firstLine.split(' ')[1]
			},

			products: []
		}

		secondLine.split(' ').forEach(function (itemQuantity) {
			this.warehouses[i].products.push(parseInt(itemQuantity))
		}.bind(this))
	}

	for (var i = 0; i < this.drones.length; i++) {
		this.drones[i] = {
			position: this.warehouses[0].position,
			isDelivering: false
		}
	}

	this.orders = new Array(parseInt(lines[++currentLine]))

	for (var i = 0; i < this.orders.length; i++) {
		var firstLine = lines[++currentLine]
		++currentLine
		var thirdLine = lines[++currentLine]

		this.orders[i] = {
			position: {
				x: firstLine.split(' ')[0],
				y: firstLine.split(' ')[1]
			},
			items: []
		}

		//Orders are stored by their id, accessing items[id] will give
		//the quantity of items with that id purchased

		thirdLine.split(' ').forEach(function (itemId) {
			var itemId = parseInt(itemId)

			this.orders[i].items[itemId]
				? this.orders[i].items[itemId]++
				: this.orders[i].items[itemId] = 1

		}.bind(this))
	}

	console.log(this.drones);
}




module.exports = ModelAnalyzer
