var ApplyLogic = function (modelData) {


	function getAvailableDrones() {

	}

	function getNearestDrones(drones, pos) {

	}

	function getWarehousesForProductType(t) {

	}

	function getMaxLoad(drone, type, quantity) {

		var pWeight = type.weight;

		var weight = pWeight * quantity;

		var maxQuantity;
		if(weight <= modelData.maxLoad) {
			maxQuantity = quantity;
		} else {
			maxQuantity = Math.floor( (modelData.maxLoad - drone.weight)/pWeight);
		}

		drone.weight += maxQuantity * pWeight;
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
