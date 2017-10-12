
var time = 0;
var columns = 9;
var rows = 9;
var mineCount = 10;
var grid = document.getElementById("minefield");
var firstTouch = true;
var smiley;
var remaining = mineCount;
var gridAdj= [];

function buildGrid() {

    // Fetch grid and clear out old elements.
    grid = document.getElementById("minefield");
    grid.innerHTML = "";
	document.getElementById("flagCount").innerHTML = remaining;
	firstTouch = true;
	remaining = mineCount;
	gridAdj= [];
    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
			
        }
    }
    
    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";
}

function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks

    return tile;
}

function startGame() {
    buildGrid();
    startTimer();
}

function smileyDown() {
    smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function handleTileClick(event) {

    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
		if (firstTouch) {
			plantMines(this);
			//index = grid.indexOf(this);
			document.getElementById("flagCount").innerHTML = 2;
			if (gridAdj[index] == 1) {this.classList.add("tile_1");}
		}
		else {
			if (!this.classList.contains("flag") || !this.classList.contains("tile_1")|| !this.classList.contains("tile_2")
				|| !this.classList.contains("tile_3")|| !this.classList.contains("tile_4")
			|| !this.classList.contains("tile_5")|| !this.classList.contains("tile_6")
			|| !this.classList.contains("tile_7")|| !this.classList.contains("tile_8"))
			{
				if (this.classList.contains("hasMine"))
				{
					this.classList.toggle("mine_hit");
					smiley.classList.add("face_lose");
				}
			}
		}
		firstTouch = false;
		//document.getElementById("flagCount").innerHTML = firstTouch;
    }
    // Middle Click
    else if (event.which === 2) {
        //TODO try to reveal adjacent tiles
    }
    // Right Click
    else if (event.which === 3) {
        //TODO toggle a tile flag
		this.classList.toggle("flag");
		remaining =remaining-1;
		document.getElementById("flagCount").innerHTML = remaining;
    }
}

function getRandomNumber(max)
{
	max = Math.floor(max);
    return Math.floor((Math.random() * max));
}

function plantMines(picked)
{
	var	minesPlanted = 0
	var x;
	var children = grid.children;

    while (minesPlanted < mineCount)
    {
        x = getRandomNumber(rows*columns);

        if (!children[x].classList.contains("hasMine") || picked !=children[x])
        {
            children[x].classList.add("hasMine");
            minesPlanted++;
        }
    }

	scoreAdjacent();
}
function scoreAdjacent()
{
	var children = grid.children;
	gridAdj =[]
	for (var y = 0; y < rows*columns; y=y+columns) {
		for (var x = 0; x < columns; x++) {
			var counter = 0;
			if (!children[x+y].classList.contains("hasMine")) {
			//if (y == 0 || y==rows*columns-1)  {//will fail for hard 
			
			//if(children[x+y+1].classList.contains("hasMine")) {counter++;} //Right
			//if(children[x+y+9].classList.contains("hasMine")) {counter++;} //Bottom
			//}
			//if (x==0 || x==columns-1) {
				
			//}
				if (y>0 && x>0 && y<(rows*columns-9) && x < (columns-1)) {
					if(children[x+y-1].classList.contains("hasMine")) {counter++;} //left
					if(children[x+y+1].classList.contains("hasMine")) {counter++;} //Right
					if(children[x+y-9].classList.contains("hasMine")) {counter++;} //Top
					if(children[x+y+9].classList.contains("hasMine")) {counter++;} //Bottom
					if(children[x+y-10].classList.contains("hasMine")) {counter++;} //Top Left
					if(children[x+y-8].classList.contains("hasMine")) {counter++;} //Top Right
					if(children[x+y+8].classList.contains("hasMine")) {counter++;} //Bottom Left
					if(children[x+y+10].classList.contains("hasMine")) {counter++;} //Bottom Right
					
/* 					
					if (counter ==1) { children[x+y].classList.add("tile_1")}
					if (counter ==2) { children[x+y].classList.add("tile_2")}
					if (counter ==3) { children[x+y].classList.add("tile_3")}
					if (counter ==4) { children[x+y].classList.add("tile_4")}
					if (counter ==5) { children[x+y].classList.add("tile_5")}
					if (counter ==6) { children[x+y].classList.add("tile_6")}
					if (counter ==7) { children[x+y].classList.add("tile_7")}
					if (counter ==8) { children[x+y].classList.add("tile_8")} */
				}
				//else {
					
					//children[x+y].classList.remove("hidden");
					//children[x+y].classList.add("tile");
				//}
				gridAdj[x+y] = counter;
			}
			//children[x+y].classList.add("hidden");
		}
    }

}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;

    //TODO implement me
	if (difficulty == 0) {
		columns = 9;
		rows = 9;
		mineCount = 10;
		remaining = mineCount;
	}
	else if (difficulty == 1) {
		columns = 16;
		rows = 16;
		mineCount = 40;
		remaining = mineCount;
	}
	else if (difficulty == 2) {
		columns = 30;
		rows = 16;
		mineCount = 99;
		remaining = mineCount;
	}
}

function startTimer() {
    timeValue = 0;
    window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}