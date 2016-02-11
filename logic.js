var ApplyLogic = function (modelData) {


	function getAvailableDrones() {

	}

	function getDistance(p1, p2) {
		return Math.sqrt(
			Math.pow(Math.abs(p1.x - p2.x), 2) +
			Math.pow(Math.abs(p1.y - p2.y), 2)
		)
	}

	function getNearestDrones(pos) {
		var smallestDroneDistance = getDistance(pos, modelData.drones[0]);
		var nearestDrone = modelData.drones[0]

		modelData.drones.forEach(function(drone) {
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

	function getOrderCost(order) {
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
						var nearest = getNearestDrones(warehouse.pos);

						var loadCost = getDistance(nearest, warehouse.pos) + 1;

						if(loadCost < minLoadCost) {
							minLoadCost = loadCost;
							targetDrone = nearest;
							targetWarehouse = warehouseIndex;
						}
					})

					var maxLoad = getMaxLoad(targetDrone, t, quantity);

					quantity -= maxLoad;

					targetDrone
					commands.push({
						drone: targetDrone,
						type: 'L',
						warehouse: targetWarehouse,
						product: t,
						quantity: maxLoad
					});

				}

				order.totalItems -= quantity;





			})

		}

	}
}


module.exports = ApplyLogic
