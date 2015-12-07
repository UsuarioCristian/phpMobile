'use strict';

angular.module('app', [
	'ui.router',
	'app.controllers',
	'app.services',
	'angular-storage',
	'angular-jwt',
	'ngAnimate',
	'ui.bootstrap',
	'uiGmapgoogle-maps'
])

.config(['$urlRouterProvider', '$stateProvider','jwtInterceptorProvider','$httpProvider',function($urlRouterProvider, $stateProvider, jwtInterceptorProvider,$httpProvider) {
	
	$urlRouterProvider.otherwise('/');

	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'views/login.html',
		controller: 'LoginController'
	})

	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'views/home.html',
		controller: 'HomeController',
		data:{requiresLogin:true}
	})

	$stateProvider.state('graficas', {
		url: '/graficas',
		templateUrl: 'views/graficas.html',
		controller: 'GraficasController',
		data:{requiresLogin:true},
		resolve:{
			load: function(CommerceFactory){
				return CommerceFactory.loadAllCommerce();
			},
			loadProducts: function(ProductFactory){
				return ProductFactory.loadAllProducts();
			}
		}
	})

	$stateProvider.state('maps', {
		url: '/maps',
		templateUrl: 'views/maps.html',
		controller: 'MapsController',
		data:{requiresLogin:true},
		resolve:{
			load: function(CommerceFactory){
				return CommerceFactory.loadAllCommerce();
			},			
		}
	})

	.state('stock', {
		url: '/stock',
		templateUrl: 'views/stock.html',
		controller: 'StockController',
		data:{requiresLogin:true},
		resolve:{
			load: function(CommerceFactory){
				return CommerceFactory.loadAllCommerce();
			},			
		}
	})

	.state('order', {
		url: '/order',
		templateUrl: 'views/order.html',
		controller: 'OrderController',
		data:{requiresLogin:true},
		resolve:{
			load: function(CommerceFactory){
				return CommerceFactory.loadAllCommerce();
			},			
		}
	})

	.state('finalize', {
		url: '/finalize',
		templateUrl: 'views/finalize.html',
		controller: 'FinalizeController',
		data:{requiresLogin:true},
	})

	jwtInterceptorProvider.tokenGetter = function(store){
		return store.get('token');
	};
	
	$httpProvider.interceptors.push('jwtInterceptor');

}])

.run(['$rootScope','jwtHelper', 'store', '$state', function($rootScope, jwtHelper, store, $state){
	$rootScope.$on("$stateChangeStart", function (event, next, current) {
		if (next.data && next.data.requiresLogin) {
			if(!store.get('token')){
				event.preventDefault();
					$state.go('login');
			}else{
				if(jwtHelper.isTokenExpired(store.get('token'))){
					event.preventDefault();
					$state.go('login');
				}
			}
		}
	});
}])