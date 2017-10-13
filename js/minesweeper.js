
var time_id;
var timeValue=0;
var columns;
var rows;
var mineCount;
var grid;
var firstTouch;
var smiley;
var remaining;

function buildGrid() {

    // Fetch grid and clear out old elements.
    grid = document.getElementById("minefield");
    grid.innerHTML = "";
	firstTouch = true;
	setDifficulty();
	remaining = mineCount;
	document.getElementById("flagCount").innerHTML = remaining;
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
	//tile.classList.add("adjacent");
	tile.style.adjacent = 0;
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks

    return tile;
}

function startGame() {
    buildGrid();
    startTimer();
	smiley.classList.remove("face_lose");
	smiley.classList.remove("face_win");
	document.getElementById("win").innerHTML = "";
}

function smileyDown() {
    smiley = document.getElementById("smiley");
	smiley.classList.add("face_down");	
}
function LimboDown() {
	smiley = document.getElementById("smiley");
    smiley.classList.add("face_limbo");
}
function smileyUp() {
    smiley = document.getElementById("smiley");
	smiley.classList.remove("face_down");	
	smiley.classList.remove("face_limbo");
}

function revealBoard()
{
	var children = grid.children;
	for (var i = 0; i <rows*columns;i++) {
		children[i].classList.remove("hidden");
		if (children[i].classList.contains("hasMine") && !children[i].classList.contains("mine_hit")&& !children[i].classList.contains("flag")) {
			children[i].classList.add("mine");
		}
		if (children[i].classList.contains("hasMine") && children[i].classList.contains("flag")) {
			children[i].classList.add("mine_marked");
		}
		if (children[i].style.adjacent === 1) {children[i].classList.add("tile_1");}
		if (children[i].style.adjacent === 2) {children[i].classList.add("tile_2");}
		if (children[i].style.adjacent === 3) {children[i].classList.add("tile_3");}
		if (children[i].style.adjacent === 4) {children[i].classList.add("tile_4");}
		if (children[i].style.adjacent === 5) {children[i].classList.add("tile_5");}
		if (children[i].style.adjacent === 6) {children[i].classList.add("tile_6");}
		if (children[i].style.adjacent === 7) {children[i].classList.add("tile_7");}
		if (children[i].style.adjacent === 8) {children[i].classList.add("tile_8");}
	}
}
function isGameOver()
{
	var children = grid.children;
	var over = true;
	for (var i = 0; i <rows*columns;i++) {
		if (children[i].classList.contains("hidden") && !children[i].classList.contains("hasMine"))
		{
			over = false;
		}
	}
	return over;
}

function fillTiles (tile,isLeft) {
	if (tile.classList.contains("flag") || (isLeft && !tile.classList.contains("hidden"))) { return; }

	if (tile.classList.contains("hasMine"))
	{
		tile.classList.add("mine_hit");
		stopTimer();
		smiley.classList.add("face_lose");
		revealBoard();
		return;
	}
	else if (!tile.classList.contains("hidden") && !isLeft) //Already revealed
	{
		var mines = areaAdjacent(tile);
		var flaggedMines = [];
		for (var i = 0; i < mines.length; i++)
		{
			if (mines[i].classList.contains("flag")) { flaggedMines.push(mines[i]);}
		}
		if (tile.style.adjacent === flaggedMines.length)
		{
			for (var i = 0; i < mines.length; i++)
			{
				if (!mines[i].classList.contains("flag") && mines[i].classList.contains("hidden")) {
					
					fillTiles(mines[i], true);}
			}
		}
	}
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
				if (!areaF[i].classList.contains("hasMine"))
				{
					fillTiles(areaF[i],true);
				}
			}
		}
		if (isGameOver())
		{
			smiley.classList.add("face_win");
			revealBoard();
			stopTimer();
			document.getElementById("win").innerHTML = "YOU WIN!!!";
			return;
		}		
	}
 }
function areaAdjacent(tile) //8,17,26,35,44,53
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
	if (x >= columns)	{result.push(children[x-columns]);}
	// traverse bottom
	if (x < (rows*columns - columns)){result.push(children[x+columns]);}
	// traverse upper left
	if (x % columns != 0 && x > columns)	{result.push(children[x-columns-1]);}
	// traverse lower left
	if (x % columns != 0 && x < (rows*columns - columns)){result.push(children[x + columns-1]);}
	// traverse upper right
	if ((x+1) % columns != 0 && x >= columns){result.push(children[x -columns+1]);}
	// traverse lower right
	if ((x+1) % columns != 0 && x < (rows*columns - columns))	{result.push(children[x +columns+1]);}
	
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
			
			plantMines(this,x);
			fillTiles(this,true);
		}
		else 
		{
			if (this.style.adjacent==null)
			{
				//document.getElementById("flagCount").innerHTML = "No";
			}
			fillTiles(this,true);
		}
		firstTouch = false;
	}
    // Middle Click
    else if (event.which === 2) {
        //TODO try to reveal adjacent tiles
		if (!this.classList.contains("hidden"))
		{
			fillTiles(this,false);
		}
	}
    // Right Click
    else if (event.which === 3) {
        //TODO toggle a tile flag
		if (this.classList.contains("hidden")) {
			if (this.classList.contains("flag")) {
				remaining =remaining+1;	
			}
			else if (remaining >=0) {
				remaining =remaining-1;
			}
			this.classList.toggle("flag");
			document.getElementById("flagCount").innerHTML = remaining;
		}
		
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
			if (ran!=(index-1) && ran!=(index+1)&& ran!=(index-columns)&& ran!=(index+columns)&& ran!=(index-columns-1)&& ran!=(index-columns+1)&& ran!=(index+columns-1)&& ran!=(index+columns+1)) {
				children[ran].classList.add("hasMine");
				minesPlanted++;
			}
        }
    }
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
				}
				if (areaF.length > 0) {
					children[x+y].style.adjacent =cen; 
				}
				else {
					children[x+y].style.adjacent =0; 
				}
			}
			else
			{
				children[x+y].style.adjacent =0; 
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
