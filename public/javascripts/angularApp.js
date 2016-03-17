// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', [ 'ngRoute' ,"ui.bootstrap"]);

// configure our routes
scotchApp.config(function($routeProvider) {
	$routeProvider

	// route for the home page
	.when('/', {
		templateUrl : '/home.html',
		controller : 'mainController'
	})

	// route for the client page
	.when('/personalinfo', {
		templateUrl : '/personalinfo.html',
		controller : 'personController',
		resolve : {
			clients : [
					'dataService',
					function(
							dataService) {
						return dataService
								.getAllPerson();
					} ]
		}
	})
	;
});

scotchApp.factory('dataService', [
		'$http',
		function($http) {

			var dataModel = {
				listofpersons : []
			};
			
			dataModel.getAllPerson = function() {
				console.log('CALLED dataModel.getAllPerson ');
				return $http.get('/personalinfo').success(
						function(data) {
							angular.copy(data,
									dataModel.listofpersons);
						});
			};
			

			
			dataModel.addPerson = function(person) {
				return $http.post('/personalinfo', person).success(
						function(client) {
							dataModel.listofpersons.push(person);
						});
			};

			dataModel.editPerson = function(person) {
				return $http.put('/personalinfo/' + person._id, person)
						.success(function(person) {
						});
			};
			return dataModel;
		} ]);
// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function($scope) {
	// create a message to display in our view
	$scope.message = 'Everyone come and see how good I look!';
});

scotchApp
		.controller(
				'personController',
				[
						'$scope',
						'dataService',
						function($scope, localDataModel) {
							$scope.buttontext = "Add Person Details";
							$scope.isSaved = true;
							$scope.person_details=new Object();
							$scope.editmode = false;
							
							$scope.listofpersons = localDataModel.listofpersons;

							$scope.personid = '';

							$scope.updatePersonalInfo = function(personalinfo) {

								if ($scope.personid === '') {
									localDataModel.addPerson($scope.person_details).success(function(personalinfo) {
									});
								} else {
									localDataModel.editPerson($scope.person_details).success(function(personalinfo) {
									});
								}
								$scope.personid = '';
								$scope.person_details=new Object();
								$scope.buttontext = "Add Person Details";
							};

							$scope.editClient = function(person) {
								$scope.editmode = true;
								$scope.isSaved = false;
								$scope.personid = person._id;
								$scope.buttontext = 'Update Person Details';
								
							};

							$scope.$on('$locationChangeStart', function(event) {
								if ($scope.isSaved == false) {
									event.preventDefault();
								}
							});
							
							$scope.editPersonalDetail = function(person) {
								$scope.personid = person._id;
								$scope.person_details=person;
								$scope.buttontext = 'Update person Details';
							};
						} ]);




