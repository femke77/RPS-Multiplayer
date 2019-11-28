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

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var gameRef = database.ref("game");

var numChildren = 0;
var guess;
var key;

var playerOne = {
    name: "",
    id: null,
    wins: 0,
    losses: 0
}

var playerTwo = {
    name: "",
    id: null,
    wins: 0,
    losses: 0
}

//start game with no access to buttons until two players ready
// disableRPS();

//  .info/connected (t/f)
connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);      
        key = con.getKey(); 
        con.onDisconnect().remove().then(function(){
              //removes the game after all players disconnect
              gameRef.remove();
        });
        
    }

});


//  /connections
connectionsRef.on("value", function (snap) {
    numChildren = snap.numChildren();
    $(".chat").text(numChildren);

    if (numChildren == 2){
        //this is where we will enable the rps buttons for play
        $(".game-output").html("Ready to play! Make your choice. <br/>")
    } else if (numChildren == 1){
        $(".game-output").html("Waiting for opponent... <br/>")
    }


});



 
$("#save-btn").on("click", function (event) {
    event.preventDefault();
    //this player 1 player two stuff is not needed and must be removed to just "player"
    
    var name = $("#player-name").val().trim();
    if (name.length > 0) {
        if (numChildren == 1) {
            playerOne.name = name;
           
            $(".player").append(": " + playerOne.name)
            gameRef.child(key).set({
                
                name: playerOne.name
            })
            $("#save-btn").prop("disabled", true);
        } else if (numChildren == 2) {
            playerTwo.name = name;
            gameRef.child(key).set({
                
                name: playerTwo.name
            })
            $(".player").append(": " + playerTwo.name)
            $("#save-btn").prop("disabled", true);


        } else {
            $(".game-output").text("Two players are currently playing. Try again later.");
        }
        
    } else {
        $(".game-output").text("Enter a name of at least 1 character, please.")
    }

    $("form").trigger("reset");
    
  
    
    
});

function disableRPS(){
    $("#rock-btn").prop("disabled", true);
    $("#paper-btn").prop("disabled", true);
    $("#scissors-btn").prop("disabled", true);
}

function enableRPS(){
    $("#rock-btn").prop("disabled", false);
    $("#paper-btn").prop("disabled", false);
    $("#scissors-btn").prop("disabled", false);
}




$("#rock-btn").on("click", function () {
    $(".game-output").append("you chose rock")
    guess = "r";
    gameRef.child(key).update({
        
        guess: guess
       
    });
  
//    disableRPS()
});

$("#paper-btn").on("click", function () {
    guess = "p"
    $(".game-output").append("you chose paper <br/>");
    gameRef.child(key).update({
        
        guess: guess
       
    });
//    disableRPS()
});

$("#scissors-btn").on("click", function () {
    guess = "c";
    $(".game-output").append("you chose scissors <br/>")
    gameRef.child(key).update({
        
        guess: guess
       
    });
//    disableRPS()
});

//tie this logic to the rps buttons, score the game and reenable buttons
if ((guess === "r") || (guess === "p") || (guess === "s")) {

    if ((guess === "r" && computerGuess === "s") ||
        (guess === "s" && computerGuess === "p") ||
        (guess === "p" && computerGuess === "r")) {
        wins++;
    } else if (guess === computerGuess) {
        ties++;
    } else {
        losses++;
    }

}






