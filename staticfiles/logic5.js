const DARK_CELL = "#e0e0e0"
const LIGHT_CELL = "#11DD11"
let POSSIBLE = {}

function addCellIntoDom(cell) {
    let c = d3.select('#chessboard')
        .append('svg:g')
        .attr('transform', 'translate(' + cell.x + ',' + cell.y + ')')

    let background = c.append('svg:rect')
        .attr('id', cell.id)
        .attr('fill', cell.mainClr)
        .attr('fill-opacity', 1.0)
        .attr('stroke-width', 4)
        .attr('width', cell.size)
        .attr('height', cell.size)

    if (cell.row == 7) {
        let letter = c.append('svg:text')
            .text(function(d) {
                return cell.letter
            })
            .attr('transform', 'translate(' + [(cell.size - 13), cell.size - 6] + ')')
            .attr('text-anchor', 'right')
            .attr('font-weight', 700)
            .attr('font-family', 'Helvetica')
            .attr('fill', cell.subClr)
            .attr('stroke', 'none')
            .attr('pointer-events', 'none')
    }

    if (cell.col == 0) {
        let num = c.append('svg:text')
            .text(function(d) {
                return cell.number
            })
            .attr('transform', 'translate(' + [(4), 16] + ')')
            .attr('text-anchor', 'right')
            .attr('font-weight', 700)
            .attr('font-family', 'Helvetica')
            .attr('fill', cell.subClr)
            .attr('stroke', 'none')
            .attr('pointer-events', 'none')
    }

    // ONLY NEED for debugging 
    let rowcol = c.append('svg:text')
        .attr('id', 'RC' + cell.id)
        .text(function(d) {
            if (DEBUG == true) {
                // The id is the row & col
                const id = cell.id.replace("id", "");
                return id;
            }
        })
        .attr('transform', 'translate(' + [(cell.size - 30), 16] + ')')
        .attr('text-anchor', 'right')
        .attr('font-weight', 700)
        .attr('font-family', 'Helvetica')
        .attr('fill', cell.subClr)
        .attr('stroke', 'none')
        .attr('pointer-events', 'none')

    // ONLY NEED for debugging 
    let blackInfluence = c.append('svg:text')
        .attr('id', 'BI' + cell.id)
        .text(function(d) {
            if (DEBUG == true) {

                return cell.blackInfluence;
            }
        })
        .attr('transform', 'translate(' + [(10), 40] + ')')
        .attr('text-anchor', 'right')
        .attr('font-weight', 700)
        .attr('font-family', 'Helvetica')
        .attr('fill', cell.subClr)
        .attr('stroke', 'none')
        .attr('pointer-events', 'none')

    // ONLY NEED for debugging 
    let whiteInfluence = c.append('svg:text')
        .attr('id', 'WI' + cell.id)
        .text(function(d) {
            if (DEBUG == true) {

                return cell.blackInfluence;
            }
        })
        .attr('transform', 'translate(' + [(10), 60] + ')')
        .attr('text-anchor', 'right')
        .attr('font-weight', 700)
        .attr('font-family', 'Helvetica')
        .attr('fill', cell.subClr)
        .attr('stroke', 'none')
        .attr('pointer-events', 'none')
    // ONLY NEED for debugging 
    let id_of_the_piece_on_this_cell = c.append('svg:text')
        .attr('id', 'WHO' + cell.id)
        .text(function(d) {
            if (DEBUG == true) {
                return "who"
            }
        })
        .attr('transform', 'translate(' + [(10), 80] + ')')
        .attr('text-anchor', 'right')
        .attr('font-weight', 700)
        .attr('font-family', 'Helvetica')
        .attr('fill', cell.subClr)
        .attr('stroke', 'none')
        .attr('pointer-events', 'none')

}

function getCellXY(row, col) {
    const id = "id" + col + "_" + row;
    return cells[id].getAncoreXY();
}

function addPieceIntoDom(piece) {
    let r = size / 3
    const xy = getCellXY(piece.row, piece.col)
    let p = d3.select('#chessboard')
        .append('svg:g')
        .data([{
            'id': piece.id,
        }])
        .attr('transform', 'translate(' + xy.x + ',' + xy.y + ')')
        .attr('id', 'P' + piece.id)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
  
    let background = p.append('svg:circle')
        .attr('fill-opacity', 0.1)
        .attr('stroke', '#000')
        .attr('stroke-width', 4)
        .attr('r', r)

    let foreground = p.append('svg:text')
        .text(piece.unicode)
        .attr('y', '.1em')
        .style("font-size", piece.size + "px")
        .attr('transform', 'translate(' + [0, r / 4] + ')')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 700)
        .attr('font-family', 'Helvetica')
        .attr('fill', '#000000')
        .attr('stroke', 'none')
        .attr('pointer-events', 'none')
        
}
////////////////////////// 
function dragstarted(d) {

    let piece = pieces[d.id]
    const xy = getCellXY(piece.row, piece.col)
    piece.sx = xy.x // d3.event.x // needed for snap back ability
    piece.sy = xy.y // d3.event.y // needed for snap back ability
    POSSIBLE = piece.get_possible_moves();

    const cellThatThisWasOn = "id" + piece.col + "_" + piece.row 
    cells[cellThatThisWasOn].setPieceOnThisCell(NONE)

    for (let key in POSSIBLE) {
        const moveAttackOrSupport = POSSIBLE[key]
        // console.log( key + " : " + moveAttackOrSupport )
        if (piece.color === BLACK) {
            cells[key].addToBlackInfluence();
        } else if (piece.color === WHITE) {
            cells[key].addToWhiteInfluence();
        }
        cells[key].showPossible(moveAttackOrSupport)
    }
}

function dragged(d) {
    d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + ',' + (d.y = d3.event.y) + ')');
}

function dragended(d) {
    for (let key in POSSIBLE) {
        cells[key].resetBG()
    }
    const x = d3.event.x
    const y = d3.event.y
    d3.select(this).classed("active", false);
    let found = ""
    for (key in cells) {
        const c = cells[key]
        const cx1 = c.x
        const cx2 = c.x + c.w
        const cy1 = c.y
        const cy2 = c.y + c.h
        if (x >= cx1 && x <= cx2 && y >= cy1 && y <= cy2) {
            found = key
        }
    }
    let piece = pieces[d.id]
    if (POSSIBLE.hasOwnProperty(found) && ( POSSIBLE[found] === ATTACK || POSSIBLE[found] === MOVE )) {
        const c = cells[found]
        if ( POSSIBLE[found] === ATTACK ) {
            c.killPiece(piece.id)
        }
        const rowcol = c.getRowCol()
        c.setPieceOnThisCell(piece.id)
        piece.row = rowcol['row']
        piece.col = rowcol['col']
        d3.select(this).attr("transform", "translate(" + (d.x = c.ax) + ',' + (d.y = c.ay) + ')');
    } else {
        cells["id" + piece.col + "_" + piece.row].setPieceOnThisCell(piece.id)
        d3.select(this).attr("transform", "translate(" + (d.x = piece.sx) + ',' + (d.y = piece.sy) + ')');
    }
    POSSIBLE = {}
}