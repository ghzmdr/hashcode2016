var ApplyLogic = function (modelData) {


	function getAvailableDrones() {
		return modelData.drones.filter(function (drone) {
			return !drone.isDelivering
		})
	}

	function getDistance(p1, p2) {
		return Math.sqrt(
			Math.pow(Math.abs(p1.x - p2.x), 2) +
			Math.pow(Math.abs(p1.y - p2.y), 2)
		)
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

	function getWarehousesForProductType(t) {
		return modelData.warehouses.filter(function(wh) {
			return wh.products[t]
		});
	}

	function getMaxLoad(drone, type, quantity) {

		var pWeight = type.weight;

		var weight = pWeight * quantity;

		var maxQuantity;
		if(weight <= drone.capacity) {
			maxQuantity = quantity;
		} else {
			maxQuantity = Math.floor(drone.capacity/pWeight);
		}

		drone.capacity -= maxQuantity * pWeight;
		return maxQuantity;

	}



	function getOrderCost(order, orderIndex) {
		var commands = [];
		
		//while products to deliver
		while(order.totalItems > 0) {
			//for each product type
			order.types.forEach(function(quantity, t) {

				while(quantity > 0) {
					//get warehouses
					var w = getWarehousesForProductType(t);

					//get available drones
					var drones = getAvailableDrones();

					//for each avail drone
					var minLoadCost = Number.POSITIVE_INFINITY;
					var targetDrone = null;
					var targetWarehouse = null;
					//for each warehouse
					w.forEach(function(warehouse, warehouseIndex) {
						//for each avail drone
						var nearest = getNearestDrones(drones, warehouse.pos);

						var loadCost = getDistance(nearest, warehouse.pos) + 1;

						if(loadCost < minLoadCost) {
							minLoadCost = loadCost;
							targetDrone = nearest;
							targetWarehouse = warehouseIndex;
						}
					})

					var maxLoad = getMaxLoad(targetDrone, t, quantity);

					quantity -= maxLoad;
					order.totalItems -= maxLoad;
					modelData.warehouses[targetWarehouse].products[t] -= maxLoad;

					//set drone delivering
					modelData.drones[targetDrone].isDelivering = true;
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
						loadCost: getDistance(targetDrone, order.pos) + 1
					});

				}

				order.totalItems -= quantity;

			}) 

		}

		//compute load commands cost + deliver
		var cost = 0;
		commands.forEach(function(c) {
			cost += c.loadCost;
		});

		return cost;


	}
}


module.exports = ApplyLogic
