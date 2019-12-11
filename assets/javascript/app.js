/** TODO:
 *     Control play with button disabling
 *     adding a name will have numChildren connections listener go off again...can be fixed w button disabling
 * -----------------------------------------------------
 *     
 *     Make a nicer element for player scores
 *     Make the whole thing look nicer
 */

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
var connectionsRef = database.ref("/connections/");
var connectedRef = database.ref(".info/connected");

var numChildren = 0;

var player = {
    key: "",
    name: "",
    guess: "",
    wins: 0,
    losses: 0,
    ties: 0
}

var opponent = {
    key: "",
    name: "",
    guess: ""
}

//start game with no access to buttons until name input. Player can't chose R P S or chat
disableRPS();

//  .info/connected (t/f). This function listens for connection/disconnection and assigns unique key in chronological order
connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);      
        player.key = con.getKey(); 
        console.log("player key: " + player.key)
        con.onDisconnect().remove().then(function(){
              //removes the game entry and chat messages for the player when disconnected
              database.ref("/game/" + player.key).onDisconnect().remove();
              database.ref("/messages/").onDisconnect().remove();
        });       
    }
});

//  /connections   This function listens for number of connections present and stores the uid
connectionsRef.on("value", function (snap) {
    numChildren = snap.numChildren();
    console.log("num child connections: " + numChildren)
   
    if (numChildren == 2){
        $(".game-output").html("Ready to play! Make your choice. <br/>")
    } else if (numChildren == 1){
        $(".game-output").html("Waiting for opponent... <br/>")
    } 
});

// listen for player name 
database.ref("/connections/"  + player.key).on("child_changed", function(snap){
    player.name = snap.val().name; 
});

// listens for children of game and when 2 present (both users have guessed) provides a list of key/guess pairs with which to score
database.ref("/game/").on("value", function(snap){
    if(snap.numChildren() == 2){
        console.log("2 guesses in db - ready to score")
        var list = [];
        snap.forEach(function(child){           
                list.push({
                    key: child.key,
                    guess: child.val().guess
                });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        });
  
        scoring(list);
        
       
    }
});

function scoring(list){
    //first figure out which player/guess is which and assign the opponent's key and guess
    if (list[0].key === player.key){
        opponent.guess = list[1].guess;
        opponent.key = list[1].key;
    } else {
        opponent.key = list[0].key
        opponent.guess = list[0].guess;
    }

    //then figure out who won/lost/tied. Output the results and increment the scores
    if ((player.guess === "rock" && opponent.guess === "scissors") ||
        (player.guess === "scissors" && opponent.guess === "paper") ||
        (player.guess === "paper" && opponent.guess === "rock")) {
        player.wins++;
        $(".game-output").append("Opponent chose " + opponent.guess + "<br/>")
        $(".game-output").append("You won! <br/>")
        $("#wins").text("Wins: " + player.wins)
    } else if (player.guess === opponent.guess) {
        player.ties++;
        $(".game-output").append("Opponent chose " + opponent.guess + "<br/>")
        $(".game-output").append("You tied! <br/>")
        $("#ties").text("Ties " + player.ties)
    } else {
        player.losses++;
        $(".game-output").append("Opponent chose " + opponent.guess + "<br/>")
        $(".game-output").append("You lost! <br/>")
        $("#losses").text("Losses: " + player.losses)
    }
    //remove game choice
    database.ref("/game/" + player.key).remove();
}

// gets user name and stores in database/outputs to page
$("#save-btn").on("click", function (event) {
    event.preventDefault();
    
    var name = $("#player-name").val().trim();
    if (name.length > 0) {
        player.name = name;  
        if (numChildren < 3){
             $(".player").append(": " + player.name)
             connectionsRef.child(player.key).set({                
                name: player.name
            })
            $("#save-btn").prop("disabled", true);
        } else {
            $(".game-output").text("Two players are currently playing. Try again later.");
        }        
    } else {
        $(".game-output").text("Enter a name of at least 1 character, please.")
    }
    $("form").trigger("reset");
    enableRPS();

});

function disableRPS(){
    $("#rock-btn").prop("disabled", true);
    $("#paper-btn").prop("disabled", true);
    $("#scissors-btn").prop("disabled", true);
    $("#msg-btn").prop("disabled", true);
}

function enableRPS(){
    $("#rock-btn").prop("disabled", false);
    $("#paper-btn").prop("disabled", false);
    $("#scissors-btn").prop("disabled", false);
    $("#msg-btn").prop("disabled", false);
}

                                                                                                                                                                                                                                                                                 
$("#rock-btn").on("click", function () {
    $(".game-output").append("You chose rock. <br/>")
    player.guess = "rock";
    database.ref("/game/" + player.key).set({        
        guess: player.guess
    }); 

});

$("#paper-btn").on("click", function () {
    player.guess = "paper"
    $(".game-output").append("You chose paper. <br/>");
    database.ref("/game/" + player.key).set({       
        guess: player.guess
    });

});

$("#scissors-btn").on("click", function () {
    player.guess = "scissors";
    $(".game-output").append("You chose scissors. <br/>")
    database.ref("/game/"+ player.key).set({
        guess: player.guess
    });

});


//--------MESSAGING--------------------------------

var messageRef = firebase.database().ref("/messages/");

$("#msg-btn").on("click", function(event){

    event.preventDefault();
    var msg = $("#text-area").val().trim();
    messageRef.push((player.name + ": " + msg))
    $("form").trigger("reset");
});


messageRef.on("child_added", function(snap){
    $(".chat").append(snap.val() + "<br/>")
});


//error - sometimes the messages are not getting the correct name



