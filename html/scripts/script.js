var app = angular.module('veganfact', []);

app.controller('TweetsCtrl', function($scope, $http) {

	var _allTweets;

	$http.get('/data.json').then(function(response) {
		_allTweets = response.data;

		$scope.categories = _.keys(_.groupBy(_allTweets, 'category'));
		$scope.pick($scope.categories[0]);
	});

	$scope.pick = function(category) {
		$scope.tweets = _.filter(_allTweets, function(x) { return(x.category == category)});
		$scope.currentCategory = category;
	}

});