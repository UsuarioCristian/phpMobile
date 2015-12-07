'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', []).
value('version', '0.1')

.factory('ApiEndpointFactory', ['$http','$location', function($http, $location) {
	
	//var ApiEndpoint = $location.protocol() + "://" + $location.host() + ":" + $location.port();
	var ApiEndpoint;
	return{
		//ApiEndpoint : ApiEndpoint,
		setIp: function(ip){
			ApiEndpoint = ip;
		},
		getApiEndpoint: function(){
			return ApiEndpoint;
		}
	}	
	
}])

.factory('LoginFactory', ['$http','ApiEndpointFactory', function($http, ApiEndpointFactory) {
	return{
		login:function(user){
			ApiEndpointFactory.setIp(user.ip)
			//Asi funciona la encriptacion:
			/*var objHashResult=CryptoJS.SHA256(user.password)
			var strHashResult=objHashResult.toString(CryptoJS.enc.Hex);
			console.log(strHashResult);*/
			var usuario = {
				password : CryptoJS.SHA256(user.password).toString(CryptoJS.enc.Hex),
				name : user.username
			}
			console.log(user.ip);
			console.log(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/login');
			return $http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/login', usuario)
		}
	}
}])

.factory('RouteFactory', ['$http','ApiEndpointFactory', function($http, ApiEndpointFactory) {
	var route = null;
	return{		
		getRoutes:function(userId){
			var object = {
				id : userId
			}
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/routesbyemployee', object)
			.then(function(response){
				console.log(response);
				
			}, function(response){
				/*error*/
			});
		},

		getCurrentRoute:function(){
			return route;
		},

		loadCurrentRoute: function(userId){
			var object = {
				employeeId : userId
			}
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/currentroute', object)
			.then(function(response){				
				route = response.data;
				
			}, function(response){
				console.log('Error en getCurrentRoute');
				console.log(response);
			});
		},

		finalizeRoute: function(idUser, comercio){
			var object = {
				employeeId : idUser,
				commerceId : comercio.id,
				visited : comercio.visited
			}
			
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/finalizeroute', object)
			.then(function(response){				
				
				
			}, function(response){
				console.log('Error en getCurrentRoute');
				console.log(response);
			});
		}
	}
}])

.factory('CommerceFactory', ['$http','ApiEndpointFactory', function($http, ApiEndpointFactory) {
	
	var allCommerce = [];
	var comerciosOrd = [];

	return{
		getComerciosOrd: function(){
			return comerciosOrd;
		},
		setComerciosOrd: function(comercios){
			comerciosOrd = comercios;
		},

		getAllCommerce:function(){
			
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/allcommerce')
			.then(function(response){
				
				return response.data;
			}, function(response){
				return null;
			});
		},

		loadAllCommerce: function(){
			var self = this;
			allCommerce = [];
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/allcommerce')
			.then(function(response){				
				//allCommerce = response.data;
				for (var i = 0; i < response.data.length; i++) {					
					self.getAllProductBycommerce(response.data[i]);					
				};

			}, function(response){
				allCommerce = null;
			});
		},

		getLoadCommerce: function(){
			return allCommerce;
		},

		getAllProductBycommerce:function(commerce){
			var self = this;
			var object = {
				id : commerce.id
			}
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/allproductbycommerce', object)
			.then(function(response){
				var commerceCopy = {
						id: commerce.id,
						lat: commerce.lat,
						long: commerce.long,
						name: commerce.name,
						priority: commerce.priority,
						products: [],
					}
				var allProduct = response.data;

				for (var i = 0; i < allProduct.length; i++) {
					var producto = {
						id : allProduct[i].id,
						name : allProduct[i].name,
						category_id : allProduct[i].category_id,
						image_path : allProduct[i].image_path,
						sold : 0,
					}
					self.getProductSold(commerceCopy.id, producto);
					commerceCopy.products.push(producto);
				};

				allCommerce.push(commerceCopy);
			}, function(response){
				console.log('Error en getAllProductBycommerce');
			});
		},

		stockSave : function(object){
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/stocksave', object)
			.then(function(response){
				swal("Guardado!", "Se ha guardado correctamente el stock", "success");
				
			}, function(response){
				sweetAlert("Oops...", "Ocurrio un error en el servidor!", "error");
			});
		},

		orderSave : function(object){
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/ordersave', object)
			.then(function(response){
				swal("Guardado!", "Se ha guardado correctamente el pedido", "success");
				
			}, function(response){
				sweetAlert("Oops...", "Ocurrio un error en el servidor!", "error");
			});
		},

		getProductSold : function(idCommerce, product){

			var object ={
				commerceId : idCommerce,
				productId : product.id
			}

			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/productsold', object)
			.then(function(response){
				product.sold = response.data;				
				
			}, function(response){
				console.log(response);
			});
		}
	}
}])

.factory('ProductFactory', ['$http','ApiEndpointFactory', function($http, ApiEndpointFactory) {
	var allProducts = [];
	return{
		getAllProduct:function(){
			return allProducts;
		},

		loadAllProducts:function(){
			$http.post(ApiEndpointFactory.getApiEndpoint() +'/php2015/backend/web/resource/allproduct')
			.then(function(response){				
				allProducts = response.data;
			}, function(response){
				console.log(response);
			});
		}
	}
}])