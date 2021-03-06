var clone = require('clone');

var ApplyLogic = function (modelData) {

	modelData.orders.forEach(function(order, index) {
		var model = clone(modelData);
		var result = getOrderCost(model, index);
		console.log(result);
	})


	function getAvailableDrones(modelData) {
		return modelData.drones.filter(function (drone) {
			return !drone.isDelivering
		})
	}

	function getDistance(p1, p2) {
		return Math.ceil(Math.sqrt(
			Math.pow(Math.abs(p1.x - p2.x), 2) +
			Math.pow(Math.abs(p1.y - p2.y), 2)
		))
	}

	function getNearestDrones(drones, pos) {
		var smallestDroneDistance = getDistance(pos, drones[0]);
		var nearestDrone = drones[0]

		drones.forEach(function(drone) {
			var distance = getDistance(pos, drone.position);

			if (distance < smallestDroneDistance) {
				nearestDrone = drone;
				smallestDroneDistance = distance;
			}
		});

		return nearestDrone;
	}

	function getWarehousesForProductType(modelData, t) {
		return modelData.warehouses.filter(function(wh) {
			return wh.products[t]
		});
	}

	function getMaxLoad(drone, type, quantity) {

		var pWeight = type.weight;

		var weight = pWeight * quantity;

		var maxQuantity;
		var capacity = modelData.maxLoad - drone.weight

		if(weight <= capacity) {
			maxQuantity = quantity;
		} else {
			maxQuantity = Math.floor(capacity/pWeight);
		}

		drone.weight += maxQuantity * pWeight;
		return maxQuantity;

	}

	function getOrderCost(model, orderIndex) {
		var commands = [];
		
		var order = model.orders[orderIndex];
		//while products to deliver
		while(order.totalItems > 0) {
			//for each product type
			order.items.forEach(function(quantity, t) {

				while(quantity > 0) {
					//get warehouses
					var w = getWarehousesForProductType(model, t);

					//get available drones
					var drones = getAvailableDrones(model);

					//for each avail drone
					var minLoadCost = Number.POSITIVE_INFINITY;
					var targetDrone = null;
					var targetWarehouse = null;
					//for each warehouse
					w.forEach(function(warehouse, warehouseIndex) {
						//for each avail drone
						var nearest = getNearestDrones(drones, warehouse.position);

						var loadCost = getDistance(nearest.position, warehouse.position) + 1;

						if(loadCost < minLoadCost) {
							minLoadCost = loadCost;
							targetDrone = nearest;
							targetWarehouse = warehouseIndex;
						}
					})

					var maxLoad = getMaxLoad(targetDrone, t, quantity);

					quantity -= maxLoad;
					order.totalItems -= maxLoad;
					model.warehouses[targetWarehouse].products[t] -= maxLoad;

					//set drone delivering
					targetDrone.isDelivering = true;
					//push command
					commands.push({
						drone: targetDrone,
						type: 'L',
						warehouse: targetWarehouse,
						product: t,
						quantity: maxLoad,
						loadCost: minLoadCost
					});

					commands.push({
						drone: targetDrone,
						type: 'D',
						client: orderIndex,
						product: t,
						quantity: maxLoad,
						loadCost: getDistance(targetDrone.position, order.position) + 1
					});

					console.log(commands);

				}

				order.totalItems -= quantity;

			}) 

		}

		//compute load commands cost + deliver
		var cost = 0;
		commands.forEach(function(c) {
			cost += c.loadCost;
		});

		return {commands: commands, cost: cost};

	}
}


module.exports = ApplyLogic
