"use strict";
angular.module("myAgenda",['ui.bootstrap',"ui.router","ngAnimate", 'ngCookies']).config(["$stateProvider","$urlRouterProvider",
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
			templateUrl:"views/dashboard/overview.html",
			controller:"DashboardCtrl"
		})
		.state("today",{
			url:"/today",
			parent:"dashboard",
			templateUrl:"views/dashboard/today.html",
			controller:"DashboardCtrl"
		})
		.state("todo",{
			url:"/todo",
			parent:"dashboard",
			templateUrl:"views/dashboard/todo.html",
			controller:"DashboardCtrl"
		})
		.state("settings",{
			url:"/settings",
			parent:"dashboard",
			templateUrl:"views/dashboard/settings.html",
			controller:"DashboardCtrl"
		})
	}]),
angular.module("myAgenda").controller("LoginCtrl",["$scope","$location", "$http", "userService", '$interval',
	function(r,t, $http, user, $interval){
		r.errors = [],
		r.submit=function(){
			$http.post('/auth/local', {
				identifier: r.identifier,
				password: r.password
			})
			.then(function(response){
				console.log("response is ", response)
				if (response.data.errors === undefined || response.data.errors.length <= 0){
					user.setUserId(response.data.userid);
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
				console.log("Error has occurred", response.data)
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
angular.module("myAgenda").controller("DashboardCtrl",["$scope","$state", "$location", "$http", "userService", "$interval",
	function(r,t, l, $http, user, $interval){
		r.$state=t;
		r.tasks = {};
		r.minDate = new Date();
		r.selectedTask = {};
		r.priority = 1;
		r.maxPriority = 9;
		r.leaveopen = 1;
		r.types = [];
		r.morning = new Date();
		r.evening = new Date();
		r.night = new Date();
		r.tomorrow = new Date(r.morning + 24 * 60 * 60 * 1000);
		r.aftertomorrow = new Date(r.morning + 2 * 24 * 60 * 60 * 1000);
		r.nextweek = new Date(r.morning + 7 * 24 * 60 * 60 * 1000);
		r.ismeridian = true;
		r.hstep = 1;
		r.mstep = 5;
		/*
		$interval(function() {
        	r.refreshTasks();
		}, 5000);*/
		r.logout=function(){
			user.setUserId(-1);
			$http.get('/logout')
			.then(function(response){
				return l.path("/login"),!1
			}, function(response){
				console.log("Error has occurred", response.data.errors)
				r.errors = response.data.errors;
			})
		}
		r.changePassword=function(){
			$http.post('/changepassword', {
				oldpassword: r.oldpassword,
				newpassword: r.newpassword
			}).then(function(response){
				console.log("Response is ", response)
				r.logout()
			}, function(response){
				console.log("Error is ", response)
			})
		}
		r.open = function($event){
			r.status.opened = true
		}
		r.today = function() {
			r.dt = new Date();
		}
		r.status = {
			opened: false
		}
		r.setupDates=function(){
			r.morning.setHours(user.getMorning().getHours(), user.getMorning().getMinutes(), user.getMorning().getSeconds())
			r.evening.setHours(user.getEvening().getHours(), user.getEvening().getMinutes(), user.getEvening().getSeconds())
			r.night.setHours(user.getNight().getHours(), user.getNight().getMinutes(), user.getNight().getSeconds())
			r.tomorrow.setHours(user.getTomorrow().getHours(), user.getTomorrow().getMinutes(), user.getTomorrow().getSeconds())
			r.aftertomorrow.setHours(user.getAfterTomorrow().getHours(), user.getAfterTomorrow().getMinutes(), user.getAfterTomorrow().getSeconds())
			r.nextweek.setHours(user.getNextWeek().getHours(), user.getNextWeek().getMinutes(), user.getNextWeek().getSeconds())
		}
		r.changeDates=function(){
			r.setMorning(r.morning);
			r.setEvening(r.evening);
			r.setNight(r.night);
			r.setTomorrow(r.tomorrow);
			r.setAfterTomorrow(r.aftertomorrow);
			r.setNextWeek(r.nextweek);
		}
		r.refreshTasks=function(){
			console.log("Tasks refreshed")
			$http.get("/task")
			.then(function(response){
				if (response.data != undefined){
					console.log(response.data)
					user.setTasks(response.data);
					r.tasks = user.getTasks();
					r.types = [];
					for (var i=0; i<r.tasks.length; i++){
						var found = false;
						var task = r.tasks[i];
						for (var j=0; j<r.types.length; j++){
							var type = r.types[j];
							if (type == task.taskType) found = true
						}
						if (!found) r.types.push(task.taskType)
					}
				}
			})
		}
		r.reschedule = function(taskId, time){
			var pickedDate = new Date();
			switch(time){
				case 'morning':
					pickedDate.setHours(r.morning.getHours(), r.morning.getMinutes(), r.morning.getSeconds());
					break;
				case 'evening':
					pickedDate.setHours(r.evening.getHours(), r.evening.getMinutes(), r.evening.getSeconds());
					break;
				case 'night':
					pickedDate.setHours(r.night.getHours(), r.night.getMinutes(), r.night.getSeconds());
					break;
				case 'tomorrow':
					pickedDate = new Date(pickedDate + 24 * 60 * 60 * 1000)
					pickedDate.setHours(r.tomorrow.getHours(), r.tomorrow.getMinutes(), r.tomorrow.getSeconds());
					break;
				case 'aftertomorrow':
					pickedDate = new Date(pickedDate + 2 * 24 * 60 * 60 * 1000)
					pickedDate.setHours(r.aftertomorrow.getHours(), r.aftertomorrow.getMinutes(), r.aftertomorrow.getSeconds());
					break;
				case 'nextweek':
					pickedDate = new Date(pickedDate + 7 * 24 * 60 * 60 * 1000)
					pickedDate.setHours(r.nextweek.getHours(), r.nextweek.getMinutes(), r.nextweek.getSeconds());
					break;
				default:
					break;
			}
			$http.put("/task/" + taskId, { 
			datePlanned: pickedDate
			}).then(function(response){ 
				r.refreshTasks();
			})
		}
		r.setTaskCompletion = function(taskId, isDone){
			$http.put("/task/" + taskId, { 
				done: isDone
			}).then(function(response){ 
				r.refreshTasks();
			})
		}
		r.updateTask=function(taskId, changes){
			console.log("Updating task")
			changes.editing = undefined; // lol
			$http.put("/task/" + taskId, changes).then(function(response){ 
				r.refreshTasks();
			})
		}
		r.deleteTask=function(taskId){
			console.log("Deleting task")
			$http.delete("/task/" + taskId).then(function(response){
				r.refreshTasks();
			})
		}
		r.createTask=function(){
			if (r.taskType === undefined){
				r.taskType = "Unsorted"
			}
			if (r.dueDate != undefined){
				r.dueDate.setHours(12)
			}
			var request = {
				description: r.taskDescription,
				priority: r.priority,
				taskType: r.taskType,
				done: false,
				datePlanned: r.dueDate,
				owner: user.getUserId()
			};
			console.log("oh wait", request);
			$http.post('/task', request)
			.then(function(response){
				return l.path("/dashboard"), !1
			}, function(response){
				console.log("error ")
				console.log(response)
			})
		}
		r.refreshTasks();
		r.setupDates();
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
angular.module("myAgenda").service('userService', ['$cookieStore', function($cookies){
	var userid = $cookies.get('userid');
	var morning = $cookies.get('morning');
	var evening = $cookies.get('evening');
	var night = $cookies.get('night');
	var tomorrow = $cookies.get('tomorrow');
	var aftertomorrow = $cookies.get('aftertomorrow');
	var nextweek = $cookies.get('nextweek');
	if (morning == undefined){
		morning = new Date();
		morning.setHours(6);
	}
	if (evening == undefined){
		evening = new Date();
		evening.setHours(12);
	}
	if (night == undefined){
		night = new Date();
		night.setHours(18);
	}
	if (tomorrow == undefined){
		tomorrow = new Date(morning + 24 * 60 * 60 * 1000);
	}
	if (aftertomorrow == undefined){
		aftertomorrow = new Date(morning + 2 * 24 * 60 * 60 * 1000);
	}
	if (nextweek == undefined){
		nextweek = new Date(morning + 7 * 24 * 60 * 60 * 1000);
	}
	var tasks = {};
	return {
		getUserId: function (){
			return userid
		},
		setTasks: function (value){
			tasks = value
		},
		getTasks: function(){
			return tasks;
		},
		setUserId: function (value){
			userid = value
			$cookies.put('userid', value);
		},
		getMorning: function(){
			return morning;
		},
		getEvening: function(){
			return evening;
		},
		getNight: function(){
			return night;
		},
		getTomorrow: function(){
			return tomorrow;
		},
		getAfterTomorrow: function(){
			return aftertomorrow;
		},
		getNextWeek: function(){
			return nextweek;
		},
		setMorning: function(value){
			morning: value;
			$cookies.put('morning', value)
		},
		setEvening: function(value){
			evening: value;
			$cookies.put('evening', value)
		},
		setNight: function(value){
			night: value;
			$cookies.put('night', value)
		},
		setTomorrow: function(value){
			tomorrow: value;
			$cookies.put('tomorrow', value)
		},
		setAfterTomorrow: function(value){
			morning: value;
			$cookies.put('aftertomorrow', value)
		},
		setNextWeek: function(value){
			morning: value;
			$cookies.put('nextweek', value)
		},
	}
}]);
function parseDate(input) {
  var parts = input.split('-');
  return new Date(parts[2], parts[1]-1, parts[0]); 
}
angular.module("myAgenda").filter("todayFilter", function() {
  return function(items) {
        var dt = new Date();
        dt.setHours(23, 59,59,999)
        var result = [];        
        for (var i=0; i<items.length; i++){
        	var dueDate = new Date(items[i].datePlanned);
            if (dueDate <= dt && !items[i].done)  {
                result.push(items[i]);
            }
        }            
        return result;
  };
});