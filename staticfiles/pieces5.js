let DEBUG = false; 
let SHOW_INFLUENCE = true;
let cells = {}
const ATTACK = "#ff0000"
const MOVE = "#ffff00"
const SUPPORT = "#0000ff"
const NONE=""


function toggleShowInfluence() { 
    SHOW_INFLUENCE =  ! SHOW_INFLUENCE;
}


function toggleDebugState() {
    DEBUG =  ! DEBUG;
    if ( DEBUG === true ) {
        for ( let key in cells ) {
            cells[key].showDebugInfo()
        }
    } else if ( DEBUG === false ) { 
        for ( let key in cells ) {
            cells[key].hideDebugInfo()
        }
    }
}

class Cell {
    constructor(id, size, mainClr, subClr, x, y, w, h, row, col, number, letter, ax, ay) {
        this.id = id;
        this.size = size;
        this.mainClr = mainClr;
        this.subClr = subClr;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.row = row;
        this.col = col;
        this.number = number;
        this.letter = letter;
        this.ax = ax; // ancore point for a piece
        this.ay = ay; // ancore point for a piece
        this.blackInfluence = 0;
        this.whiteInfluence = 0;
        this.whoIsOnThisCell = NONE; 
    }
    getWhoIsOnThisCell() { 
        return this.whoIsOnThisCell
    }
    setPieceOnThisCell(pieceId) {
        this.whoIsOnThisCell = pieceId
        if ( DEBUG === true ) {
            this.showDebugInfo();
        }
    }
    killPiece(incomingPieceId) {
        // console.log('killPiece in ' + incomingPieceId + " out " + this.whoIsOnThisCell)
        let html =         document.getElementById("deadPieces").innerHTML
        html += pieces[this.whoIsOnThisCell].unicode + "<br/>"

        document.getElementById("deadPieces").innerHTML = html


        d3.select("#P" + this.whoIsOnThisCell).remove();
        this.setPieceOnThisCell(incomingPieceId)
    }

    resetBG() {
      d3.select("#" + this.id).attr('fill', this.mainClr)
    }
    showPossible(colorToChangeTo) { 
        if ( SHOW_INFLUENCE === true ) {
      d3.select("#" + this.id).attr('fill', colorToChangeTo)
        }
    }
    getAncoreXY() { 
      return {x: this.ax, y: this.ay }
    }
    getRowCol() { 
      return {row: this.row, col: this.col }
    }
    hideDebugInfo() {
        d3.select("#RC" + this.id).text("");
        d3.select("#BI" + this.id).text("");        
        d3.select("#WHO" + this.id).text("");
        d3.select("#WI" + this.id).text("");
    }

    showDebugInfo() {

        const rc = this.id.replace("id", "");
        d3.select("#RC" + this.id).text(rc);
        d3.select("#BI" + this.id).text(this.blackInfluence);
        d3.select("#WI" + this.id).text(this.whiteInfluence);
        d3.select("#WHO" + this.id).text(this.whoIsOnThisCell);

    }


    addToBlackInfluence() {
        this.blackInfluence++;
        if (DEBUG !== undefined && DEBUG === true) {
          d3.select("#BI" + this.id).text(this.blackInfluence);
        }
      }
    addToWhiteInfluence() {
      this.whiteInfluence++;
      //console.log("atwi " + this.id + " and " + this.whiteInfluence)

      if (DEBUG !== undefined && DEBUG === true) {
        d3.select("#WI" + this.id).text(this.whiteInfluence);
      }
    }

    removeFromWhiteInfluence() {
      this.whiteInfluence--;
      //console.log("atwi " + this.id + " and " + this.whiteInfluence)

      if (DEBUG !== undefined && DEBUG === true) {
        d3.select("#WI" + this.id).text(this.whiteInfluence);
      }
    }

    removeFromBlackInfluence() {
      this.whiteInfluence--;
      //console.log("atwi " + this.id + " and " + this.whiteInfluence)

      if (DEBUG !== undefined && DEBUG === true) {
        d3.select("#BI" + this.id).text(this.blackInfluence);
      }
    }
}

