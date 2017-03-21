var app = angular.module('veganfact', []);

app.controller('TweetsCtrl', function($scope, $http) {

	var starredCategoryName = '★ סימנתי בכוכב';
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
		});

		$scope.categories = _.keys(_.groupBy(_allTweets, 'category'));
		// Add "starred" category in the beginning
		$scope.categories.unshift(starredCategoryName)
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
		// "Starred" category gets special treatment
		$scope.tweets = category === starredCategoryName
			? _.filter(_allTweets, function(tweet) { return tweet.starred; })
			: _.filter(_allTweets, function(x) { return(x.category == category); });
		$scope.currentCategory = category;

    // Send event to Google Analytics
    ga('send', 'event', 'category-switch', category);
	};
  
	$scope.star = function(tweet) {
		// Update starred state in local storage and DOM
		var currentStarred = JSON.parse(localStorage.getItem(starredKey));
		currentStarred.push(tweet);
		tweet.starred = true;
		localStorage.setItem(starredKey, JSON.stringify(currentStarred));
		ga('send', 'event', 'tweet-star', tweet);
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

	$scope.newTweet = function() {
        ga('send', 'event', 'new-tweet-link');
        window.open('https://docs.google.com/a/madfairy.org/forms/d/e/1FAIpQLSc9oezgvfKewxvTxizV2mCoxAO4-hOrUsyKsfa-nkedR9HarA/viewform');
	};

	$scope.openVeganTech = function() {
        ga('send', 'event', 'open-vegan-tech');
        window.open('http://www.vegantech.co.il');
	};

});