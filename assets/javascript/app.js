var firebaseConfig = {
    apiKey: "AIzaSyAaI2m9pi4vHSG9qX4-_2VtgP7M3tRoy68",
    authDomain: "rps-multiplayer-e819c.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-e819c.firebaseio.com",
    projectId: "rps-multiplayer-e819c",
    storageBucket: "rps-multiplayer-e819c.appspot.com",
    messagingSenderId: "461944139523",
    appId: "1:461944139523:web:fd0636561bcbeb24d34336"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$(document).ready(function () {

    var playerOne = {
        name: "john",
        wins: 0,
        losses: 0
    }

    var playerTwo = {
        name: "sally",
        wins: 0,
        losses: 0
    }


    if (playerOne.name == -1) {
        $(".start").append(
            $("<button/>", {
                text: "Start Game",
                id: "start-btn",
                "data-toggle": "modal",
                "data-target": "#name-modal",
            }
            ));

    } else if (playerOne.name != -1 && playerTwo.name == -1) {
        $(".start").append(
            $("<button/>", {
                text: "Join Game",
                id: "start-btn",
                "data-toggle": "modal",
                "data-target": "#name-modal"
            }
            ));
        
    }

    $("#save").on("click", function () {
        if (playerOne.name == -1){
            playerOne.name = $("#player-name").val();
            $(".player").append("1: " + playerOne.name)
        } else {
            playerTwo.name = $("#player-name").val();
            $(".player").append("2: " + playerTwo.name)
        }


       
    })











});  //end doc ready