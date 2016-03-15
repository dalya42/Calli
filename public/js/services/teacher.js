angular.module('calliApp')

    .factory('teacher', ['$http', 'token', 'auth',
        function($http, token, auth) {

            var teacher = {
                pupils: [],
                group: {}
            };

            teacher.registerPupil = function(pupilName, callback) {
                var teacherUsername = token.currentUser();
                var username = teacherUsername + pupilName;
                auth.register({
                    username: username,
                    password: teacherUsername,
                    role: 'Pupil',
                    creator: token.currentUserId()
                }, function(response) {
                    callback(response);
                });
            };

            teacher.removePupil = function(pupil) {
                return $http.post('/user/remove', { _id: pupil._id } )
                    .error(function(error) {
                        console.log(error);
                    });
            };

            teacher.getPupils = function () {

                var _teacherId = token.currentUserId();

                $http.post('/pupils', { teacherId: _teacherId })
                    .success(function(data) {
                        angular.copy(data, teacher.pupils);
                        return data;
                    })
                    .error(function(error) {
                        console.log(error);
                    });

            };


            teacher.getGroup = function(_teacherId) {

                $http.post('/group/byTeacherId', { teacherId: _teacherId })
                    .success(function(data) {
                        angular.copy(data, teacher.group);
                        return data;
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };

            teacher.addScenario = function(scenario) {
                $http.put('/group/scenario/add', {
                    teacherId: token.currentUserId(),
                    scenarioId: scenario._id,
                    scenarioName: scenario.name,
                    scenarioType: scenario.scenarioType.name,
                    scenarioLevel: scenario.level,
                    translations: scenario.translations,
                    containsTranslations: scenario.containsTranslations,
                    enabled: scenario.enabled
                }).error(function(error) {
                    console.log(error);
                });
            };

            teacher.containsScenario = function(scenario) {

                var contains = false;

                if(teacher.group) {
                    if(teacher.group.scenarios) {
                        $.each(teacher.group.scenarios, function(key, val) {
                            if(val.scenarioName === scenario.name &&
                                val.scenarioType === scenario.type &&
                                val.scenarioLevel === scenario.level) {
                                contains = true;
                            }
                        });
                    }
                }

                return contains;
            };

            teacher.deleteScenario = function(scenario) {

                $http.put('/group/scenario/delete', {
                    teacherId: token.currentUserId(),
                    _id: scenario._id
                }).error(function(error) {
                    console.log(error);
                });
            };

            teacher.enableScenario = function(scenario) {

                $http.put('/group/scenario/enable', {
                    teacherId: token.currentUserId(),
                    scenarioId: scenario.scenarioId,
                    enabled: true
                }).error(function(error) {
                    console.log(error);
                });
            };

            teacher.disableScenario = function(scenario) {
                $http.put('/group/scenario/enable', {
                        teacherId: token.currentUserId(),
                        scenarioId: scenario.scenarioId,
                        enabled: false
                }).error(function(error) {
                    console.log(error);
                });
            };

            teacher.enableTranslations = function(scenario) {
                $http.put('/group/scenario/translations', {
                    teacherId: token.currentUserId(),
                    scenarioId: scenario.scenarioId,
                    translations: true
                }).error(function(error) {
                    console.log(error);
                });
            };

            teacher.disableTranslations = function(scenario) {
                $http.put('/group/scenario/translations', {
                        teacherId: token.currentUserId(),
                        scenarioId: scenario.scenarioId,
                        translations: false
                    }).error(function(error) {
                        console.log(error);
                    });
            };

            teacher.logScenarioCompletion = function(scenario) {

                if(teacher.group.scenarios) {
                    $.each(teacher.group.scenarios, function (key, val) {
                        if (val.scenarioName === scenario.name) {

                            if (val.completionList.indexOf(token.currentUserId()) < 0) {
                                $http.put('/group/scenario/completion', {
                                        teacherId: token.currentUserCreator(),
                                        scenarioId: scenario._id,
                                        pupilId: token.currentUserId()
                                    })
                                    .error(function (error) {
                                        console.log(data);
                                    });
                            }
                        }
                    });
                }

            };

            return teacher;
        }
    ]);
