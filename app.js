(function($) {

	function getAvailableDrones() {

	}

	function getNearestDrones(pos) {

	}

	function getWarehousesForProductType(t) {

	}

	function getOrderCost(order) {
		//while products to deliver
		var loaded = [];
		while(order.length > ) {
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
					//for each warehouse
					w.forEach(function(warehouse) {
						//for each avail drone
						var nearest = getNearestDrones(warehouse.pos);

						var loadCost = getDistance(nearest, warehouse.pos) + 1;

						if(loadCost < minLoadCost) {
							minLoadCost = loadCost;
							targetDrone = nearest;
						}
					})

					quantity -= 

				}

				


			}) 

		}

	}


})(jQuery)