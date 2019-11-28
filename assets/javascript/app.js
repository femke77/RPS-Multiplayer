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
var numChildren = 0;

var playerOne = {
    name: "",
    wins: 0,
    losses: 0
}

var playerTwo = {
    name: "",
    wins: 0,
    losses: 0
}


connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

connectionsRef.on("value", function (snap) {
    numChildren = snap.numChildren();
    $(".chat").text(numChildren);
    
    if (numChildren === 1) {
       
    
    } else if (numChildren === 2 ) {
       
    
    } else {
        $(".chat").text("2 are playing");
    }
    

})

//-------------------------------------------------------





    
$("#save-btn").on("click", function (event) {
    event.preventDefault();
    if (numChildren == 1) {
        playerOne.name = $("#player-name").val();
        $(".player").append(": " + playerOne.name)
    } else {
        playerTwo.name = $("#player-name").val();
        $(".player").append(": " + playerTwo.name)

    }

});