function makeCells() {
    let myX = 0
    let myY = 0
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8']
    let LoL = []
    colorId = 0
    for (let row = 0; row < 8; row++) {
        LoL.push([])
        myX = 0
        colorId++
        for (let col = 0; col < 8; col++) {
            const id = col + "_" + row
            let mainClr;
            let subClr;
            if (colorId % 2 == 0) {
                mainClr = LIGHT_CELL
                subClr = DARK_CELL
            } else {
                mainClr = DARK_CELL
                subClr = LIGHT_CELL
            }
            let cell = new Cell("id" + id,size, mainClr,subClr,myX,myY,size,size,row,col,numbers[row],letters[col],myX + (size / 2),myY + (size / 2))
            colorId++
            myX += size
            cells[cell.id] = cell
        }
        myY += size
    }
}

const BLACK="BLACK"
const WHITE="WHITE"
const KING = "KING"
const ROOK = "ROOK"
const KNIGHT = "KNIGHT"
const BISHOP = "BISHOP"
const QUEEN = "QUEEN"
const PAWN = "PAWN"

const pawn_black_move = [{
  'col':0, 
  'row':1
}
]
const pawn_white_move = [{
  'col':0, 
  'row':-1
}
]

const bishop_attack = [{
  'col':-1, 
  'row':-1
},
{
  'col':1, 
  'row':-1
},
{
  'col':-1, 
  'row':1
},
{
  'col':1, 
  'row':1
}
]

const rook_attack = [{
  'col':0, 
  'row':-1
},
{
  'col':0, 
  'row':1
},
{
  'col':-1, 
  'row':0
},
{
  'col':1, 
  'row':0
}
]
const royal_attack = [{
  'col':0, 
  'row':-1
},
{
  'col':0, 
  'row':1
},
{
  'col':-1, 
  'row':0
},
{
  'col':1, 
  'row':0
},
{
  'col':-1, 
  'row':-1
},
{
  'col':1, 
  'row':-1
},
{
  'col':-1, 
  'row':1
},
{
  'col':1, 
  'row':1
}
]

const knight_attack = [{
  'col':-1, 
  'row':-2
},
{
  'col':1, 
  'row':-2
},
{
  'col':2, 
  'row':-1
},
{
  'col':2, 
  'row':1
},
{
  'col':1, 
  'row':2
},
{
  'col':-1, 
  'row':2
},
{
  'col':-2, 
  'row':1
},
{
  'col':-2, 
  'row':-1
}
]

class Piece {
  constructor (id, color, type, size, unicode, col, row, loop, attack, movement ) {
    this.id = id;
    this.color = color;
    this.type = type;
    this.size = size;
    this.unicode = unicode;
    this.col = col;
    this.row = row;
    this.loop = loop;
    this.attack = attack;
    this.movement = movement;
    this.hasNeverMoved = true;
    this.sx = 0 // starting x - used to placement 
    this.sy = 0 // starting x - used to placement 
  }
  getIdOfTheCellThatThisIsOn() { 
    return "id" + this.col + "_" + this.row;
  }
  get_possible_moves() { 
    let possible = {};
    this.movement.forEach((colrow) => {
        let r = this.row;
        let c = this.col;
        let keepAlive = true;
        for ( let i=0; i < this.loop; i++) {
            if ( keepAlive === true ) {
                r += colrow['row'];
                c += colrow['col'];
                if ( r > -1 && r < 8 && c > -1 && c < 8 ) {
                    const key = "id" + c + "_" + r;
                    const cell = cells[key];
                    const otherPieceId = cell.getWhoIsOnThisCell()
                    if ( pieces.hasOwnProperty(otherPieceId)) {
                        if  ( this.color === pieces[otherPieceId].color) {
                            possible[key] = SUPPORT;
                        } else {
                            possible[key] = ATTACK;
                        }
                        keepAlive = false;
                    } else {
                        possible[key] = MOVE
                    }
                }
            }
        }
    })
    return possible
  }
}

