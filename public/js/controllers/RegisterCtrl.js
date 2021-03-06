// public/js/controllers/RegisterCtrl.js
angular.module('RegisterCtrl', []).controller('RegisterController', ['$scope', 'auth',
    function($scope, auth) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        // register user using auth.register
        $scope.register = function() {

            // check valid credentials
            if($scope.username.length < 6 || $scope.username.length > 24) {
                displayError('Username must be between 6 and 24 characters long.');
            }
            else if($scope.password.length < 6) {
                displayError('Password must be at least 6 characters long.');
            }
            else if($scope.role && $scope.username && $scope.password) {
                auth.register({
                    username: $scope.username,
                    password: $scope.password,
                    role: $scope.role
                }, function (error) {
                    displayError(error);
                });
            } else {
                displayError('Please enter in all fields.');
            }
        };

        // display error message
        function displayError(error) {
            $('#error-message').empty().append(error);
        }

    }
]);