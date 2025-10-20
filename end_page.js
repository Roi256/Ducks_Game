window.addEventListener("load", function() {
    var player_won = sessionStorage.getItem("player_won");  
    this.console.log(player_won);

    if(Number(player_won) === 1) {
        this.document.getElementById("title").innerText = "WINNER WINNER GOOSE DINNER";
    }
    else {
        this.document.getElementById("title").innerText = "WINNER WINNER DUCK DINNER";
    }
    this.document.getElementById("title").className += " title";

    document.getElementById("win_gif").style.backgroundImage = "url('Media/" + player_won +"_win.gif ')";
})