const pieces = {
  1: new Piece(1,BLACK, ROOK, 50,'\u265C', 0,0, 7,rook_attack, rook_attack),
  2: new Piece(2,BLACK, KNIGHT, 50,'\u265E', 1,0, 1, knight_attack, knight_attack),
  3: new Piece(3,BLACK, BISHOP, 50,'\u265D', 2,0,7, bishop_attack, bishop_attack ),
  4: new Piece(4,BLACK, KING, 50,'\u265A', 4,0 ,1,  royal_attack, royal_attack),
  5: new Piece(5,BLACK, QUEEN, 50,'\u265B', 3,0 , 7, royal_attack, royal_attack),
  6: new Piece(6,BLACK, BISHOP, 50,'\u265D', 5,0, 7,bishop_attack, bishop_attack ),
  7: new Piece(7,BLACK, KNIGHT, 50,'\u265E', 6,0 ,1,  knight_attack, knight_attack),
  8: new Piece(8,BLACK, ROOK, 50,'\u265C', 7,0 , 7, rook_attack, rook_attack),
  9: new Piece(9,BLACK, PAWN, 50,'\u265F', 0,1 , 2, bishop_attack, pawn_black_move),
  10: new Piece(10,BLACK, PAWN, 50,'\u265F', 1,1 , 2, bishop_attack, pawn_black_move),
  11: new Piece(11,BLACK, PAWN, 50,'\u265F', 2,1 , 2, bishop_attack, pawn_black_move),
  12: new Piece(12,BLACK, PAWN, 50,'\u265F', 3,1 , 2, bishop_attack, pawn_black_move),
  13: new Piece(13,BLACK, PAWN, 50,'\u265F', 4,1 , 2, bishop_attack, pawn_black_move),
  14: new Piece(14,BLACK, PAWN, 50,'\u265F', 5,1, 2, bishop_attack, pawn_black_move ),
  15: new Piece(15,BLACK, PAWN, 50,'\u265F', 6,1 ,2,  bishop_attack, pawn_black_move),
  16: new Piece(16,BLACK, PAWN, 50,'\u265F', 7,1 ,2,  bishop_attack, pawn_black_move),
  //
  17: new Piece(17,WHITE, ROOK, 50,'\u2656', 0,7 ,7,  rook_attack, rook_attack),
  18: new Piece(18,WHITE, KNIGHT, 50,'\u2658', 1,7 , 1, knight_attack, knight_attack),
  19: new Piece(19,WHITE, BISHOP, 50,'\u2657', 2,7, 7, bishop_attack, bishop_attack),
  20: new Piece(20,WHITE, KING, 50,'\u2654', 4,7, 1, royal_attack, royal_attack),
  21: new Piece(21,WHITE, QUEEN, 50,'\u2655', 3,7, 7, royal_attack, royal_attack),
  22: new Piece(22,WHITE, BISHOP, 50,'\u2657', 5,7, 7, bishop_attack, bishop_attack),
  23: new Piece(23,WHITE, KNIGHT, 50,'\u2658', 6,7 ,1,  knight_attack, knight_attack),
  24: new Piece(24,WHITE, ROOK, 50,'\u2656', 7,7 , 7, rook_attack, rook_attack),
  25: new Piece(25,WHITE, PAWN, 50,'\u2659', 0,6 ,2,  bishop_attack, pawn_white_move),
  26: new Piece(26,WHITE, PAWN, 50,'\u2659', 1,6 ,2,  bishop_attack, pawn_white_move),
  27: new Piece(27,WHITE, PAWN, 50,'\u2659', 2,6 , 2, bishop_attack, pawn_white_move),
  28: new Piece(28,WHITE, PAWN, 50,'\u2659', 3,6 , 2, bishop_attack, pawn_white_move),
  29: new Piece(29,WHITE, PAWN, 50,'\u2659', 4,6 , 2, bishop_attack, pawn_white_move),
  30: new Piece(30,WHITE, PAWN, 50,'\u2659', 5,6 , 2, bishop_attack, pawn_white_move),
  31: new Piece(31,WHITE, PAWN, 50,'\u2659', 6,6 ,2,  bishop_attack, pawn_white_move),
  32: new Piece(32,WHITE, PAWN, 50,'\u2659', 7,6,2 ,  bishop_attack, pawn_white_move )
}