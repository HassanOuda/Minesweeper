
var time = 0;
var time_id;
var columns = 9;
var rows = 9;
var mineCount = 10;
var grid = document.getElementById("minefield");
var firstTouch = true;
var smiley;
var remaining = mineCount;

function buildGrid() {

    // Fetch grid and clear out old elements.
    grid = document.getElementById("minefield");
    grid.innerHTML = "";
	document.getElementById("flagCount").innerHTML = remaining;
	firstTouch = true;
	remaining = mineCount;
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
	tile.classList.add("adjacent");
    
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

function fillTiles (tile) {
	
	 if (tile.classList.contains("flag") || (!tile.classList.contains("hidden"))) { return; }
	 else
	 {
	tile.classList.remove("hidden");
	if (tile.style.adjacent == 1) {tile.classList.add("tile_1");}
	if (tile.style.adjacent == 2) {tile.classList.add("tile_2");}
	if (tile.style.adjacent == 3) {tile.classList.add("tile_3");}
	if (tile.style.adjacent == 4) {tile.classList.add("tile_4");}
	if (tile.style.adjacent == 5) {tile.classList.add("tile_5");}
	if (tile.style.adjacent == 6) {tile.classList.add("tile_6");}
	if (tile.style.adjacent == 7) {tile.classList.add("tile_7");}
	if (tile.style.adjacent == 8) {tile.classList.add("tile_8");}
 	if (tile.style.adjacent==0)
	{
		var areaF = areaAdjacent(tile);
		for (var i = 0; i < areaF.length; i++)
		{
			if (areaF[i].style.adjacent==0 || !areaF[i].classList.contains("hasMine"))
			{
				fillTiles(areaF[i]);
				document.getElementById("flagCount").innerHTML = areaF.length;
			}
		}
	}	
	 }
 }
function areaAdjacent(tile) //5     4,6,14,13,15
{
	var children = grid.children;
	var x=0;
	for (var i = 0; i <rows*columns;i++) {
		if (children[i] == tile) {
			x = i;
		}
	}
	var result = [];
	// traverse left
	if (x % columns != 0){	result.push(children[x-1]);	}	
	// traverse right
	if ((x+1) % columns != 0 )	{result.push(children[x+1]);}
	// traverse top
	if (x >= columns)	{result.push(children[x-9]);}
	// traverse bottom
	if (x < (rows*columns - columns)){result.push(children[x+9]);}
	// traverse upper left
	if (x % columns != 0 && x > columns)	{result.push(children[x-10]);}
	// traverse lower left
	if (x % columns != 0 && x < (rows*columns - columns)){result.push(children[x + 8]);}
	// traverse upper right
	if ((x+1) % columns != 0 && x >= columns){result.push(children[x -8]);}
	// traverse lower right
	if ((x+1) % columns != 0 && x < (rows*columns - columns))	{result.push(children[x +10]);}
	
	return result;
}


function handleTileClick(event) {

    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
		var x=0;
		var children = grid.children;
		for (var i = 0; i <rows*columns;i++) {
			if (children[i] == this) {
				x = i;
			}
		}
		if (firstTouch) {	
			smiley.classList.add("face_limbo");
			plantMines(this,x);
			fillTiles(this);
			//document.getElementById("flagCount").innerHTML = x;
		}
		else {
			if (!this.classList.contains("flag") && !this.classList.contains("tile_1")&& !this.classList.contains("tile_2")
				&& !this.classList.contains("tile_3")&& !this.classList.contains("tile_4")
			&& !this.classList.contains("tile_5")&& !this.classList.contains("tile_6")
			&& !this.classList.contains("tile_7")&& !this.classList.contains("tile_8"))
			{
				if (this.classList.contains("hasMine"))
				{
					this.classList.add("mine_hit");
					stopTimer();
					smiley.classList.add("face_lose");
					for (var i = 0; i <rows*columns;i++) {
						children[i].classList.remove("hidden");
						if (children[i].classList.contains("hasMine") && this!=children[i]) {
							children[i].classList.add("mine");
						}
						if (children[i].style.adjacent == 1) {children[i].classList.add("tile_1");}
						if (children[i].style.adjacent == 2) {children[i].classList.add("tile_2");}
						if (children[i].style.adjacent == 3) {children[i].classList.add("tile_3");}
						if (children[i].style.adjacent == 4) {children[i].classList.add("tile_4");}
						if (children[i].style.adjacent == 5) {children[i].classList.add("tile_5");}
						if (children[i].style.adjacent == 6) {children[i].classList.add("tile_6");}
						if (children[i].style.adjacent == 7) {children[i].classList.add("tile_7");}
						if (children[i].style.adjacent == 8) {children[i].classList.add("tile_8");}
							
					}
				}
				else{
					fillTiles(this);
					document.getElementById("flagCount").innerHTML = firstTouch;
					/* if (this.style.adjacent == 0) {this.classList.remove("hidden");}
					if (this.style.adjacent == 0 && this.classList.contains("hidden")) {this.classList.remove("hidden");}
					if (this.style.adjacent == 1) {this.classList.add("tile_1");}
					if (this.style.adjacent == 2) {this.classList.add("tile_2");}
					if (this.style.adjacent == 3) {this.classList.add("tile_3");}
					if (this.style.adjacent == 4) {this.classList.add("tile_4");}
					if (this.style.adjacent == 5) {this.classList.add("tile_5");}
					if (this.style.adjacent == 6) {this.classList.add("tile_6");}
					if (this.style.adjacent == 7) {this.classList.add("tile_7");}
					if (this.style.adjacent == 8) {this.classList.add("tile_8");}
 */				}
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
		if (this.classList.contains("flag")) {
			remaining =remaining+1;	
		}
		else {
			remaining =remaining-1;
		}
		this.classList.toggle("flag");
		document.getElementById("flagCount").innerHTML = remaining;
    }
}

function getRandomNumber(max)
{
	max = Math.floor(max);
    return Math.floor((Math.random() * max));
}

function plantMines(picked,index)
{
	var	minesPlanted = 0
	var ran;
	var children = grid.children;

    while (minesPlanted < mineCount)
    {
        ran = getRandomNumber(rows*columns);
		
        if (!children[ran].classList.contains("hasMine") && picked !=children[ran])
        {
			if (ran!=(index-1) && ran!=(index+1)&& ran!=(index-9)&& ran!=(index+9)&& ran!=(index-10)&& ran!=(index-8)&& ran!=(index+8)&& ran!=(index+10)) {
				children[ran].classList.add("hasMine");
				minesPlanted++;
			}
        }
    }
	//document.getElementById("flagCount").innerHTML = minesPlanted;
	scoreAdjacent();
}
function scoreAdjacent()
{
	var children = grid.children;
	for (var y = 0; y < rows*columns; y=y+columns) {
		for (var x = 0; x < columns; x++) {
			var cen = 0;
			children[x+y].style.adjacent = cen;
			if (!children[x+y].classList.contains("hasMine")) {
				var areaF = areaAdjacent(children[x+y],x+y);
				for (var f=0;f<areaF.length;f++) {
					if (areaF[f].classList.contains("hasMine")) {cen++;}
					//counter++;
				}
				if (cen != 0) {
					children[x+y].style.adjacent =cen; 
				}
				//children[x+y].style.adjacent = counter;
/*  				if (y == 0 && x==0)  { 
					if(children[x+y+1].classList.contains("hasMine")) {counter++;} //Right
					if(children[x+y+9].classList.contains("hasMine")) {counter++;} //Bottom
					if(children[x+y+10].classList.contains("hasMine")) {counter++;} //Bottom Right
				}
				else if (y==0 && x> 0 && x<(columns-1)) {
					if(children[x+y-1].classList.contains("hasMine")) {counter++;} //left
					if(children[x+y+1].classList.contains("hasMine")) {counter++;} //Right
					if(children[x+y+9].classList.contains("hasMine")) {counter++;} //Bottom
					if(children[x+y+8].classList.contains("hasMine")) {counter++;} //Bottom Left
					if(children[x+y+10].classList.contains("hasMine")) {counter++;} //Bottom Right
				}
				else if (y==0 && x==(columns-1)) {
					if(children[x+y-1].classList.contains("hasMine")) {counter++;} //left
					if(children[x+y+9].classList.contains("hasMine")) {counter++;} //Bottom
					if(children[x+y+8].classList.contains("hasMine")) {counter++;} //Bottom Left
				}
				else if (y>0 && x>0 && y<(rows*columns-9) && x < (columns-1)) {
					if(children[x+y-1].classList.contains("hasMine")) {counter++;} //left
					if(children[x+y+1].classList.contains("hasMine")) {counter++;} //Right
					if(children[x+y-9].classList.contains("hasMine")) {counter++;} //Top
					if(children[x+y+9].classList.contains("hasMine")) {counter++;} //Bottom
					if(children[x+y-10].classList.contains("hasMine")) {counter++;} //Top Left
					if(children[x+y-8].classList.contains("hasMine")) {counter++;} //Top Right
					if(children[x+y+8].classList.contains("hasMine")) {counter++;} //Bottom Left
					if(children[x+y+10].classList.contains("hasMine")) {counter++;} //Bottom Right
					
				}
				else if (x==0 && y>0 && y<(rows*columns-9)) {
					if(children[x+y+1].classList.contains("hasMine")) {counter++;} //Right
					if(children[x+y-9].classList.contains("hasMine")) {counter++;} //Top
					if(children[x+y+9].classList.contains("hasMine")) {counter++;} //Bottom
					if(children[x+y-8].classList.contains("hasMine")) {counter++;} //Top Right
					if(children[x+y+10].classList.contains("hasMine")) {counter++;} //Bottom Right	
				}
				else if (y>0 && y<(rows*columns-9) && x== (columns-1)) {
					if(children[x+y-1].classList.contains("hasMine")) {counter++;} //left
					if(children[x+y-9].classList.contains("hasMine")) {counter++;} //Top
					if(children[x+y+9].classList.contains("hasMine")) {counter++;} //Bottom
					if(children[x+y-10].classList.contains("hasMine")) {counter++;} //Top Left
					if(children[x+y+8].classList.contains("hasMine")) {counter++;} //Bottom Left
				}
				else if (y==(rows*columns-9) && x==0) {
					if(children[x+y+1].classList.contains("hasMine")) {counter++;} //Right
					if(children[x+y-9].classList.contains("hasMine")) {counter++;} //Top
					if(children[x+y-8].classList.contains("hasMine")) {counter++;} //Top Right
				}
				else if (y==(rows*columns-9) && x> 0 && x<(columns-1)) {
					if(children[x+y-1].classList.contains("hasMine")) {counter++;} //left
					if(children[x+y+1].classList.contains("hasMine")) {counter++;} //Right
					if(children[x+y-9].classList.contains("hasMine")) {counter++;} //Top
					if(children[x+y-10].classList.contains("hasMine")) {counter++;} //Top Left
					if(children[x+y-8].classList.contains("hasMine")) {counter++;} //Top Right
				}
				else if (y==(rows*columns-9) && x==(columns-1)) {
					if(children[x+y-1].classList.contains("hasMine")) {counter++;} //left
					if(children[x+y-9].classList.contains("hasMine")) {counter++;} //Top
					if(children[x+y-10].classList.contains("hasMine")) {counter++;} //Top Left				
				}
 				children[x+y].style.adjacent = counter; */
			}
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
    time_id = window.setInterval(onTimerTick, 1000);
}
function stopTimer() {
    window.clearInterval(time_id);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}