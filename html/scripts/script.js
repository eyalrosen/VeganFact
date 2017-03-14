var app = angular.module('veganfact', []);

app.controller('TweetsCtrl', function($scope, $http) {

	var starredCategoryName = 'אהובים';
	var starredKey = 'starred';

	var _allTweets = [];

	$http.get('/data.json').then(function(response) {
		_allTweets = response.data;
		_starredTweets = JSON.parse(localStorage.getItem(starredKey))
		
		// Get starred tweets from local storage
		_.each(_starredTweets, function(starredTweet) { 
			_.each(_allTweets, function(tweet) {
				if (tweet.content === starredTweet.content) {
					tweet.starred = true
				}
			})
		})

		$scope.categories = _.keys(_.groupBy(_allTweets, 'category'));
		// Add "starred" category in the beginning
		$scope.categories.unshift(starredCategoryName)

		// go to first category
		goToCategory($scope.categories[0]);
	});
	
	// Make sure local storage is stringified json. Set to '[]' if something goes wrong
	try {
		if (!localStorage.getItem(starredKey) || !Array.isArray(JSON.parse(localStorage.getItem(starredKey)))) {
			localStorage.setItem(starredKey, '[]')
		}
	} catch(e) {
		localStorage.setItem(starredKey, '[]');
	}

	$scope.pick = function(category) {
		// Send event to Google Analytics
		ga('send', 'event', 'category-switch', category);
		goToCategory(category);
	}

	$scope.star = function(tweet) {
		// Update starred state in local storage and DOM
		var currentStarred = JSON.parse(localStorage.getItem(starredKey));
		currentStarred.push(tweet);
		tweet.starred = true;
		localStorage.setItem(starredKey, JSON.stringify(currentStarred));
	}

	$scope.unstar = function(tweet) {
		// Update un-starred state in local storage and DOM
		var currentStarred = JSON.parse(localStorage.getItem(starredKey));
		currentStarred = currentStarred.filter(function(t) { t.content != tweet.content })
		tweet.starred = false;
		localStorage.setItem(starredKey, JSON.stringify(currentStarred))
	}

	function goToCategory(category){
		// "Starred" category gets special treatment
		$scope.tweets = category === starredCategoryName
			? _.filter(_allTweets, function(tweet) { return tweet.starred; })
			: _.filter(_allTweets, function(x) { return(x.category == category); });
		$scope.currentCategory = category;
	}

});