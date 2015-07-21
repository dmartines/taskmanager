// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('taskmanager', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory("Categories", function() {
  return {
    all: function() {
      var categoryString = window.localStorage['categories'];
      if (categoryString) {
        return angular.fromJson(categoryString);
      }
      return [];
    },
    save: function(categories) {
      window.localStorage['categories'] = angular.toJson(categories);
    },
    newCategory: function(categoryTitle) {
      // Add category
      return {
        title: categoryTitle,
        tasks: []
      };
    },
    getLastActiveCategory: function() {
      return parseInt(window.localStorage['lastActiveCategory'] || 0);
    },
    setLastActiveCategory: function(index) {
      window.localStorage['lastActiveCategory'] = index;
    }
  }
})

.controller("taskCtrl", function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Categories) {
  var createCategory = function(categoryTitle) {
    var newCategory = Categories.newCategory(categoryTitle);
    $scope.categories.push(newCategory);
    Categories.save($scope.categories);
    $scope.selectCategory(newCategory, $scope.categories.length-1);
  }

  $scope.categories = Categories.all();

  $scope.activeCategory = $scope.categories[Categories.getLastActiveCategory()];

  $scope.newCategory = function() {
    var categoryTitle = prompt('Category name');
    if (categoryTitle) {
      createCategory(categoryTitle);
    }
  }

  $scope.selectCategory = function(category, index) {
    $scope.activeCategory = category;
    Categories.setLastActiveCategory(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  }

  $scope.tasks = [
    {title: 'Task 1'},
    {title: 'Task 2'},
    {title: 'Task 3'},
  ];

  //Load modal
  $ionicModal.fromTemplateUrl('new-task.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.taskModal = modal;
  });

  $scope.createTask = function(task) {
    
    if (!$scope.activeCategory || !task) {
      return;
    }

    $scope.activeCategory.tasks.push({
      title: task.title
    });

    $scope.taskModal.hide();
    
    Categories.save($scope.categories);

    task.title = '';
  }

  $scope.removeTask = function(task) {
    for (i=0; i< $scope.activeCategory.tasks.length;  i++) {
      if ($scope.activeCategory.tasks[i].title == task.title) {
        $scope.activeCategory.tasks.splice(i,1);
        Categories.save($scope.categories);
        return;
      }
    }
  }

  $scope.newTask = function() {
    $scope.taskModal.show();
  }

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleCategories = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }

  $timeout(function() {
    if ($scope.categories.length == 0) {
      while(true) {
        var categoryTitle = prompt('Please create a category');
        if (categoryTitle) {
          createCategory(categoryTitle);
          break;
        }
      }
    }
  });

})
