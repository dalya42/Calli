/**
 * Created by Raphaelle on 10/03/2016.
 */
angular.module('calliApp')

    .factory('scenarioGame', ['$http', 'scenario',
        function($http, scenario){

            var scenarioGame = {
                scenario: {},
                scenarioList: [],
                position: 1,
                recordedQuestions: [],
                recordedAnswers: [],
                recordedCorrectAnswers: [],
                isPlaying: false
            };


            //initiate game, callback first question
            scenarioGame.initGame = function(callback) {


                this.isPlaying = true;
                var firstQuestion = this.nextQuestion();
                callback(firstQuestion);

            };

            //receives answer, calls back next question
            scenarioGame.tick = function(answer, callback) {
                this.recordedAnswers.push(answer.answer);

                //answer,branch,correct of current answer.
                //if the scenario type is conversation dont push correct answers
                if(scenarioGame.scenario.scenarioType.name != "Conversation"){
                    var currentAnswers = scenarioGame.scenario.conversation[scenarioGame.position - 1].answers;

                    $.each(currentAnswers, function (key, val) {
                        if (val.answer == answer.answer) {
                            scenarioGame.recordedCorrectAnswers.push(val.correct);
                        }
                    });
                }

                //if we reach delimiter position 0, callback results and release game
                this.position++;

                if(this.position > this.scenario.conversation.length) {
                    callback(this.getResults());
                    this.release();
                } else {
                    //update position and callback next question
                    callback(this.nextQuestion());
                }

            };

            //results of questions and answers
            scenarioGame.getResults = function() {
                return {
                    questions: this.recordedQuestions,
                    answers: this.recordedAnswers,
                    correct: this.recordedCorrectAnswers
                }
            };

            //release game data
            scenarioGame.release = function() {
                this.scenario = {};
                this.position = 1;
                this.recordedQuestions = [];
                this.recordedAnswers = [];
                this.recordedCorrectAnswers = [];
            };

            //load question of game's current position
            scenarioGame.nextQuestion = function() {
                var question = this.scenario.conversation[scenarioGame.position-1];
                this.recordedQuestions.push(question.question);
                return question;
            };

            //loaf scenario for the game
            scenarioGame.loadScenario = function(scenarioName, callback) {

                var i = 0;
                var len = scenarioGame.scenarioList.length;
                var data = {};

                for(i; i < len; i++) {
                    if(scenarioGame.scenarioList[i].name === scenarioName) {
                        data = scenarioGame.scenarioList[i];
                        angular.copy(data, scenarioGame.scenario);
                        callback(data);
                    }
                }

            };

            //preloads games into scenarioList
            scenarioGame.preload = function() {   //preload?

                scenario.getScenarios(function(data) {
                    if(scenarioGame.scenarioList.length == 0){
                        $.each(data, function(key, scenario) {
                            scenarioGame.scenarioList.push(scenario);
                        })
                    }
                });
            };

            //return array of names of scenarios in scenarioList
            scenarioGame.scenarioListNames = function() {
                var arr = [];
                var i = 0;
                var len = scenarioGame.scenarioList.length;

                for(i; i < len; i++) {
                    arr.push(scenarioGame.scenarioList[i].name);
                }

                return arr;
            };

            // return true if game scenarioList contains a scenario with the name given, else return false
           scenarioGame.containsScenario = function(scenarioName) {
                if(scenarioGame.scenarioList) {
                    var i = 0;
                    var len = scenarioGame.scenarioList.length;
                    for(i; i<len; i++) {
                        if(scenarioGame.scenarioList[i].name === scenarioName) {
                            return true;
                        }
                    }
                }
                return false;
            };

            // get info of a scenario by scenarioId
            scenarioGame.getScenarioInfo = function(scenarioId) {

                $.each(scenarioGame.scenarioList, function(key, val) {
                    if(val._id === scenarioId) {
                        return val;
                    }
                });
            };

            return scenarioGame;
        }
    ]);

