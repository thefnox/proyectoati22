"use strict";
angular.module("myAgenda",['ui.bootstrap',"ui.router","ngAnimate"]).config(["$stateProvider","$urlRouterProvider",
	function(r,t)
	{
		t.when("/dashboard","/dashboard/overview"),
		t.otherwise("/login"),
		r.state("base",{
			"abstract":!0,
			url:"",
			templateUrl:"views/base.html"
		})
		.state("login",{
			url:"/login",
			parent:"base",
			templateUrl:"views/login.html",
			controller:"LoginCtrl"
		})
		.state("register",{
			url:"/register",
			parent:"base",
			templateUrl:"views/register.html",
			controller:"RegisterCtrl"
		})
		.state("dashboard",{
			url:"/dashboard",
			parent:"base",
			templateUrl:"views/dashboard.html",
			controller:"DashboardCtrl"
		})
		.state("overview",{
			url:"/overview",
			parent:"dashboard",
			templateUrl:"views/dashboard/overview.html"
		})
		.state("today",{
			url:"/today",
			parent:"dashboard",
			templateUrl:"views/dashboard/today.html"
		})
		.state("todo",{
			url:"/todo",
			parent:"dashboard",
			templateUrl:"views/dashboard/todo.html"
		})
		.state("settings",{
			url:"/settings",
			parent:"dashboard",
			templateUrl:"views/dashboard/settings.html"
		})
	}]),
angular.module("myAgenda").controller("LoginCtrl",["$scope","$location", "$http", "userService",
	function(r,t, $http, user){
		r.errors = [],
		r.submit=function(){
			$http.post('/auth/local', {
				identifier: r.identifier,
				password: r.password
			})
			.then(function(response){
				console.log("response is ", response)
				if (response.data.errors === undefined || response.data.errors.length <= 0){
					user.setUserId = response.data.userid;
					$http.get("/task")
					.then(function(response){
						if (response.data != undefined){
							user.setTasks = response.data;
						}
						return t.path("/dashboard"),!1
					})
				}
				else
					r.errors = response.data.errors;
			}, function(response){
				console.log("Error has occurred", response.data.errors)
				r.errors = response.data.errors;
			})
		},
		r.register=function(){
			return t.path("/register"),!1
		}
	}]),
angular.module("myAgenda").controller("RegisterCtrl",["$scope", "$location", "$http",
	function(r,t, $http){
		r.errors = [],
		r.goBack=function(){
			return t.path("/login"),!1
		},
		r.submit=function(){
			$http.post('/auth/local/register', {
				email: r.email,
				password: r.password,
				username: r.username
			})
			.then(function(response){
				console.log(response)
				if (response.data.errors === undefined || response.data.errors.length <= 0)
					return t.path("/login"),!1
				else
					r.errors = response.data.errors;
			}, function(response){
				console.log("Error has occurred", response.data.errors)
				r.errors = response.data.errors;
			})
		}
	}]),
angular.module("myAgenda").controller("DashboardCtrl",["$scope","$state", "$location", "$http", "userService",
	function(r,t, l, $http, user){
		r.$state=t;
		r.taskDescription = "";
		r.taskType = "";
		r.dueDate = new Date();
		r.selectedTask = {};
		r.priority = 1;
		r.maxPriority = 9;
		r.leaveopen = 1;
		r.logout=function(){
			$http.get('/logout')
			.then(function(response){
				return l.path("/login"),!1
			}, function(response){
				console.log("Error has occurred", response.data.errors)
				r.errors = response.data.errors;
			})
		}
		r.changePassword=function(){
			
		}
		r.refreshTasks=function(){
			$http.get("/task")
			.then(function(response){
				if (response.data != undefined){
					user.setTasks = response.data;
				}
			})
		}
		r.createTask=function(){
			var request = {
				description: r.taskDescription,
				type: r.taskType,
				priority: r.priority,
				taskType: r.taskType,
				done: false,
				owner: user.getUserId()
			};
			console.log(request);
			$http.post('/task', request)
			.then(function(response){
				return l.path("/overview"), !1
			}, function(response){
				console.log("error ")
				console.log(response)
			})
		}
	}]);
angular.module("myAgenda").directive('equals', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, elem, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('equals', function (val) {
        validate();
      });

      var validate = function() {
        // values
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;

        // set validity
        ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
      };
    }
  }
})
angular.module("myAgenda").service('userService', function(){
	var userid = 0;
	var tasks = {};
	return {
		getUserId: function (){
			return userid
		},
		setTasks: function (value){
			tasks = {}
		},
		getTasks: function(){
			return tasks;
		},
		setUserId: function (value){
			userid = value
		}
	}
})