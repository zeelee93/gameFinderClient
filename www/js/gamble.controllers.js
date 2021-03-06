(function () {
    'use strict';

    angular
        .module('gamble')
        .controller('gambleController', gambleController);

    gambleController.$inject = ['userService', 'gameService', '$q'];
    function gambleController(userService, gameService, $q) {

        var gambleVm = this;
        var thirdRankTeam = '';
        var team = '';
        
        gambleVm.user = userService.getUser();
        gambleVm.league = userService.getUser().league
        gambleVm.matchOfTheWeek = {};        

        gambleVm.getMatchOfTheWeek = getMatchOfTheWeek;
        gambleVm.setPredictionAwayTeam = setPredictionAwayTeam;
        gambleVm.setPredictionHomeTeam = setPredictionHomeTeam;


        function setPredictionAwayTeam() {
            gambleVm.user.prediction = gambleVm.matchOfTheWeek.awayTeamName;
            userService.updateUser(gambleVm.user);
        }

        function setPredictionHomeTeam() {
            gambleVm.user.prediction = gambleVm.matchOfTheWeek.homeTeamName;
            userService.updateUser(gambleVm.user);
        }

        function getMatchOfTheWeek() {
            var games = [];
            var teamname = team;
            console.log('teamname (matchOfTheWeek) : ', teamname);
            console.log(gambleVm.league);
            gameService
                .getGames(gambleVm.league)
                .then(function (response) {
                    games = response.data.fixtures;
                    var length = games.length;

                    for (var i = 0; i < length; i++) {
                        if (games[i].status == 'SCHEDULED') {
                            if (games[i].awayTeamName == teamname || games[i].homeTeamName == teamname) {
                                gambleVm.matchOfTheWeek = games[i];
                                console.log(gambleVm.matchOfTheWeek);
                                console.log(gambleVm.matchOfTheWeek._links.self.href);
                                break;
                            }
                        }
                    }
                })
        }

        //Setting an arbitrary team each week for the 'match of the week' - find better way to do this later...
        function setTeamName() {
            switch (gambleVm.league) {
                case 'English Premier League': team = 'Arsenal FC';
                    break;
                case 'Bundesliga': team = 'FC Bayern München';
                    break;
                case 'Primera Division': team = 'FC Barcelona';
                    break;
                default: team = 'Something wrong happened in switch statement in gamble.controllers.js';
            }
            console.log('setTeamName() : ', team);
        }

        function getThirdRankTeam() {
            gameService.getStandings(gambleVm.league).then(function (response) {
                var data = response.standing;
                thirdRankTeam = data[2].teamName;
                console.log('thirdRankTeam : ', thirdRankTeam);
                return thirdRankTeam;
            })
        }


        activate();

        ////////////////

        function activate() {
            getThirdRankTeam();
            setTeamName();
            gambleVm.getMatchOfTheWeek();
        }


    }
})();