/*  fişierul JS/brw.js   */

(function ($) {  // definiţie IIFE (Immediately Invoked Function Expression)
/* I: variabile şi funcţii accesibile oricărei instanţe a widget-ului */
    /* Numeric Annotation Glyphs; NAG[1] corespunde în PGN cu "$1", etc. */
const NAG = ['','a good move ("!")', 'a bad move ("?")', 'an excelent move ("!!")', 'a blunder ("??")', 'speculative move ("!?")', 'a doubtful or dubious move ("?!")', 'forced move (all others lose quickly)', 'singular move (no reasonable alternatives)', 'worst move', 'drawish position', 'equal chances, quiet position', 'equal chances, active position', 'unclear position', 'White has a slight advantage', 'Black has a slight advantage', 'White has a moderate advantage', 'Black has a moderate advantage', 'White has a decisive advantage', 'Black has a decisive advantage', 'White has a crushing advantage (Black should resign)', 'Black has a crushing advantage (White should resign)', 'White is in zugzwang', 'Black is in zugzwang', 'White has a slight space advantage', 'Black has a slight space advantage', 'White has a moderate space advantage', 'Black has a moderate space advantage', 'White has a decisive space advantage', 'Black has a decisive space advantage', 'White has a slight time (development) advantage', 'Black has a slight time (development) advantage', 'White has a moderate time (development) advantage', 'Black has a moderate time (development) advantage', 'White has a decisive time (development) advantage', 'Black has a decisive time (development) advantage', 'White has the initiative', 'Black has the initiative', 'White has a lasting initiative', 'Black has a lasting initiative', 'White has the attack', 'Black has the attack', 'White has insufficient compensation for material deficit', 'Black has insufficient compensation for material deficit', 'White has sufficient compensation for material deficit', 'Black has sufficient compensation for material deficit', 'White has more than adequate compensation for material deficit', 'Black has more than adequate compensation for material deficit', 'White has a slight center control advantage', 'Black has a slight center control advantage', 'White has a moderate center control advantage', 'Black has a moderate center control advantage', 'White has a decisive center control advantage', 'Black has a decisive center control advantage', 'White has a slight kingside control advantage', 'Black has a slight kingside control advantage', 'White has a moderate kingside control advantage', 'Black has a moderate kingside control advantage', 'White has a decisive kingside control advantage', 'Black has a decisive kingside control advantage', 'White has a slight queenside control advantage', 'Black has a slight queenside control advantage', 'White has a moderate queenside control advantage', 'Black has a moderate queenside control advantage', 'White has a decisive queenside control advantage', 'Black has a decisive queenside control advantage', 'White has a vulnerable first rank', 'Black has a vulnerable first rank', 'White has a well protected first rank', 'Black has a well protected first rank', 'White has a poorly protected king', 'Black has a poorly protected king', 'White has a well protected king', 'Black has a well protected king', 'White has a poorly placed king', 'Black has a poorly placed king', 'White has a well placed king', 'Black has a well placed king', 'White has a very weak pawn structure', 'Black has a very weak pawn structure', 'White has a moderately weak pawn structure', 'Black has a moderately weak pawn structure', 'White has a moderately strong pawn structure', 'Black has a moderately strong pawn structure', 'White has a very strong pawn structure', 'Black has a very strong pawn structure', 'White has poor knight placement', 'Black has poor knight placement', 'White has good knight placement', 'Black has good knight placement', 'White has poor bishop placement', 'Black has poor bishop placement', 'White has good bishop placement', 'Black has good bishop placement', 'White has poor rook placement', 'Black has poor rook placement', 'White has good rook placement', 'Black has good rook placement', 'White has poor queen placement', 'Black has poor queen placement', 'White has good queen placement', 'Black has good queen placement', 'White has poor piece coordination', 'Black has poor piece coordination', 'White has good piece coordination', 'Black has good piece coordination', 'White has played the opening very poorly', 'Black has played the opening very poorly', 'White has played the opening poorly', 'Black has played the opening poorly', 'White has played the opening well', 'Black has played the opening well', 'White has played the opening very well', 'Black has played the opening very well', 'White has played the middlegame very poorly', 'Black has played the middlegame very poorly', 'White has played the middlegame poorly', 'Black has played the middlegame poorly', 'White has played the middlegame well', 'Black has played the middlegame well', 'White has played the middlegame very well', 'Black has played the middlegame very well', 'White has played the ending very poorly', 'Black has played the ending very poorly', 'White has played the ending poorly', 'Black has played the ending poorly', 'White has played the ending well', 'Black has played the ending well', 'White has played the ending very well', 'Black has played the ending very well', 'White has slight counterplay', 'Black has slight counterplay', 'White has moderate counterplay', 'Black has moderate counterplay', 'White has decisive counterplay', 'Black has decisive counterplay', 'White has moderate time control pressure', 'Black has moderate time control pressure', 'White has severe time control pressure', 'Black has severe time control pressure'];

// înlocuieşte "$n" cu MARKS[$n] dacă n < 7, sau cu textul NAG[$n]
const MARKS = ['', '!', '?', '&#x203C', '&#x2047', '&#x2049;', '&#x2048;'];
function NAG_repl(pgn) { 
    return pgn.replace(/ \$(\d+)/g, function(mtch, m1) {
               m2 = parseInt(m1);
               return m2 < 7 ? MARKS[m2] : `<div class="annNAG">${NAG[m2]}</div>`;
           });
};

    /* "helper tables" - generate de metoda publică allMovesTable() */
    /* obţine câmpul FROM sau TO, pentru mutările reversibile */
const N_Moves={"a1":["c2","b3"],  // de pe 'a1' calul sare pe 'c2' sau pe 'b3'
    "a2":["c1","c3","b4"],
    "a3":["b1","c2","c4","b5"],
    "a4":["b2","c3","c5","b6"],
    "a5":["b3","c4","c6","b7"],
    "a6":["b4","c5","c7","b8"],
    "a7":["b5","c6","c8"],
    "a8":["b6","c7"],
    "b1":["d2","a3","c3"],
    "b2":["d1","d3","a4","c4"],
    "b3":["a1","c1","d2","d4","a5","c5"],
    "b4":["a2","c2","d3","d5","a6","c6"],
    "b5":["a3","c3","d4","d6","a7","c7"],
    "b6":["a4","c4","d5","d7","a8","c8"],
    "b7":["a5","c5","d6","d8"],
    "b8":["a6","c6","d7"],
    "c1":["a2","e2","b3","d3"],
    "c2":["a1","e1","a3","e3","b4","d4"],
    "c3":["b1","d1","a2","e2","a4","e4","b5","d5"],
    "c4":["b2","d2","a3","e3","a5","e5","b6","d6"],
    "c5":["b3","d3","a4","e4","a6","e6","b7","d7"],
    "c6":["b4","d4","a5","e5","a7","e7","b8","d8"],
    "c7":["b5","d5","a6","e6","a8","e8"],
    "c8":["b6","d6","a7","e7"],
    "d1":["b2","f2","c3","e3"],
    "d2":["b1","f1","b3","f3","c4","e4"],
    "d3":["c1","e1","b2","f2","b4","f4","c5","e5"],
    "d4":["c2","e2","b3","f3","b5","f5","c6","e6"],
    "d5":["c3","e3","b4","f4","b6","f6","c7","e7"],
    "d6":["c4","e4","b5","f5","b7","f7","c8","e8"],
    "d7":["c5","e5","b6","f6","b8","f8"],
    "d8":["c6","e6","b7","f7"],
    "e1":["c2","g2","d3","f3"],
    "e2":["c1","g1","c3","g3","d4","f4"],
    "e3":["d1","f1","c2","g2","c4","g4","d5","f5"],
    "e4":["d2","f2","c3","g3","c5","g5","d6","f6"],
    "e5":["d3","f3","c4","g4","c6","g6","d7","f7"],
    "e6":["d4","f4","c5","g5","c7","g7","d8","f8"],
    "e7":["d5","f5","c6","g6","c8","g8"],
    "e8":["d6","f6","c7","g7"],
    "f1":["d2","h2","e3","g3"],
    "f2":["d1","h1","d3","h3","e4","g4"],
    "f3":["e1","g1","d2","h2","d4","h4","e5","g5"],
    "f4":["e2","g2","d3","h3","d5","h5","e6","g6"],
    "f5":["e3","g3","d4","h4","d6","h6","e7","g7"],
    "f6":["e4","g4","d5","h5","d7","h7","e8","g8"],
    "f7":["e5","g5","d6","h6","d8","h8"],
    "f8":["e6","g6","d7","h7"],
    "g1":["e2","f3","h3"],
    "g2":["e1","e3","f4","h4"],
    "g3":["f1","h1","e2","e4","f5","h5"],
    "g4":["f2","h2","e3","e5","f6","h6"],
    "g5":["f3","h3","e4","e6","f7","h7"],
    "g6":["f4","h4","e5","e7","f8","h8"],
    "g7":["f5","h5","e6","e8"],
    "g8":["f6","h6","e7"],
    "h1":["f2","g3"],
    "h2":["f1","f3","g4"],
    "h3":["g1","f2","f4","g5"],
    "h4":["g2","f3","f5","g6"],
    "h5":["g3","f4","f6","g7"],
    "h6":["g4","f5","f7","g8"],
    "h7":["g5","f6","f8"],
    "h8":["g6","f7"]};
const K_Moves={"a1":["b1","a2","b2"],  // Ka1-b1, Ka1-a2, Ka1-b2
    "a2":["a1","b1","b2","a3","b3"],
    "a3":["a2","b2","b3","a4","b4"],
    "a4":["a3","b3","b4","a5","b5"],
    "a5":["a4","b4","b5","a6","b6"],
    "a6":["a5","b5","b6","a7","b7"],
    "a7":["a6","b6","b7","a8","b8"],
    "a8":["a7","b7","b8"],
    "b1":["a1","c1","a2","b2","c2"],
    "b2":["a1","b1","c1","a2","c2","a3","b3","c3"],
    "b3":["a2","b2","c2","a3","c3","a4","b4","c4"],
    "b4":["a3","b3","c3","a4","c4","a5","b5","c5"],
    "b5":["a4","b4","c4","a5","c5","a6","b6","c6"],
    "b6":["a5","b5","c5","a6","c6","a7","b7","c7"],
    "b7":["a6","b6","c6","a7","c7","a8","b8","c8"],
    "b8":["a7","b7","c7","a8","c8"],
    "c1":["b1","d1","b2","c2","d2"],
    "c2":["b1","c1","d1","b2","d2","b3","c3","d3"],
    "c3":["b2","c2","d2","b3","d3","b4","c4","d4"],
    "c4":["b3","c3","d3","b4","d4","b5","c5","d5"],
    "c5":["b4","c4","d4","b5","d5","b6","c6","d6"],
    "c6":["b5","c5","d5","b6","d6","b7","c7","d7"],
    "c7":["b6","c6","d6","b7","d7","b8","c8","d8"],
    "c8":["b7","c7","d7","b8","d8"],
    "d1":["c1","e1","c2","d2","e2"],
    "d2":["c1","d1","e1","c2","e2","c3","d3","e3"],
    "d3":["c2","d2","e2","c3","e3","c4","d4","e4"],
    "d4":["c3","d3","e3","c4","e4","c5","d5","e5"],
    "d5":["c4","d4","e4","c5","e5","c6","d6","e6"],
    "d6":["c5","d5","e5","c6","e6","c7","d7","e7"],
    "d7":["c6","d6","e6","c7","e7","c8","d8","e8"],
    "d8":["c7","d7","e7","c8","e8"],
    "e1":["d1","f1","d2","e2","f2"],
    "e2":["d1","e1","f1","d2","f2","d3","e3","f3"],
    "e3":["d2","e2","f2","d3","f3","d4","e4","f4"],
    "e4":["d3","e3","f3","d4","f4","d5","e5","f5"],
    "e5":["d4","e4","f4","d5","f5","d6","e6","f6"],
    "e6":["d5","e5","f5","d6","f6","d7","e7","f7"],
    "e7":["d6","e6","f6","d7","f7","d8","e8","f8"],
    "e8":["d7","e7","f7","d8","f8"],
    "f1":["e1","g1","e2","f2","g2"],
    "f2":["e1","f1","g1","e2","g2","e3","f3","g3"],
    "f3":["e2","f2","g2","e3","g3","e4","f4","g4"],
    "f4":["e3","f3","g3","e4","g4","e5","f5","g5"],
    "f5":["e4","f4","g4","e5","g5","e6","f6","g6"],
    "f6":["e5","f5","g5","e6","g6","e7","f7","g7"],
    "f7":["e6","f6","g6","e7","g7","e8","f8","g8"],
    "f8":["e7","f7","g7","e8","g8"],
    "g1":["f1","h1","f2","g2","h2"],
    "g2":["f1","g1","h1","f2","h2","f3","g3","h3"],
    "g3":["f2","g2","h2","f3","h3","f4","g4","h4"],
    "g4":["f3","g3","h3","f4","h4","f5","g5","h5"],
    "g5":["f4","g4","h4","f5","h5","f6","g6","h6"],
    "g6":["f5","g5","h5","f6","h6","f7","g7","h7"],
    "g7":["f6","g6","h6","f7","h7","f8","g8","h8"],
    "g8":["f7","g7","h7","f8","h8"],
    "h1":["g1","g2","h2"],
    "h2":["g1","h1","g2","g3","h3"],
    "h3":["g2","h2","g3","g4","h4"],
    "h4":["g3","h3","g4","g5","h5"],
    "h5":["g4","h4","g5","g6","h6"],
    "h6":["g5","h5","g6","g7","h7"],
    "h7":["g6","h6","g7","g8","h8"],
    "h8":["g7","h7","g8"]};
const B_Moves={"a1":["b2","c3","d4","e5","f6","g7","h8"],
    "a2":["b1","b3","c4","d5","e6","f7","g8"],
    "a3":["b2","c1","b4","c5","d6","e7","f8"],
    "a4":["b3","c2","d1","b5","c6","d7","e8"],
    "a5":["b4","c3","d2","e1","b6","c7","d8"],
    "a6":["b5","c4","d3","e2","f1","b7","c8"],
    "a7":["b6","c5","d4","e3","f2","g1","b8"],
    "a8":["b7","c6","d5","e4","f3","g2","h1"],
    "b1":["a2","c2","d3","e4","f5","g6","h7"],
    "b2":["a1","c1","a3","c3","d4","e5","f6","g7","h8"],
    "b3":["a2","c2","d1","a4","c4","d5","e6","f7","g8"],
    "b4":["a3","c3","d2","e1","a5","c5","d6","e7","f8"],
    "b5":["a4","c4","d3","e2","f1","a6","c6","d7","e8"],
    "b6":["a5","c5","d4","e3","f2","g1","a7","c7","d8"],
    "b7":["a6","c6","d5","e4","f3","g2","h1","a8","c8"],
    "b8":["a7","c7","d6","e5","f4","g3","h2"],
    "c1":["b2","a3","d2","e3","f4","g5","h6"],
    "c2":["b1","d1","b3","a4","d3","e4","f5","g6","h7"],
    "c3":["b2","a1","d2","e1","b4","a5","d4","e5","f6","g7","h8"],
    "c4":["b3","a2","d3","e2","f1","b5","a6","d5","e6","f7","g8"],
    "c5":["b4","a3","d4","e3","f2","g1","b6","a7","d6","e7","f8"],
    "c6":["b5","a4","d5","e4","f3","g2","h1","b7","a8","d7","e8"],
    "c7":["b6","a5","d6","e5","f4","g3","h2","b8","d8"],
    "c8":["b7","a6","d7","e6","f5","g4","h3"],
    "d1":["c2","b3","a4","e2","f3","g4","h5"],
    "d2":["c1","e1","c3","b4","a5","e3","f4","g5","h6"],
    "d3":["c2","b1","e2","f1","c4","b5","a6","e4","f5","g6","h7"],
    "d4":["c3","b2","a1","e3","f2","g1","c5","b6","a7","e5","f6","g7","h8"],
    "d5":["c4","b3","a2","e4","f3","g2","h1","c6","b7","a8","e6","f7","g8"],
    "d6":["c5","b4","a3","e5","f4","g3","h2","c7","b8","e7","f8"],
    "d7":["c6","b5","a4","e6","f5","g4","h3","c8","e8"],
    "d8":["c7","b6","a5","e7","f6","g5","h4"],
    "e1":["d2","c3","b4","a5","f2","g3","h4"],
    "e2":["d1","f1","d3","c4","b5","a6","f3","g4","h5"],
    "e3":["d2","c1","f2","g1","d4","c5","b6","a7","f4","g5","h6"],
    "e4":["d3","c2","b1","f3","g2","h1","d5","c6","b7","a8","f5","g6","h7"],
    "e5":["d4","c3","b2","a1","f4","g3","h2","d6","c7","b8","f6","g7","h8"],
    "e6":["d5","c4","b3","a2","f5","g4","h3","d7","c8","f7","g8"],
    "e7":["d6","c5","b4","a3","f6","g5","h4","d8","f8"],
    "e8":["d7","c6","b5","a4","f7","g6","h5"],
    "f1":["e2","d3","c4","b5","a6","g2","h3"],
    "f2":["e1","g1","e3","d4","c5","b6","a7","g3","h4"],
    "f3":["e2","d1","g2","h1","e4","d5","c6","b7","a8","g4","h5"],
    "f4":["e3","d2","c1","g3","h2","e5","d6","c7","b8","g5","h6"],
    "f5":["e4","d3","c2","b1","g4","h3","e6","d7","c8","g6","h7"],
    "f6":["e5","d4","c3","b2","a1","g5","h4","e7","d8","g7","h8"],
    "f7":["e6","d5","c4","b3","a2","g6","h5","e8","g8"],
    "f8":["e7","d6","c5","b4","a3","g7","h6"],
    "g1":["f2","e3","d4","c5","b6","a7","h2"],
    "g2":["f1","h1","f3","e4","d5","c6","b7","a8","h3"],
    "g3":["f2","e1","h2","f4","e5","d6","c7","b8","h4"],
    "g4":["f3","e2","d1","h3","f5","e6","d7","c8","h5"],
    "g5":["f4","e3","d2","c1","h4","f6","e7","d8","h6"],
    "g6":["f5","e4","d3","c2","b1","h5","f7","e8","h7"],
    "g7":["f6","e5","d4","c3","b2","a1","h6","f8","h8"],
    "g8":["f7","e6","d5","c4","b3","a2","h7"],
    "h1":["g2","f3","e4","d5","c6","b7","a8"],
    "h2":["g1","g3","f4","e5","d6","c7","b8"],
    "h3":["g2","f1","g4","f5","e6","d7","c8"],
    "h4":["g3","f2","e1","g5","f6","e7","d8"],
    "h5":["g4","f3","e2","d1","g6","f7","e8"],
    "h6":["g5","f4","e3","d2","c1","g7","f8"],
    "h7":["g6","f5","e4","d3","c2","b1","g8"],
    "h8":["g7","f6","e5","d4","c3","b2","a1"]};
const R_Moves={"a1":["b1","c1","d1","e1","f1","g1","h1","a2","a3","a4","a5","a6","a7","a8"],
    "a2":["a1","b2","c2","d2","e2","f2","g2","h2","a3","a4","a5","a6","a7","a8"],
    "a3":["a2","a1","b3","c3","d3","e3","f3","g3","h3","a4","a5","a6","a7","a8"],
    "a4":["a3","a2","a1","b4","c4","d4","e4","f4","g4","h4","a5","a6","a7","a8"],
    "a5":["a4","a3","a2","a1","b5","c5","d5","e5","f5","g5","h5","a6","a7","a8"],
    "a6":["a5","a4","a3","a2","a1","b6","c6","d6","e6","f6","g6","h6","a7","a8"],
    "a7":["a6","a5","a4","a3","a2","a1","b7","c7","d7","e7","f7","g7","h7","a8"],
    "a8":["a7","a6","a5","a4","a3","a2","a1","b8","c8","d8","e8","f8","g8","h8"],
    "b1":["a1","c1","d1","e1","f1","g1","h1","b2","b3","b4","b5","b6","b7","b8"],
    "b2":["b1","a2","c2","d2","e2","f2","g2","h2","b3","b4","b5","b6","b7","b8"],
    "b3":["b2","b1","a3","c3","d3","e3","f3","g3","h3","b4","b5","b6","b7","b8"],
    "b4":["b3","b2","b1","a4","c4","d4","e4","f4","g4","h4","b5","b6","b7","b8"],
    "b5":["b4","b3","b2","b1","a5","c5","d5","e5","f5","g5","h5","b6","b7","b8"],
    "b6":["b5","b4","b3","b2","b1","a6","c6","d6","e6","f6","g6","h6","b7","b8"],
    "b7":["b6","b5","b4","b3","b2","b1","a7","c7","d7","e7","f7","g7","h7","b8"],
    "b8":["b7","b6","b5","b4","b3","b2","b1","a8","c8","d8","e8","f8","g8","h8"],
    "c1":["b1","a1","d1","e1","f1","g1","h1","c2","c3","c4","c5","c6","c7","c8"],
    "c2":["c1","b2","a2","d2","e2","f2","g2","h2","c3","c4","c5","c6","c7","c8"],
    "c3":["c2","c1","b3","a3","d3","e3","f3","g3","h3","c4","c5","c6","c7","c8"],
    "c4":["c3","c2","c1","b4","a4","d4","e4","f4","g4","h4","c5","c6","c7","c8"],
    "c5":["c4","c3","c2","c1","b5","a5","d5","e5","f5","g5","h5","c6","c7","c8"],
    "c6":["c5","c4","c3","c2","c1","b6","a6","d6","e6","f6","g6","h6","c7","c8"],
    "c7":["c6","c5","c4","c3","c2","c1","b7","a7","d7","e7","f7","g7","h7","c8"],
    "c8":["c7","c6","c5","c4","c3","c2","c1","b8","a8","d8","e8","f8","g8","h8"],
    "d1":["c1","b1","a1","e1","f1","g1","h1","d2","d3","d4","d5","d6","d7","d8"],
    "d2":["d1","c2","b2","a2","e2","f2","g2","h2","d3","d4","d5","d6","d7","d8"],
    "d3":["d2","d1","c3","b3","a3","e3","f3","g3","h3","d4","d5","d6","d7","d8"],
    "d4":["d3","d2","d1","c4","b4","a4","e4","f4","g4","h4","d5","d6","d7","d8"],
    "d5":["d4","d3","d2","d1","c5","b5","a5","e5","f5","g5","h5","d6","d7","d8"],
    "d6":["d5","d4","d3","d2","d1","c6","b6","a6","e6","f6","g6","h6","d7","d8"],
    "d7":["d6","d5","d4","d3","d2","d1","c7","b7","a7","e7","f7","g7","h7","d8"],
    "d8":["d7","d6","d5","d4","d3","d2","d1","c8","b8","a8","e8","f8","g8","h8"],
    "e1":["d1","c1","b1","a1","f1","g1","h1","e2","e3","e4","e5","e6","e7","e8"],
    "e2":["e1","d2","c2","b2","a2","f2","g2","h2","e3","e4","e5","e6","e7","e8"],
    "e3":["e2","e1","d3","c3","b3","a3","f3","g3","h3","e4","e5","e6","e7","e8"],
    "e4":["e3","e2","e1","d4","c4","b4","a4","f4","g4","h4","e5","e6","e7","e8"],
    "e5":["e4","e3","e2","e1","d5","c5","b5","a5","f5","g5","h5","e6","e7","e8"],
    "e6":["e5","e4","e3","e2","e1","d6","c6","b6","a6","f6","g6","h6","e7","e8"],
    "e7":["e6","e5","e4","e3","e2","e1","d7","c7","b7","a7","f7","g7","h7","e8"],
    "e8":["e7","e6","e5","e4","e3","e2","e1","d8","c8","b8","a8","f8","g8","h8"],
    "f1":["e1","d1","c1","b1","a1","g1","h1","f2","f3","f4","f5","f6","f7","f8"],
    "f2":["f1","e2","d2","c2","b2","a2","g2","h2","f3","f4","f5","f6","f7","f8"],
    "f3":["f2","f1","e3","d3","c3","b3","a3","g3","h3","f4","f5","f6","f7","f8"],
    "f4":["f3","f2","f1","e4","d4","c4","b4","a4","g4","h4","f5","f6","f7","f8"],
    "f5":["f4","f3","f2","f1","e5","d5","c5","b5","a5","g5","h5","f6","f7","f8"],
    "f6":["f5","f4","f3","f2","f1","e6","d6","c6","b6","a6","g6","h6","f7","f8"],
    "f7":["f6","f5","f4","f3","f2","f1","e7","d7","c7","b7","a7","g7","h7","f8"],
    "f8":["f7","f6","f5","f4","f3","f2","f1","e8","d8","c8","b8","a8","g8","h8"],
    "g1":["f1","e1","d1","c1","b1","a1","h1","g2","g3","g4","g5","g6","g7","g8"],
    "g2":["g1","f2","e2","d2","c2","b2","a2","h2","g3","g4","g5","g6","g7","g8"],
    "g3":["g2","g1","f3","e3","d3","c3","b3","a3","h3","g4","g5","g6","g7","g8"],
    "g4":["g3","g2","g1","f4","e4","d4","c4","b4","a4","h4","g5","g6","g7","g8"],
    "g5":["g4","g3","g2","g1","f5","e5","d5","c5","b5","a5","h5","g6","g7","g8"],
    "g6":["g5","g4","g3","g2","g1","f6","e6","d6","c6","b6","a6","h6","g7","g8"],
    "g7":["g6","g5","g4","g3","g2","g1","f7","e7","d7","c7","b7","a7","h7","g8"],
    "g8":["g7","g6","g5","g4","g3","g2","g1","f8","e8","d8","c8","b8","a8","h8"],
    "h1":["g1","f1","e1","d1","c1","b1","a1","h2","h3","h4","h5","h6","h7","h8"],
    "h2":["h1","g2","f2","e2","d2","c2","b2","a2","h3","h4","h5","h6","h7","h8"],
    "h3":["h2","h1","g3","f3","e3","d3","c3","b3","a3","h4","h5","h6","h7","h8"],
    "h4":["h3","h2","h1","g4","f4","e4","d4","c4","b4","a4","h5","h6","h7","h8"],
    "h5":["h4","h3","h2","h1","g5","f5","e5","d5","c5","b5","a5","h6","h7","h8"],
    "h6":["h5","h4","h3","h2","h1","g6","f6","e6","d6","c6","b6","a6","h7","h8"],
    "h7":["h6","h5","h4","h3","h2","h1","g7","f7","e7","d7","c7","b7","a7","h8"],
    "h8":["h7","h6","h5","h4","h3","h2","h1","g8","f8","e8","d8","c8","b8","a8"]}; 
const Q_Moves={"a1":["b1","c1","d1","e1","f1","g1","h1","a2","a3","a4","a5","a6","a7","a8","b2","c3","d4","e5","f6","g7","h8"],
    "a2":["a1","b1","b2","c2","d2","e2","f2","g2","h2","a3","a4","a5","a6","a7","a8","b3","c4","d5","e6","f7","g8"],
    "a3":["a2","a1","b2","c1","b3","c3","d3","e3","f3","g3","h3","a4","a5","a6","a7","a8","b4","c5","d6","e7","f8"],
    "a4":["a3","a2","a1","b3","c2","d1","b4","c4","d4","e4","f4","g4","h4","a5","a6","a7","a8","b5","c6","d7","e8"],
    "a5":["a4","a3","a2","a1","b4","c3","d2","e1","b5","c5","d5","e5","f5","g5","h5","a6","a7","a8","b6","c7","d8"],
    "a6":["a5","a4","a3","a2","a1","b5","c4","d3","e2","f1","b6","c6","d6","e6","f6","g6","h6","a7","a8","b7","c8"],
    "a7":["a6","a5","a4","a3","a2","a1","b6","c5","d4","e3","f2","g1","b7","c7","d7","e7","f7","g7","h7","a8","b8"],
    "a8":["a7","a6","a5","a4","a3","a2","a1","b7","c6","d5","e4","f3","g2","h1","b8","c8","d8","e8","f8","g8","h8"],
    "b1":["a1","c1","d1","e1","f1","g1","h1","a2","b2","b3","b4","b5","b6","b7","b8","c2","d3","e4","f5","g6","h7"],
    "b2":["a1","b1","c1","a2","c2","d2","e2","f2","g2","h2","a3","b3","b4","b5","b6","b7","b8","c3","d4","e5","f6","g7","h8"],
    "b3":["a2","b2","b1","c2","d1","a3","c3","d3","e3","f3","g3","h3","a4","b4","b5","b6","b7","b8","c4","d5","e6","f7","g8"],
    "b4":["a3","b3","b2","b1","c3","d2","e1","a4","c4","d4","e4","f4","g4","h4","a5","b5","b6","b7","b8","c5","d6","e7","f8"],
    "b5":["a4","b4","b3","b2","b1","c4","d3","e2","f1","a5","c5","d5","e5","f5","g5","h5","a6","b6","b7","b8","c6","d7","e8"],
    "b6":["a5","b5","b4","b3","b2","b1","c5","d4","e3","f2","g1","a6","c6","d6","e6","f6","g6","h6","a7","b7","b8","c7","d8"],
    "b7":["a6","b6","b5","b4","b3","b2","b1","c6","d5","e4","f3","g2","h1","a7","c7","d7","e7","f7","g7","h7","a8","b8","c8"],
    "b8":["a7","b7","b6","b5","b4","b3","b2","b1","c7","d6","e5","f4","g3","h2","a8","c8","d8","e8","f8","g8","h8"],
    "c1":["b1","a1","d1","e1","f1","g1","h1","b2","a3","c2","c3","c4","c5","c6","c7","c8","d2","e3","f4","g5","h6"],
    "c2":["b1","c1","d1","b2","a2","d2","e2","f2","g2","h2","b3","a4","c3","c4","c5","c6","c7","c8","d3","e4","f5","g6","h7"],
    "c3":["b2","a1","c2","c1","d2","e1","b3","a3","d3","e3","f3","g3","h3","b4","a5","c4","c5","c6","c7","c8","d4","e5","f6","g7","h8"],
    "c4":["b3","a2","c3","c2","c1","d3","e2","f1","b4","a4","d4","e4","f4","g4","h4","b5","a6","c5","c6","c7","c8","d5","e6","f7","g8"],
    "c5":["b4","a3","c4","c3","c2","c1","d4","e3","f2","g1","b5","a5","d5","e5","f5","g5","h5","b6","a7","c6","c7","c8","d6","e7","f8"],
    "c6":["b5","a4","c5","c4","c3","c2","c1","d5","e4","f3","g2","h1","b6","a6","d6","e6","f6","g6","h6","b7","a8","c7","c8","d7","e8"],
    "c7":["b6","a5","c6","c5","c4","c3","c2","c1","d6","e5","f4","g3","h2","b7","a7","d7","e7","f7","g7","h7","b8","c8","d8"],
    "c8":["b7","a6","c7","c6","c5","c4","c3","c2","c1","d7","e6","f5","g4","h3","b8","a8","d8","e8","f8","g8","h8"],
    "d1":["c1","b1","a1","e1","f1","g1","h1","c2","b3","a4","d2","d3","d4","d5","d6","d7","d8","e2","f3","g4","h5"],
    "d2":["c1","d1","e1","c2","b2","a2","e2","f2","g2","h2","c3","b4","a5","d3","d4","d5","d6","d7","d8","e3","f4","g5","h6"],
    "d3":["c2","b1","d2","d1","e2","f1","c3","b3","a3","e3","f3","g3","h3","c4","b5","a6","d4","d5","d6","d7","d8","e4","f5","g6","h7"],
    "d4":["c3","b2","a1","d3","d2","d1","e3","f2","g1","c4","b4","a4","e4","f4","g4","h4","c5","b6","a7","d5","d6","d7","d8","e5","f6","g7","h8"],
    "d5":["c4","b3","a2","d4","d3","d2","d1","e4","f3","g2","h1","c5","b5","a5","e5","f5","g5","h5","c6","b7","a8","d6","d7","d8","e6","f7","g8"],
    "d6":["c5","b4","a3","d5","d4","d3","d2","d1","e5","f4","g3","h2","c6","b6","a6","e6","f6","g6","h6","c7","b8","d7","d8","e7","f8"],
    "d7":["c6","b5","a4","d6","d5","d4","d3","d2","d1","e6","f5","g4","h3","c7","b7","a7","e7","f7","g7","h7","c8","d8","e8"],
    "d8":["c7","b6","a5","d7","d6","d5","d4","d3","d2","d1","e7","f6","g5","h4","c8","b8","a8","e8","f8","g8","h8"],
    "e1":["d1","c1","b1","a1","f1","g1","h1","d2","c3","b4","a5","e2","e3","e4","e5","e6","e7","e8","f2","g3","h4"],
    "e2":["d1","e1","f1","d2","c2","b2","a2","f2","g2","h2","d3","c4","b5","a6","e3","e4","e5","e6","e7","e8","f3","g4","h5"],
    "e3":["d2","c1","e2","e1","f2","g1","d3","c3","b3","a3","f3","g3","h3","d4","c5","b6","a7","e4","e5","e6","e7","e8","f4","g5","h6"],
    "e4":["d3","c2","b1","e3","e2","e1","f3","g2","h1","d4","c4","b4","a4","f4","g4","h4","d5","c6","b7","a8","e5","e6","e7","e8","f5","g6","h7"],
    "e5":["d4","c3","b2","a1","e4","e3","e2","e1","f4","g3","h2","d5","c5","b5","a5","f5","g5","h5","d6","c7","b8","e6","e7","e8","f6","g7","h8"],
    "e6":["d5","c4","b3","a2","e5","e4","e3","e2","e1","f5","g4","h3","d6","c6","b6","a6","f6","g6","h6","d7","c8","e7","e8","f7","g8"],
    "e7":["d6","c5","b4","a3","e6","e5","e4","e3","e2","e1","f6","g5","h4","d7","c7","b7","a7","f7","g7","h7","d8","e8","f8"],
    "e8":["d7","c6","b5","a4","e7","e6","e5","e4","e3","e2","e1","f7","g6","h5","d8","c8","b8","a8","f8","g8","h8"],
    "f1":["e1","d1","c1","b1","a1","g1","h1","e2","d3","c4","b5","a6","f2","f3","f4","f5","f6","f7","f8","g2","h3"],
    "f2":["e1","f1","g1","e2","d2","c2","b2","a2","g2","h2","e3","d4","c5","b6","a7","f3","f4","f5","f6","f7","f8","g3","h4"],
    "f3":["e2","d1","f2","f1","g2","h1","e3","d3","c3","b3","a3","g3","h3","e4","d5","c6","b7","a8","f4","f5","f6","f7","f8","g4","h5"],
    "f4":["e3","d2","c1","f3","f2","f1","g3","h2","e4","d4","c4","b4","a4","g4","h4","e5","d6","c7","b8","f5","f6","f7","f8","g5","h6"],
    "f5":["e4","d3","c2","b1","f4","f3","f2","f1","g4","h3","e5","d5","c5","b5","a5","g5","h5","e6","d7","c8","f6","f7","f8","g6","h7"],
    "f6":["e5","d4","c3","b2","a1","f5","f4","f3","f2","f1","g5","h4","e6","d6","c6","b6","a6","g6","h6","e7","d8","f7","f8","g7","h8"],
    "f7":["e6","d5","c4","b3","a2","f6","f5","f4","f3","f2","f1","g6","h5","e7","d7","c7","b7","a7","g7","h7","e8","f8","g8"],
    "f8":["e7","d6","c5","b4","a3","f7","f6","f5","f4","f3","f2","f1","g7","h6","e8","d8","c8","b8","a8","g8","h8"],
    "g1":["f1","e1","d1","c1","b1","a1","h1","f2","e3","d4","c5","b6","a7","g2","g3","g4","g5","g6","g7","g8","h2"],
    "g2":["f1","g1","h1","f2","e2","d2","c2","b2","a2","h2","f3","e4","d5","c6","b7","a8","g3","g4","g5","g6","g7","g8","h3"],
    "g3":["f2","e1","g2","g1","h2","f3","e3","d3","c3","b3","a3","h3","f4","e5","d6","c7","b8","g4","g5","g6","g7","g8","h4"],
    "g4":["f3","e2","d1","g3","g2","g1","h3","f4","e4","d4","c4","b4","a4","h4","f5","e6","d7","c8","g5","g6","g7","g8","h5"],
    "g5":["f4","e3","d2","c1","g4","g3","g2","g1","h4","f5","e5","d5","c5","b5","a5","h5","f6","e7","d8","g6","g7","g8","h6"],
    "g6":["f5","e4","d3","c2","b1","g5","g4","g3","g2","g1","h5","f6","e6","d6","c6","b6","a6","h6","f7","e8","g7","g8","h7"],
    "g7":["f6","e5","d4","c3","b2","a1","g6","g5","g4","g3","g2","g1","h6","f7","e7","d7","c7","b7","a7","h7","f8","g8","h8"],
    "g8":["f7","e6","d5","c4","b3","a2","g7","g6","g5","g4","g3","g2","g1","h7","f8","e8","d8","c8","b8","a8","h8"],
    "h1":["g1","f1","e1","d1","c1","b1","a1","g2","f3","e4","d5","c6","b7","a8","h2","h3","h4","h5","h6","h7","h8"],
    "h2":["g1","h1","g2","f2","e2","d2","c2","b2","a2","g3","f4","e5","d6","c7","b8","h3","h4","h5","h6","h7","h8"],
    "h3":["g2","f1","h2","h1","g3","f3","e3","d3","c3","b3","a3","g4","f5","e6","d7","c8","h4","h5","h6","h7","h8"],
    "h4":["g3","f2","e1","h3","h2","h1","g4","f4","e4","d4","c4","b4","a4","g5","f6","e7","d8","h5","h6","h7","h8"],
    "h5":["g4","f3","e2","d1","h4","h3","h2","h1","g5","f5","e5","d5","c5","b5","a5","g6","f7","e8","h6","h7","h8"],
    "h6":["g5","f4","e3","d2","c1","h5","h4","h3","h2","h1","g6","f6","e6","d6","c6","b6","a6","g7","f8","h7","h8"],
    "h7":["g6","f5","e4","d3","c2","b1","h6","h5","h4","h3","h2","h1","g7","f7","e7","d7","c7","b7","a7","g8","h8"],
    "h8":["g7","f6","e5","d4","c3","b2","a1","h7","h6","h5","h4","h3","h2","h1","g8","f8","e8","d8","c8","b8","a8"]}; 

const ALL_MOVES = {
    'N': N_Moves, 'B': B_Moves, 'R': R_Moves, 'Q': Q_Moves, 'K': K_Moves
};
    /* "helper tables": câmpul FROM pentru mutările posibile de pion */
const WhBl_PawnFrom = [
{ // White
    'a3': ['a2', 'b2'],  // mutarea 1.a3 are FROM='a2' sau FROM='b2'
    'b3': ['b2', 'a2', 'c2'],
    'c3': ['c2', 'b2', 'd2'],
    'd3': ['d2', 'c2', 'e2'],
    'e3': ['e2', 'd2', 'f2'],
    'f3': ['f2', 'e2', 'g2'],
    'g3': ['g2', 'f2', 'h2'],
    'h3': ['h2', 'g2'],
    'a4': ['a2', 'a3', 'b3'],
    'b4': ['b2', 'b3', 'a3', 'c3'],
    'c4': ['c2', 'c3', 'b3', 'd3'],
    'd4': ['d2', 'd3', 'c3', 'e3'],
    'e4': ['e2', 'e3', 'd3', 'f3'],
    'f4': ['f2', 'f3', 'e3', 'g3'],
    'g4': ['g2', 'g3', 'f3', 'h3'],
    'h4': ['h2', 'h3', 'g3'],
    'a5': ['a4', 'b4'],
    'b5': ['b4', 'a4', 'c4'],
    'c5': ['c4', 'b4', 'd4'],
    'd5': ['d4', 'c4', 'e4'],
    'e5': ['e4', 'd4', 'f4'],
    'f5': ['f4', 'e4', 'g4'],
    'g5': ['g4', 'f4', 'h4'],
    'h5': ['h4', 'g4'],
    'a6': ['a5', 'b5'],
    'b6': ['b5', 'a5', 'c5'],
    'c6': ['c5', 'b5', 'd5'],
    'd6': ['d5', 'c5', 'e5'],
    'e6': ['e5', 'd5', 'f5'],
    'f6': ['f5', 'e5', 'g5'],
    'g6': ['g5', 'f5', 'h5'],
    'h6': ['h5', 'g5'],
    'a7': ['a6', 'b6'],
    'b7': ['b6', 'a6', 'c6'],
    'c7': ['c6', 'b6', 'd6'],
    'd7': ['d6', 'c6', 'e6'],
    'e7': ['e6', 'd6', 'f6'],
    'f7': ['f6', 'e6', 'g6'],
    'g7': ['g6', 'f6', 'h6'],
    'h7': ['h6', 'g6']
},
{ // Black
    'a6': ['a7', 'b7'],  // mutarea 1...a6 are FROM='a7' sau FROM='b7'
    'b6': ['b7', 'a7', 'c7'],
    'c6': ['c7', 'b7', 'd7'],
    'd6': ['d7', 'c7', 'e7'],
    'e6': ['e7', 'd7', 'f7'],
    'f6': ['f7', 'e7', 'g7'],
    'g6': ['g7', 'f7', 'h7'],
    'h6': ['h7', 'g7'],
    'a5': ['a7', 'a6', 'b6'],
    'b5': ['b7', 'b6', 'a6', 'c6'],
    'c5': ['c7', 'c6', 'b6', 'd6'],
    'd5': ['d7', 'd6', 'c6', 'e6'],
    'e5': ['e7', 'e6', 'd6', 'f6'],
    'f5': ['f7', 'f6', 'e6', 'g6'],
    'g5': ['g7', 'g6', 'f6', 'h6'],
    'h5': ['h7', 'h6', 'g6'],
    'a4': ['a5', 'b5'],
    'b4': ['b5', 'a5', 'c5'],
    'c4': ['c5', 'b5', 'd5'],
    'd4': ['d5', 'c5', 'e5'],
    'e4': ['e5', 'd5', 'f5'],
    'f4': ['f5', 'e5', 'g5'],
    'g4': ['g5', 'f5', 'h5'],
    'h4': ['h5', 'g5'],
    'a3': ['a4', 'b4'],
    'b3': ['b4', 'a4', 'c4'],
    'c3': ['c4', 'b4', 'd4'],
    'd3': ['d4', 'c4', 'e4'],
    'e3': ['e4', 'd4', 'f4'],
    'f3': ['f4', 'e4', 'g4'],
    'g3': ['g4', 'f4', 'h4'],
    'h3': ['h4', 'g4'],
    'a2': ['a3', 'b3'],
    'b2': ['b3', 'a3', 'c3'],
    'c2': ['c3', 'b3', 'd3'],
    'd2': ['d3', 'c3', 'e3'],
    'e2': ['e3', 'd3', 'f3'],
    'f2': ['f3', 'e3', 'g3'],
    'g2': ['g3', 'f3', 'h3'],
    'h2': ['h3', 'g3']
}];

const FEN_STD = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const sq_row = [8,7,6,5,4,3,2,1],  // ordinea liniilor în FEN
      sq_col = [1,2,3,4,5,6,7,8];  // ordinea coloanelor
const PIECE_NAME = {p:"pawn", n:"knight", b:"bishop", r:"rook", q:"queen",  k:"king"};
const SYMBOL = {  // referă simbolurile Unicode ale pieselor
     'K':'&#9812;', 'Q':'&#9813;', 'R':'&#9814;', 'B':'&#9815;', 'N':'&#9816;', 'P':'&#9817;',
     'k':'&#9818;', 'q':'&#9819;', 'r':'&#9820;', 'b':'&#9821;', 'n':'&#9822;', 'p':'&#9823;',
};
function fenToSym(fen) {return fen.replace(/[bknpqr]/ig, p => SYMBOL[p]);}
const regFEN = /\s*([rnbqkp1-8]+\/){7}([rnbqkp1-8]+)\s*/i;  // şablonul de FEN-parţial (câmp I)

    /* butoanele de navigare (şi inversarea poziţiei) */
const butt = ['Reverse', 'atBegin', 'atPrev', 'atNext', 'atEnd', 'AutoPlay'],
      symb = ['2B12', '21A2', '29CF', '29D0', '21A3', '27F4', '2B13'];

function isFEN(fen) { /* validarea principală pentru un FEN-parţial */
    if(/ /.test(fen)) fen = fen.substr(0, fen.indexOf(' '));
    if(!regFEN.test(fen)) return false;
    let rows = fen.split('/');  // tabloul liniilor din FEN
    for(let row of rows) {  // nr. piese + nr. spaţii == 8
        let fenStr = row.replace(/\d/g, n_sp => " ".repeat(n_sp));
        if(fenStr.length != 8) return false;
    }
    return true;
};
    /* FEN => şir de 64 caractere, spaţiu sau piesă */
function strFEN(fen) {
    if(/ /.test(fen)) fen = fen.substr(0, fen.indexOf(' '));    
    return fen.replace(/\x2f/g, "")  // şterge '/' din FEN
              .replace(/[1-8]/g, n_sp => " ".repeat(n_sp));
};
    /* şirul de 64 <div>, în ordinea FEN (câmpurile tablei de şah) */
function strDivFld() { 
    let html = []; 
    for(let row of sq_row) {  // în ordinea FEN a liniilor
        for(let col of sq_col) {
            let fldCl = (row + col) & 1 ? "whFld" : "blFld";
            html.push(`<div class="Field Row${row} Col${col} ${fldCl}"></div>`);
        }
    }
    return html.join('');
};
    /* şirul <div>-etichete 'a'..'h', '1'..'8' */
function strDivLab(ln_h) {  // înălţimea câmpului din 'chessmen-N'
    let lh = 2 + Number(ln_h), html=[];  // când Field are padding:1px
    if(ln_h > 23) ln_h += 2;  // când Field are padding:2px
    for(let K of sq_col) {
        let colID = String.fromCharCode(96 + K);
        html.push(`<div class='tagRow Row${K}' style='line-height:${lh}px'>${K}</div><div class='tagCol Col${K}'>${colID}</div>`);
    }
    return html.join('');
};
    /* şirul <div>-butoane de navigare */
function strDivNav() {
    let ghtml = ["<div class='GameNav FldColor1'>"];
    ghtml.push(`<div title='${butt[0]}'>&#x${symb[0]};</div>`);
    for(let i=1; i < 6; i++)
        ghtml.push(`<div class='whFld' title='${butt[i]}'>&#x${symb[i]};</div>`);
    ghtml.push("</div>");
    return ghtml.join('');
}; 
function strDivBkg() {  // 3 alternative de colorare a câmpurilor
    return `<div class='Bkg' title='change color'>
            <div class='Bkg1'></div><div class='Bkg2'></div>
            <div class='Bkg3'></div></div>`;
}

    /* modelează mutările din textul PGN */
function Move() { 
    this.SAN = ""; // Standard Algebraic Notation (e4, Nf3, O-O)
    this.FEN = ""; // FEN-ul rezultat după efectuarea mutării
    this.mark = ""; // + (check), # (checkmate), ! (good move), etc.
    this.NAG = 0;   // Numeric Annotation Glyphs, index
    this.variant = []; // variante indicate în PGN la această mutare
    this.comment = ""  // adnotări (TODO: = [] adică, _tablou de comentarii)
};

const PIECE_COD = { // par pentru alb, impar pentru negru
    'P': 2, 'p': 3,
    'N': 4, 'n': 5,
    'K': 6, 'k': 7,
    'B': 8, 'b': 9,
    'R': 10, 'r': 11,
    'Q': 12, 'q': 13
};
const PIECE_CHAR = [, , 'P', 'p', 'N', 'n', 'K', 'k', 'B', 'b', 'R', 'r', 'Q', 'q'];

const STEP_r = [-16, -1, 1, 16],                     // turn
      STEP_b = [-17, -15, 15, 17],                   // nebun
      STEP_k = [-17, -16, -15, -1, 1, 15, 16, 17],   // rege
      STEP_n = [-33, -31, -18, -14, 14, 18, 31, 33]; // cal
const STEP = {
     6 : [-17, -16, -15, -1, 1, 15, 16, 17], // STEP\_k
    12 : [-17, -16, -15, -1, 1, 15, 16, 17], // deplasamentele damei
    10 : [-16, -1, 1, 16], // STEP\_r
     8 : [-17, -15, 15, 17], // STEP\_b
     4 : [-33, -31, -18, -14, 14, 18, 31, 33] // STEP\_n
};

// conversii indecşi x88 <==> notaţii [a-h][1-8]
const IDx88 = ah18 => (ah18.charCodeAt(1)-49)*16 + ah18.charCodeAt(0)-97;
const revIDx88 = idx => String.fromCharCode(97+(idx & 7)) + ((idx >> 4) + 1);
const TO_x88 = { 
    'a1':0,'a2':16,'a3':32,'a4':48,'a5':64,'a6':80,'a7':96,'a8':112,
    'b1':1,'b2':17,'b3':33,'b4':49,'b5':65,'b6':81,'b7':97,'b8':113,
    'c1':2,'c2':18,'c3':34,'c4':50,'c5':66,'c6':82,'c7':98,'c8':114,
    'd1':3,'d2':19,'d3':35,'d4':51,'d5':67,'d6':83,'d7':99,'d8':115,
    'e1':4,'e2':20,'e3':36,'e4':52,'e5':68,'e6':84,'e7':100,'e8':116,
    'f1':5,'f2':21,'f3':37,'f4':53,'f5':69,'f6':85,'f7':101,'f8':117,
    'g1':6,'g2':22,'g3':38,'g4':54,'g5':70,'g6':86,'g7':102,'g8':118,
    'h1':7,'h2':23,'h3':39,'h4':55,'h5':71,'h6':87,'h7':103,'h8':119
};

// expresii regulate (utilizate în metoda _extract_pgn())
const regTags = /\[\w+\s+"[^\"]*"\]/g,
      regTagVal = /(\w+)\s+\"(.*)\"\]/,
      regRes = /1\/2\s*-\s*1\/2\s*$|0\s*-\s*1\s*$|1\s*-\s*0\s*|\*\s*$/,
      regMove = /^[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:\=?[QRBN])?/,
      regCastle = /^O-O-O|^0-0-0|^O-O|^0-0/,
      regMarks = /^[+|#|?|!]+/;

function gameTitle(tags) {  // setează conţinutul lui div.GameInfo
    let Wh = tags['White'],
        Bl = tags['Black'],
        R = tags['Result'],
        D = tags['Date'],
        ihtm = [];
    if(/\w+/.test(Wh)) ihtm.push(`<p><span dir='auto'>${Wh}</span>`);
    if(/\w+/.test(Bl)) ihtm.push(` - <span dir='auto'>${Bl}</span>`);
    ihtm.push(` <em>${R}</em>`);
    if(/\d+/.test(D)) ihtm.push(` ${D.match(/\d+/)}</p>`);
    return ihtm.join('');
};

function nestPar(txt, lft, rgt) {  // utilizată în _extract_pgn()
// txt[0] este paranteza 'lft'; returnează subşirul dintre paranteze,
// sau '' dacă parantezele sunt incorect imbricate
    let p0=1, p1=0, n = txt.length, j;
    for(j=1; (j < n) & (p0 != p1); j++)
        switch(txt.charAt(j)) {
            case lft: p0++; break;
            case rgt: p1++; break;
        }
    return (p0 == p1? txt.substring(1, j-1) : '');
}

function san2Unc(san) {  // pentru a folosi eventual, simboluri Unicode în SAN
    let s = san.match(/^[KQRBN]/);
    if(s) return san.replace(/^./, SYMBOL[s[0].toLowerCase()]);
    return san;  // return (SYMBOL['P'] + san);
}

function moveNr(fen) {  // formatul de "număr mutare" (în _setLinksNotes())
    let side = fen.match(/ [w|b] /),  // care parte mută
        nm = fen.match(/\d+$/);  // număr mutare
    return (/w/.test(side) ? (nm-1) + '...': nm + '.');
}

/* II: defineşte widget-ul (bazat pe jQueryUI.Widget()) */
$.widget("vb.pgnbrw", {
options: {
    Load: true, // prezintă <textarea> şi buton LOAD
    Game: true, // White, Black, Result (extrase din PGN) - v. gameTitle()
    Moves: false, // <div> pentru lista mutărilor
    Notes: false, // <div> adnotări (if(NOT Child))
    Child: false, // true AND NOT Notes: <div>.pgnbrw() pentru variante
    Men: 24, // setul de piese (dimensiune 20..32)
    Color: 1 // varianta iniţială de colorare 1..3 (câmpuri, butoane)
},

_create: function() {
    let Elem = this.element, // <textarea>text PGN</textarea>
        Opts = this.options,  // scurtează referirea opţiunilor
        Self = this;  // pentru a accesa dintr-un handler, instanţa curentă

    if(Opts.Notes || Opts.Child) {  // aceste opţiuni sunt disjuncte
        this.option('Moves', true);
        this.option('Child', !Opts.Notes);
    }
    
    if(Opts.Load) {  // butonul Load, cu handler de încărcare PGN
        Elem.css({width: 250, height: 50}).show();
        $('<button></button>')
            .text('Load').css({position:'relative', left:'0.5em', top:'-1em'})
            .click(function(ev) { // înscrie poziţia, la click()
                ev.preventDefault();
                Self._init();  // dar NU "this"._init()     
            }).insertAfter(Elem);
    } else Elem.hide();
    
    let thtml = [  // infrastructura DOM, ca tablou de şiruri HTML
        (Opts.Game && '<div class="GameInfo"></div>') || '', 
        '<div class="mGrid">', 
            '<div class="Grid1">', 
                '<div class="Men', Opts.Men, '">', 
                    '<div class="Board FldColor', Opts.Color, '">', 
                        '<div class="flds64">',
                            strDivFld(), '</div>',
                        (Opts.Moves && strDivLab(Opts.Men)) || '',
                        strDivBkg(),
                    '</div>', 
                    strDivNav(),
                '</div>', 
            '</div>', 
            (Opts.Moves && '<div class="Grid2"></div>') ||
                           '<div class="Grid2" style="display:none"></div>',
            (Opts.Notes && '<div class="Grid3"><div class="AnnLst"></div></div>') || '',
            (Opts.Child && '<div class="Grid3"><textarea></textarea></div>') || '',
        '</div>'
    ];  //   console.log(thtml);
    
    let elmn = Opts.Load ? Elem.next() : Elem;
    let BRW = $(thtml.join('')).insertAfter(elmn).children();

    // referinţe interne la obiecte jQuery ce vor fi accesate frecvent
    this.pGame = Opts.Game ? elmn.next().first() : null; // div.GameInfo
    this.pMovLst = BRW.eq(1); // div.Grid2 (link-uri la mutări)
    this.pAnnLst = BRW.eq(2).find('.AnnLst'); // div.AnnLst (dacă Notes==true)
    this.pChild = BRW.eq(2);  // div.Grid3 (dacă Child==true)
    let brw0 = BRW.eq(0);
    this.pFlds = brw0.find('div.flds64');
    this.pBoard = this.pFlds.parent();
    this.pNav = brw0.find('div.GameNav');
    /* handler pe bara de schimbare a variantei de colorare */
    let chBkg = this.pBoard.find('div.Bkg');
    chBkg.click(function(event) {
        event.preventDefault();
        let tgt = $(event.target),
            idx = +1 + tgt.index(),
            newcol = 'FldColor' + idx,
            bkgs = chBkg.parent();
        bkgs.add(bkgs.next())
            .removeClass('FldColor1 FldColor2 FldColor3')
            .addClass(newcol);
    });
    /* handler de navigare, asociat div.GameNav */
    this.REVERSE = false; // orientarea curentă (iniţial, $\squaretopblack$)
    this.brwtimer = 0; // iniţializează "timer" pentru _auto_nextMove()
    this.pNav.click(function(event) {
        event.preventDefault();
        let tgt = $(event.target);
        clearTimeout(Self.brwtimer); // stopează acţiunea 'AutoPlay'
        if(tgt.attr("title")) {
            switch (tgt.index()) {
                case 1: Self._firstMove(); break; // la poziţia iniţială
                case 2: Self._prevMove(); break;
                case 3: Self._nextMove(); break;
                case 4: Self._lastMove(); break;  // la poziţia finală
                case 5: Self._auto_nextMove(); break; // parcurge mutările automat
                case 0: // inversează orientarea tablei
                        Self.REVERSE = !Self.REVERSE;
                        tgt.html(Self.REVERSE ? `&#x${symb[6]};` : `&#x${symb[0]};`);
                        Self.pBoard.toggleClass('revMB');
            }
        }
    });
    // stabileşte înălţimea lui div.Grid2 (care are overflow:auto)
    let hght = this.pBoard.height() + 45; // 25 
    this.pMovLst.css('height', hght);
    this.pAnnLst.css('height', hght);
},  /*** END  _create() ***/

_init: function() {
    this.Tags = {}; // tagurile din PGN=this.element.val()             
    this.Moves = []; // obiecte Move() pentru mutările din PGN-movetext
    this.LAST_POS_MOVE = null; // index mutare curentă în this.Moves[]
    this.in_comm = ""; // comentariul initial din PGN (precede 'movetext')
    this.errors = ""; // mesaje de eroare (la analiza PGN)
    this._extract_pgn(); // analiză PGN; setează this.Tags, this.Moves, etc. 
    this.FEN_initial = this.Tags['FEN'] || FEN_STD;
    this._setPosition(this.FEN_initial);
    this.x88Board = new Array(128); // reprezentarea 0x88
    this.sq_king = [0, 0]; // indecşii câmpurilor ocupate de regi
    this._setBOARD(this.FEN_initial); // setează x88Board[] şi fanioanele poziţiei    
    this.bin_moves = [];  // lista mutărilor posibile în poziţia curentă
    this._setLinks();  // creează link-uri la mutările (legale) din this.Moves[]
    this.Links = this.pMovLst.find('a');  // referă lista link-urilor
    // la click, instalează poziţia din FEN-ul mutării referite de link
    this.pMovLst.on('click', 'a', 
        (event) => {event.preventDefault();
                    this._goToPos($(event.target));}); 
    if(this.pGame)  // inserează în div.GameInfo ("titlul" partidei)
        this.pGame.html(gameTitle(this.Tags));
    if(this.options.Notes==true) 
        this._setLinksNotes();  // link-uri la adnotări (în div.AnnLst)
    if(this.options.Child==true) {  // instanţă secundară a widget-ului (pentru variantele PGN)
        this.chld = this.pChild.find('textarea')
                        .pgnbrw({Load:false, Game:false, Men:20, Color:2});
        this.pChild.find('div.GameNav').css({position:'relative', top:'-0.5em'});
        this._setLinksChild();  // link-uri la variante
        // iniţializează widget-ul secundar pentru prima variantă existentă în PGN
        this.pChild.find('.annCrt:first').show().find('span:first').click();
    }
},  /*** END  _init() ***/

_setPosition: function(fen) {  // inserează în DOM poziţia indicată în FEN
    let fen64 = strFEN(fen);
    this.pFlds.children().each(function(index) {
        let piece = fen64.charAt(index); 
        if(piece && piece != " ") {
            let piece_low = piece.toLowerCase(),
            side = piece == piece_low ? "bl-": "wh-";
            pieceClass = side + PIECE_NAME[piece_low];
            $(this).html(`<div class="Piece ${pieceClass}"></div>`);
        }
        else $(this).html("");
    });
},
        
/*** handlerele de navigare ***/
_nextMove: function() {
    let links = this.Links, // this.pMovLst.find('a'),
        last = this.LAST_POS_MOVE,
        lnk;
    if(last == null) {
        this.LAST_POS_MOVE = 0;
        lnk = links.eq(0);
    }
    else {
        if(last < links.length - 1) {
            lnk = links.eq(last + 1);
        }
    }
    return this._goToPos(lnk);
},

_auto_nextMove: function() {
    if(!this._nextMove()) {
		this.brwtimer = this._delay(
            () => {this._auto_nextMove();}, 1000);
	}
},

_prevMove: function() {
    let links = this.Links, // this.pMovLst.find('a'),
        last = this.LAST_POS_MOVE,
        lnk;
    if(last == null) {
        this.LAST_POS_MOVE = 0;
        lnk = links.eq(0);
    }
    else {
        if(last > 0) {
            lnk = links.eq(last - 1);
        }
    }
    this.pMovLst.scrollTop(0);
    this._goToPos(lnk); //, true);
},

_firstMove: function() {
    let links = this.Links; // this.pMovLst.find('a');
    if(this.LAST_POS_MOVE != null) {
        links.eq(this.LAST_POS_MOVE).removeClass('onMoveSel');
        let stats = this.pAnnLst;
        let toscr = stats.find('div.annCrt').removeClass('annsel');
        let tom = this.pMovLst.find('a:first');
        this.pMovLst.scrollTop(0);
        this.LAST_POS_MOVE = null;
    }
    this._setPosition(this.FEN_initial);
},

_lastMove: function() {
    let links = this.Links; // this.pMovLst.find('a');
    if(this.LAST_POS_MOVE != null) 
        links.eq(this.LAST_POS_MOVE).removeClass('onMoveSel');
    this.LAST_POS_MOVE = links.length - 1;
    let lnk = links.eq(this.LAST_POS_MOVE);
    this._goToPos(lnk);
},

/* pentru link-ul (cu atribut 'atrMovId') primit, determină obiectul Move() asociat în this.Moves[] şi setează poziţia pentru câmpul .FEN a acestuia, marchează link-ul în lista din Grid2 şi derulează div.Grid2 şi div.AnnList corespunzător mutării curente */
_goToPos: function(lnk, onTop) { // onTop=true va aduce mutarea în vârful zonei vizibile
    if(!lnk) return;
    let links = this.Links; // this.pMovLst.find('a');
    let moveid = parseInt(lnk.attr('atrMovId')); // index Move() în this.moves[]           
    let pos = this.Moves[moveid].FEN;
    if(this.LAST_POS_MOVE != null)
        links.eq(this.LAST_POS_MOVE).removeClass('onMoveSel');
    this._setPosition(pos);
    this.LAST_POS_MOVE = moveid;
    let tom = links.eq(moveid).addClass('onMoveSel');
    let kTop = this.pMovLst.offset().top,
        cTop = tom.offset().top,
        dft = cTop - kTop;
    if(onTop) 
        this.pMovLst.scrollTop(dft);  // mutarea curentă va fi în vârful zonei vizibile
    else {
        if(dft > 12 * tom.height()) // condiţionează derularea (nu derula mereu!)
        this.pMovLst.animate({
            scrollTop: '+=' + dft + 'px'
        });
    }
    if(this.options.Notes) { // "scroll" în lista din div.AnnLst (comentarii)
        let stats = this.pAnnLst; 
        stats.find('div.annCrt').removeClass('annsel');
        let toscr = stats.find(`a[atrMovId='${moveid}']`).parent()
                         .parent().addClass('annsel');
        if(toscr.length > 0) {
            stats.find('.annCrt').css('font-weight', 'normal');
            toscr.find('.annCrt:first')
                 .css('font-weight', 'bold');
            let step = toscr.offset().top - stats.offset().top;
            stats.animate({scrollTop: '+=' + step + 'px'}); 
		    return true;
        }
    }
    if(this.options.Child) { // "scroll" în lista variantelor
        let stats = this.pChild.find('.annCrt');
        let toscr = stats.find("a[atrMovId='" + moveid +  "']");
        if(toscr.length > 0) {
            stats.filter(':visible').hide();  // stats.hide();
            toscr.parent().parent().show().find('span:first').click();
            return true;
        }
    }
},

/* dat FEN, setează infrastructura binară folosită pentru generarea listei mutărilor posibile, constând din x88Board[] şi fanioanele poziţiei (drepturi-rocadă, en-passant, to_move, etc.) */
_setBOARD: function(fen) {
    let BOARD = this.x88Board,
        sqKk = this.sq_king;
    for(let i = 0; i < 128; i++) BOARD[i] = 0;
    let recs = fen.split(/\s+/);
    let board = recs[0].split(/\x2f/).reverse().join('');
    let ofs = 0;
    board.replace(/[prbnqk]|[1-8]/ig,
            function(x) {
                if (x <= '8') ofs += x - 0;
                else {
                    let sq = ((ofs >> 3) << 4) | (ofs & 7);
                    BOARD[sq] = PIECE_COD[x];
                    if (x == 'K' || x == 'k') sqKk[PIECE_COD[x] & 1] = sq;
                    ofs ++;
                }
            });
    this.to_move = (/^w$/i.test(recs[1])) ? 0 : 1; // 0/1 = alb/negru la mutare
    this.castle = 0; // 1|2 alb O-O|O-O-O; 4|16 negru O-O|O-O-O
    this.en_pass = -1;
    let roq = recs[2].split('');  // drepturile de rocadă ale părţilor
    for(let rq of roq) 
        switch(rq) {
            case 'K': this.castle |= 1; break;
            case 'Q': this.castle |= 2; break;
            case 'k': this.castle |= 4; break;
            case 'q': this.castle |= 8;
        }
    let ep = recs[3] || "-";  // câmpul de sosire pentru o mutare en-passant
    if (ep != "-") this.en_pass = IDx88(ep);
    this.fifty = recs[4] || 0; // numără mutările consecutive fără cele de pion şi fără captură
    this.nr_move = recs[5] || 1; // numărul de mutări (incrementat după răspunsul negrului)
},

/* FEN-ul corespunzător infrastructurii binare (x88Board[] plus fanioane) */
_getFEN: function() {
    let pos = [],
        BOARD = this.x88Board;
    for(let row = 7; row >= 0; row--) {
        let str = "", empty = 0;
        for(let col = 0; col < 8; col++) {
            let pc = BOARD[(row << 4) | col];
            if(pc > 0) {
                if (empty) str += empty;
                empty = 0;
                str += PIECE_CHAR[pc]
            } else empty ++;
        }
        if(empty) str += empty;
        pos.push(str);
    }
    let fen = [pos.join("/")];
    fen[1] = this.to_move ? "b": "w";
    let q = "", cast = this.castle;
    if(cast) {
        if(cast & 1) q += 'K';
        if(cast & 2) q += 'Q';
        if(cast & 4) q += 'k';
        if(cast & 8) q += 'q';
    } else q = "-";
    fen[2] = q;
    fen[3] = this.en_pass > 0 ? revIDx88(this.en_pass) : "-";
    fen[4] = this.fifty;
    fen[5] = this.nr_move;
    return fen.join(" ");
},

/* este câmpul de index SQ atacat de o piesă a părţii indicate de 'side'? */
_isAttacked: function(SQ, side) { // side = 0 / 1, pentru alb / negru 
    let sq1, dir, BOARD = this.x88Board;
    let knight = 4, rook = 10, queen = 12, bishop = 8, king = 6; // alb
        /* este SQ atacat de către un Pion advers? */
    if(!side) { // SQ atacat de pion alb: de pe SQ-15, sau de pe SQ-17
        sq1 = SQ - 15;
        if(!(sq1 & 0x88) && (BOARD[sq1] == 2)) return 1;
        sq1 -= 2;
        if(!(sq1 & 0x88) && (BOARD[sq1] == 2)) return 1
    } else { // SQ atacat de pion negru: de pe SQ+15, sau de pe SQ+17
        sq1 = SQ + 15;
        if(!(sq1 & 0x88) && (BOARD[sq1] == 3)) return 1;
        sq1 += 2;
        if(!(sq1 & 0x88) && (BOARD[sq1] == 3)) return 1;
        knight++; rook++; queen++; bishop++; king++; // comută pe negru piesele atacatoare
    }
        /* este SQ atacat de un cal advers, sau de regele advers? */
    for(dir = 0; dir < 8; dir++) {
        sq1 = SQ + STEP_n[dir];
        if(!(sq1 & 0x88) && (BOARD[sq1] == knight)) return 1;
        sq1 = SQ + STEP_k[dir];
        if(!(sq1 & 0x88) && (BOARD[sq1] == king)) return 1
    }
        /* este SQ atacat de turn, damă sau nebun advers? */
    for(dir = 0; dir < 4; dir++) {
        let step = STEP_r[dir];
        sq1 = SQ + step;
        while(!(sq1 & 0x88)) {
            let p = BOARD[sq1];
            if(p > 0) {
                if((p == rook) || (p == queen)) return 1;
                break
            }
            sq1 += step
        }
        step = STEP_b[dir];
        sq1 = SQ + step;
        while(!(sq1 & 0x88)) {
            let p = BOARD[sq1];
            if(p > 0) {
                if((p == bishop) || (p == queen)) return 1;
                break
            }
            sq1 += step
        }
    }
    return 0 // câmpul SQ nu este atacat de către adversar
},

/* generează (în this.bin_moves[]) lista mutărilor posibile, codificate pe 32 biţi astfel: 
        31  30..28   27..24  23..16  15..8   7..4      3..0 
        0    xxx    SPECIAL   FROM     TO    PIECE   CAPTURED
unde SPECIAL are valorile:
  1 sau 2 - pentru O-O sau O-O-O (rocadă mică/mare)
        3 - mutare reversibilă (NU-pion, NU-captură, NU-rocadă)
        6 - mutare de pion normală (NU-transformare, NU-cu 2 câmpuri)
        7 - mutare de piesă (NU pion) cu efect de captură
     0x0E - avansează pion cu 2 câmpuri
     0x0F - pion capturează pion advers en-passant
4/5/8..13 - codul piesei în care se transformă pionul (regele este exclus)
Exemplu:
    mutarea negrului Qd8-h4 este codificată prin 0x037337D0 
    (SPECIAL=0x03; FROM=TO_x88['d8']=0x73, TO=TO_x88['h4']=0x37; PIECE=PIECE_COD['q']=0xD)
*/
_gen_moves: function() {
    let moves = this.bin_moves = [];
    let ocsq = [],  // câmpurile ocupate de partea indicată de this.to_move
        to_move = this.to_move,  
        castle = this.castle,
        BOARD = this.x88Board,
        en_pass = this.en_pass;
    for(let i = 0; i < 120; i++)
        if(!(i & 0x88 || !BOARD[i] || BOARD[i] & 1 ^ to_move)) ocsq.push(i);
    if(!to_move) { // albul la mutare; E1 = 4, G1 = 6, C1 = 2
        if((castle & 3) && !this._isAttacked(4, 1)) { // dacă O-O, O-O-O sunt legale
            if((castle & 1) && !(BOARD[5] ||  
                    BOARD[6] || this._isAttacked(5, 1) || this._isAttacked(6, 1)))
                moves.push(0x01040660);
            if((castle & 2) && !(BOARD[3] ||
                    BOARD[2] || BOARD[1] || this._isAttacked(3, 1) || this._isAttacked(2, 1)))
                moves.push(0x02040260)
        }
    } else { // negrul la mutare; E8 = 0x74, G8 = 0x76, C8 = 0x71
        if((castle & 0x0C) && !this._isAttacked(0x74, 0)) {
            if((castle & 4) && !(BOARD[0x75] ||
                    BOARD[0x76] || this._isAttacked(0x75, 0) || this._isAttacked(0x76, 0)))
                moves.push(0x01747670);
            if((castle & 8) && !(BOARD[0x73] || BOARD[0x72] ||
                    BOARD[0x71] || this._isAttacked(0x73, 0) || this._isAttacked(0x72, 0)))
                moves.push(0x02747270)
        }
    }
    for(let sq of ocsq) {  // pentru toate piesele părţii aflate la mutare
        let p = BOARD[sq];
        if(p == (2 | to_move)) { // mutările de pion
            if(!to_move) { // albul la mutare
                if(sq < 0x60) { // nu-i mutare de transformare
                    if(!BOARD[sq + 16]) { // mutare normală de pion
                        moves.push(0x06000020 | (((sq << 8) | (sq + 16)) << 8));
                    }
                    if((sq < 0x18) && !BOARD[sq + 16] && !BOARD[sq + 32]) { // e2-e4
                        moves.push(0x0E000020 | (((sq << 8) | (sq + 32)) << 8));
                    }
                } else { // cele 4 transformări posibile
                    if(!BOARD[sq + 16]) {
                        let frto = ((sq << 8) | (sq + 16)) << 8;
                        moves.push(0x0C000020 | frto, 0x0A000020 | frto, 
                                   0x08000020 | frto, 0x04000020 | frto);
                    }
                }
                for(var j = 15; j <= 17; j += 2) {
                    let sq1 = sq + j;
                    if(!(sq1 & 0x88)) { // mutare de pion (inclusiv, transformare) cu captură 
                        let p1 = BOARD[sq1];
                        if(this.en_pass == sq1) {
                            moves.push(0x0F000023 | (((sq << 8) | sq1) << 8))
                        } else if (p1 & 1) {
                                if(sq >= 0x60) { // transformare cu captură
                                    let frto = ((sq << 8) | sq1) << 8;
                                    moves.push(0x0C000020 | frto | p1, 0x0A000020 | frto | p1, 
                                               0x08000020 | frto | p1, 0x04000020 | frto | p1);
                                } else {
                                    moves.push(0x06000020 | (((sq << 8) | sq1) << 8) | p1);
                                }
                          }
                    }
                }
            } else { // negrul la mutare
                if(sq >= 0x20) { // nu-i mutare de transformare
                    if(!BOARD[sq - 16]) {
                        moves.push(0x06000030 | (((sq << 8) | (sq - 16)) << 8));
                    }
                    if((sq >= 0x60) && !BOARD[sq - 16] && !BOARD[sq - 32]) {
                        moves.push(0x0E000030 | (((sq << 8) | (sq - 32)) << 8));
                    }
                } else { // mutările de transformare
                    if(!BOARD[sq - 16]) {
                        let frto = ((sq << 8) | (sq - 16)) << 8;
                        moves.push(0x0D000030 | frto, 0x0B000030 | frto, 
                                   0x09000030 | frto, 0x05000030 | frto);
                    }
                }
                for(let j = 15; j <= 17; j += 2) {
                    let sq1 = sq - j;
                        if(!(sq1 & 0x88)) { // mutare de pion cu captură
                            let p1 = BOARD[sq1];
                            if(en_pass == sq1) {
                                moves.push(0x0F000032 | (((sq << 8) | sq1) << 8));
                            } else if((p1 > 0) && !(p1 & 1)) { // transformare cu captură
                                    if(sq < 0x20) {
                                        let frto = ((sq << 8) | sq1) << 8;
                                        moves.push(0x0D000030 | frto | p1, 
                                                   0x0B000030 | frto | p1, 
                                                   0x09000030 | frto | p1, 
                                                   0x05000030 | frto | p1);
                                    } else {
                                        moves.push(0x06000030 | (((sq << 8) | sq1) << 8) | p1)
                                      }
                                   }
                        }
                }
              }
        } else { // mutare de figură (nu pion)
            let ofdir = STEP[p - to_move];
            for(let D of ofdir) {
                let sq1 = sq;
                for(;;) {
                    sq1 += D;
                    if(sq1 & 0x88) break;
                    if((p == (6 | to_move)) && this._isAttacked(sq1, to_move ^ 1)) break;
                    let p1 = BOARD[sq1];
                    if(!p1) {
                        moves.push(0x03000000 | (((sq << 8) | sq1) << 8) | (p << 4));
                    } else {
                        if((!to_move && (p1 & 1)) || (to_move && !(p1 & 1))) {
                            moves.push(0x07000000 | (((sq << 8)|sq1) << 8) | ((p << 4)|p1));
                            break
                        } else break
                      }
                    if(!(p & 8)) break // dacă 'p' nu este nebun/turn/damă
                }
            }
        }
    } 
},      // console.log(Array.from(this.bin_moves, mv => mv.toString(16)));

/* Primește codul binar complet al mutării (4 octeți, bit31 = 0, bit30..28 nefolosiţi):
        move = | 0xxx SPECIAL | FROM | TO | PIECE CAPTURED |
simulează mutarea pe x88Board[]:
        mută PIECE FROM-TO capturând CAPTERED, ținând cont de SPECIAL
dacă regele NU rămâne în șah (mutarea este legală):
        actualizează x88Board, .castle, .en_pass, .fifty, .to_move 
Returnează 1 dacă mutarea este legală, 0 dacă este ilegală  */
_makeMove: function(move) {
    let BOARD = this.x88Board, to_move = this.to_move, castle = this.castle;
    let spec = (move >> 24) & 0x0F, // câmpul SPECIAL (4 biţi)
        from = (move >> 16) & 0xFF, // câmpul FROM
        to = (move >> 8) & 0xFF;    // câmpul TO
    let p = BOARD[from], p1 = BOARD[to]; // piesele de pe câmpurile FROM, TO
    if((p1 == 6) || (p1 == 7)) return 0; // s-ar captura chiar regele advers (ilegal)
    if((spec != 0x01) && (spec != 0x02)) { // legalitatea rocadelor s-a testat în gen_moves()
        BOARD[to] = p;  // mută piesa p de pe FROM pe TO
        BOARD[from] = 0;  // (dar ignoră piesa promovată, dacă există)
        if (spec == 0x0F) // elimină pionul luat "en-passant", dacă este cazul
            BOARD[to + (to_move ? 16 : -16)] = 0;
        // câmpul pe care se află regele (chiar TO, dacă p este regele)
        let sqk = (p == (6 | to_move)) ? to: this.sq_king[to_move];
        if(this._isAttacked(sqk, to_move ^ 1)) { // illegal to be in check after move
            BOARD[from] = p; // dacă regele rămâne în șah după mutare,
            BOARD[to] = p1;  //      reconstituie poziția anterioară mutării
            if(spec == 0x0F) {  // (pune înapoi pionul luat "en-passant")
                if(to_move) BOARD[to + 16] = 2;
                else BOARD[to - 16] = 3
            }
            return 0;  // mutarea este ilegală - încheie complet procesul
        }
        // regele NU rămâne în șah; încheie simularea, retrăgând mutarea simulată.
        BOARD[from] = p; BOARD[to] = p1
    }
    // Actualizează x88Board[] + fanioane, corespunzător efectuării mutării.
    if(this.en_pass > 0) this.en_pass = -1;  // iniţializează fanionul "en-passant"
    switch(spec) {  // actualizări în funcție de valoarea câmpului SPECIAL
        case 0x01:  // O-O
            if(!to_move) {  // O-O pentru alb
                BOARD[5] = 10; // turnul din 'h1' vine pe 'f1'
                BOARD[6] = 6;  // regele vine din 'e1' pe 'g1'
                BOARD[7] = BOARD[4] = 0;  // șterge piesele "vechi"
            } else {  // O-O pentru negru
                BOARD[0x75] = 11; BOARD[0x76] = 7; BOARD[0x77] = BOARD[0x74] = 0;
            }
            this.fifty++;  // încă o mutare non-captură și non-pion
            break;
        case 0x02:  // O-O-O
            if(!to_move) {
                BOARD[3] = 10; BOARD[2] = 6; BOARD[0] = BOARD[4] = 0;
            } else {
                BOARD[0x73] = 11; BOARD[0x72] = 7; BOARD[0x70] = BOARD[0x74] = 0;
            }
            this.fifty++;
            break;
        case 0x03:  // mutare fără captură, fără pion (și fără rocadă)
            BOARD[to] = p; BOARD[from] = 0;
            this.fifty++;  // actualizează contorul regulii celor 50 de mutări
            break;
        case 0x07:  // captură cu o piesă (nu cu pion)
        case 0x06:  // mutare normală de pion (NU-ep, NU-2-linii, NU-prom)
            BOARD[to] = p; BOARD[from] = 0;  // pune piesa pe TO, o șterge de pe FROM
            this.fifty = 0;  // resetează contorul de 50 mutări (fără pion, fără captură)
            break;
        case 0x0C:  // transformare de pion alb în Q (damă)
        case 0x0A:
        case 0x08:
        case 0x04:
        case 0x0D:  // transformare de pion negru în Q (damă)
        case 0x0B:
        case 0x09:
        case 0x05:
            BOARD[to] = spec;  // TO = piesa în care s-a transformat pionul
            BOARD[from] = 0;
            this.fifty = 0;  // resetează contorul de 50 mutări (fără pion, fără captură)
            break;
        case 0x0F:  // captură "en-passant"
            // en-passant capture. Reset the en-pass field, erase the opponent's pawn
            if(!to_move) BOARD[to - 16] = 0;  // șterge pionul capturat en-passant
            else BOARD[to + 16] = 0;
            BOARD[to] = p; BOARD[from] = 0; // pune pionul pe TO, ștergându-l de pe FROM
            this.fifty = 0;  // resetează contorul de 50 mutări (fără pion, fără captură)
            break;
        case 0x0E:  // avansare cu două linii a unui pion nemișcat anterior
            BOARD[to] = p; BOARD[from] = 0;
            this.en_pass = to_move ? to + 16 : to - 16; // = indexul câmpului sărit de pion
            this.fifty = 0;  // resetează contorul de 50 mutări (fără pion, fără captură)
            break
    }   // încheie actualizările impuse imediat de valoarea SPECIAL
    // când mută regele sau un turn, pierde din "drepturile de rocadă rămase"
    switch (p) {  // p este piesa mutată
        case 6:  // regele alb
            if(castle & 3) castle &= 0x0C;  // șterge biții rocadei albe
            this.sq_king[0] = to;  // păstrează noua poziție a regelui
            break;
        case 7:  // regele negru
            if(castle & 0x0C) castle &= 3;  // șterge biții rocadei negre
            this.sq_king[1] = to;
            break;
        case 10:  // turn alb
            if((castle & 1) && (from == 7)) 
                castle ^= 1;  // anulează bitul de rocadă mică albă
            else {
                if((castle & 2) && (from == 0)) 
                    castle ^= 2;  // anulează bitul de rocadă mare albă
            }
            break;
        case 11:  // turn negru
            if((castle & 4) && (from == 0x77)) 
                castle ^= 4;  // anulează bitul de rocadă mică neagră
            else {
                if((castle & 8) && (from == 0x70)) 
                    castle ^= 8;  // anulează bitul de rocadă mare neagră
            }
            break;
    }
    // capturarea unui turn afectează drepturile de rocadă ale adversarului
    switch (p1) {  // p1 este piesa capturată
        case 10:  // negrul capturează turnul alb din 'h1' sau din 'a1'
            if((castle & 1) && (to == 7)) 
                castle ^= 1;  // şterge bitul de rocadă mică albă
            else {
                if((castle & 2) && (to == 0)) 
                    castle ^= 2;  // şterge bitul de rocadă mare albă
            }
            break;
        case 11:  // albul capturează turnul negru din 'h8' sau din 'a8'
            if((castle & 4) && (to == 0x77)) 
                castle ^= 4;  // şterge bitul de rocadă mică neagră
            else {
                if((castle & 8) && (to == 0x70)) 
                    castle ^= 8;  // șterge bitul de rocadă mare neagră
            }
            break;
    }
    if(to_move) this.nr_move++; // dacă negrul mută, incrementează numărul de mutare
    to_move ^= 1;  // urmează să mute cealaltă parte
    this.to_move = to_move;  // păstrează intern fanioanele constituite
    this.castle = castle;
    return 1;  // mutare legală (și x88Board actualizat conform acesteia)
},  /* încheie _makeMove() */

/* Constituie un cod _parţial de mutare (numai din FROM şi TO) şi caută potrivirile acestuia în lista this.bin_moves[] - reţinând pe aceea (unică!) pe care _makeMove() o califică drept legală (implicit, mutarea legală respectivă este şi efectuată) */
_legal: function(m) { // m este [FROM, TO]: ['e1', 'g1'] sau ['a7', 'a8Q'] etc.
    let from = TO_x88[m[0]],  // indexul câmpului FROM, în x88Board[]
        prom; // eventual, piesa în care promovează pionul
    if(m[1].length == 3) {  // 'a8Q' - pionul promovează în damă
        prom = m[1].charAt(2);
        prom = PIECE_COD[prom] | this.to_move;
        m[1] = m[1].replace(/.$/, "");  // reţine câmpul TO (='a8')
    }
    let to = TO_x88[m[1]];  // indexul câmpului TO, în x88Board[]
    let move = ((from << 8) | to) << 8; // codul binar parţial (deplasat) al mutării
    // caută codul binar complet pentru `move`
    let bin_mv = this.bin_moves;  // pointează tabloul mutărilor generate
    for(let mv of bin_mv) {
        if((mv & 0x00FFFF00) == move && (!prom || ((mv >> 24) == prom))) 
            if(this._makeMove(mv)) 
                return true; // mutarea este legală (şi x88Board[] actualizat)
    }
    return false; // mutarea este ilegală (iar x88Board[] nu este modificat)
},

/* Dezambiguează SAN (de ex., 'Ne2' poate fi 'Ng1-e2', sau 'Nc3-e2', etc. - dar numai 
   una dintre acestea este legală): determină câmpul TO şi câmpurile FROM-posibile şi 
   apoi testează legalitatea apelând _legal([FROM, TO]) */
_san_legal: function(SAN) {
    this._gen_moves(); // this.bin_moves[] = lista mutărilor posibile (codificate binar)
    let m = ['', ''];  // câmpurile FROM-posibil și TO
    if((SAN == 'O-O-O') || (SAN == '0-0-0'))
        return this.to_move ?
            this._legal(['e8', 'c8']) : this._legal(['e1', 'c1']);
    if((SAN == 'O-O') || (SAN == '0-0'))
        return this.to_move ?
            this._legal(['e8', 'g8']) : this._legal(['e1', 'g1']);
    let prom, mtch, piece;
    if(mtch = SAN.match(/=?[QRBN]$/)) { // mutare de transformare ("a8=Q")
        prom = SAN.charAt(SAN.length - 1); // piesa promovată (Q)
        SAN = SAN.replace(mtch, "") // rămâne "a8" (câmpul TO)
    }
    m[1] = SAN.substr(SAN.length - 2, 2); // reține din SAN câmpul TO
    SAN = SAN.replace(/..$/, ""); // elimină TO din SAN
    let capt = false; // indică efectul de captură
    if(mtch = SAN.match(/x$/i)) { // mutare cu efect de captură?
        capt = true;
        SAN = SAN.replace(mtch, ""); // elimină 'x' din SAN
    }
    if(prom && capt) { // promovare cu efect de captură ("bxa8=Q")
        m[0] = SAN.charAt(0) + (this.to_move ? '2': '7'); // FROM="b7"
        m[1] += prom; // (= "a8Q")
        return this._legal(m); // încheie prin _makeMove() dacă mutarea este legală
    } else {
        if (prom) { // promovare fără efect de captură ("a8=Q")
            m[0] = m[1].charAt(0) + (this.to_move ? '2':'7'); // ="a7"
            m[1] += prom; // (= "a8Q")
            return this._legal(m); // încheie prin _makeMove() dacă mutarea este legală
        }
    }
    // în acest punct, m[1]=TO și SAN conține eventual piesa și coloana/linia/FROM
    let field, table_mvs, poss_from, 
        BOARD = this.x88Board;
    if(/^[KQRBN]/.test(SAN)) { // mutare de piesă (nu pion)
        piece = SAN.charAt(0);
        table_mvs = ALL_MOVES[piece]; // tabelul tuturor mutărilor piesei
        SAN = SAN.replace(/^./, ""); // șterge piesa din SAN
        if (/^[a-h][1-8]/.test(SAN)) { // Când SAN-inițial ar fi "Nf4g6",
            m[0] = SAN;                //             SAN-rămas ar fi "f4".
            return this._legal(m);
        }
        if (this.to_move) piece = piece.toLowerCase();
        piece = PIECE_COD[piece];
        poss_from = table_mvs[m[1]]; // FROM-posibile = ALL_MOVES[piece][TO]
        for(let field of poss_from) { // FROM-posibil pentru mutarea piesei pe TO
            if(BOARD[TO_x88[field]] == piece &&
                    (!SAN || SAN == field.charAt(0) || SAN == field.charAt(1))) {
                m[0] = field;
                if(this._legal(m)) return true;
            }
        }
    }
    poss_from = WhBl_PawnFrom[this.to_move][m[1]];  // FROM-posibile pt. mutarea de pion
    piece = this.to_move ? 3 : 2;
    let c = capt ? SAN.charAt(0) : m[1].charAt(0);
    for(let field of poss_from) {
        if (BOARD[TO_x88[field]] == piece && field.charAt(0) == c) {
            m[0] = field;
            if(this._legal(m)) return true;
        }
    }
    return 0 // Dacă NU s-a încheiat printr-un "return" anterior (actualizând implicit
             // x88Board), atunci SAN-ul transmis este ilegal în contextul x88Board 
             // curent (şi acesta este neafectat).
}, /* încheie metoda _san_legal() */

/* Analizează sintactic textul PGN. Se extra tagurile în this.Tags şi se constituie obiectele
   Move() în tabelul this.Moves[]. Câmpurile '.FEN' din Move() rămân necompletate (se verifică
   sintaxa, nu şi legalitatea mutărilor) */
_extract_pgn: function() {
    let pgn = this.element.val(); // textul PGN
    if(!pgn) return;
    let rgx, mtch, tmp;
// extrage tagurile [Key "Value"], în this.Tags{}
    if(mtch = pgn.match(regTags)) {
        for(tmp of mtch) {
            let tag = tmp.match(regTagVal);
            this.Tags[RegExp.$1] = RegExp.$2;
        }
        pgn = pgn.replace(regTags, '');
    }  // console.log(this.Tags);
    pgn = pgn.replace(/^\s+/, '');  // şterge spaţiul iniţial
// şterge rezultatul din finalul PGN, asigurând existenţa tagului Result
    if(mtch = pgn.match(regRes)) {
        pgn = pgn.replace(mtch[0], "");
        if(!this.Tags['Result']) 
            this.Tags['Result'] = mtch[0].trim();
    }
// extrage comentariul din faţa 'movetext', în this.in_comm
    rgx = /^\s*\{[^\}]*\}/;  // comentariu: text încadrat de acolade
    while(mtch = pgn.match(rgx)) {
        this.in_comm += " " + mtch[0].replace(/^\s*\{|\}$/g, "");
        pgn = pgn.replace(mtch, "");
    }
    pgn = pgn.replace(/^\s+/, "");
// Acum 'pgn' conţine numai mutări, adnotări şi variante.
    let thm = 0, // indexul unui Move() din this.Moves[]
        err = false; // există erori de sintaxă în PGN
    let len_crt = pgn.length,  // cât a rămas de analizat 
        len_initial = len_crt;
    pgn = pgn.replace(/\.\s+\.\.\./g, '...'); // '7.  ...' devine '7...'
    while((len_crt > 0) && !err) {
        pgn = pgn.replace(/^[ |\t]+/, '');  // şterge spaţiu/TAB iniţiale
        if(mtch = pgn.match(/^\d+\.{1,3}\s*/)) {
            pgn = pgn.replace(mtch[0], "");  // şterge "numărul mutării"
            if(pgn.length == 0) { 
                this.errors = " MOVESECTION încheiat cu " + mtch + ". ";
                err = true;
                break;  // 'movetext' NU poate încheia cu "număr mutare"
            }
        }
        if((mtch = pgn.match(regMove)) || (mtch = pgn.match(regCastle))) {
            if(/^\d/.test(mtch[0])) {
                this.errors = " SAN început cu o cifră: " + mtch + ". ";
                err = true;
                break;  // o mutare SAN nu poate începe cu o cifră
            }
            tmp = new Move(); // instanţiază un obiect Move{}
            tmp.SAN = mtch[0];  // înscrie câmpul SAN
            this.Moves[thm++] = tmp; // adaugă obiectul creat în Moves[]
            pgn = pgn.replace(mtch[0], "");  // şterge mutarea din PGN
            pgn = pgn.replace(/^\s+/, "")
        }
        if(mtch = pgn.match(regMarks)) {  // +|#|?|!
            this.Moves[thm - 1].mark = mtch[0];
            pgn = pgn.replace(mtch, "");
            pgn = pgn.replace(/^\s+/, "")
        }
        if(/^\$([7-9]|\d{2,3})/.test(pgn)) { // pentru NAG[7..139]
            this.Moves[thm - 1].NAG = RegExp.$1; // console.log(pgn, this.Moves[thm-1]);
            mtch = '$' + RegExp.$1;
            pgn = pgn.replace(mtch, "");
            pgn = pgn.replace(/^\s+/, "")
        }
        if(/^\$([1-6]?)/.test(pgn)) { // pentru NAG[1..6]
            this.Moves[thm - 1].mark += MARKS[parseInt(RegExp.$1)];
            mtch = '$' + RegExp.$1;
            pgn = pgn.replace(mtch, "");
            pgn = pgn.replace(/^\s+/, "");
        }
        if(pgn.charAt(0) == '{') {  // început de comentariu
            mtch = nestPar(pgn, '{', '}');
            if(!mtch) {
                this.errors = " Există acolade nepereche. ";
                err = true;
                break;  // acoladele trebuie imbricate corect
            } else this.Moves[thm - 1].comment += mtch + " "; 
            pgn = pgn.replace(mtch, "");
            pgn = pgn.replace(/^\{\}\s+/, "");
        }
        if(pgn.charAt(0) == '(') {  // început de variantă
            mtch = nestPar(pgn, '(', ')');
            if(!mtch) {
                this.errors = " Există paranteze rotunde nepereche. ";
                err = true;
                break;
            } else this.Moves[thm - 1].variant.push(mtch);
            pgn = pgn.replace(mtch, "");
            pgn = pgn.replace(/^\(\)\s+/, "")
        }
        if(pgn.charAt(0) == ';') {  // început de comentariu-EOL
            mtch = pgn.match(/^.+[\r|\n]/);
            pgn = pgn.replace(mtch[0], '');
            mtch = mtch[0].substring(1);
            if(thm > 0) this.Moves[thm - 1].comment += mtch + " "; 
            else this.in_comm += mtch; 
        }
        if(len_crt == pgn.length) {
            err = true;  // alert(pgn);
            this.errors = ' eroare PGN pe la mutarea ' + (parseInt(thm/2));
            break;
        }
        // alert(thm+'\n' + JSON.stringify(this.Moves[thm-1], null, '\t'));
        len_crt = pgn.length;
    }
    // console.log(this.Moves);
    if(err) alert(this.errors);
},

/* Pentru fiecare obiect mv=Move() din this.Moves[], verifică dacă mutarea înscrisă în câmpul
   mv.SAN este legală (apelând _san_legal()); dacă da, atunci determină FEN-ul poziției 
   rezultate prin mutarea respectivă (apelând _getFEN()) și îl înscrie în câmpul mv.FEN, 
   după care creează în div.Grid2 un link <a> prevăzut cu un atribut 'atrMovId' a cărui
   valoare este indexul acelei mutări. */
_setLinks: function() {
    let movs = this.Moves,
        errors = false,  // poate se întâlneşte o mutare ilegală?
        Mht = [];  // HTML pentru linkuri la mutări (în div.Grid2)
    if(this.to_move) Mht.push(`<span class="nrMove">${this.nr_move}...</span>`);
    let id = 0;  // indexul lui mv în movs (atributul atrMovId)
    for(let mv of movs) {
        let move = mv.SAN;
        if(this._san_legal(move)) {  // este mutare legală?
            let fen = this._getFEN(),
                w_to_move = (/ w /.test(fen));
            mv.FEN = fen; 
            // instituie link cu atributul atrMovId 
            if(!w_to_move) 
                Mht.push(`<span class="nrMove">${this.nr_move}.</span>`);
            Mht.push(`<a href='' class="onMove" atrMovId="${id}">
                      ${move}<span class="moveMark">${mv.mark}</span></a>`);
            Mht.push((w_to_move ? "<br>": "&nbsp;"));
            id ++;
        } else { errors = true; break; }
    }
    this.pMovLst.html(Mht.join(''));  // inserează link-urile în div.Grid2
    if(errors) alert("Mutare eronată (pe la " + this.nr_move + ")");
},  /* END _setLinks() */

/* constituie diviziunea adnotărilor (cu handler de 'click') */
_setLinksNotes: function() {
    let movs = this.Moves,
        Cht = [];   // HTML pentru comentarii, variante
    if(this.in_comm) Cht.push(`<div class="Cinit">
                               ${NAG_repl(this.in_comm)}</div>`);
    let id = 0;  // indexul lui mv în movs
    for(let mv of movs) {
        let {SAN:move, FEN:fen, mark, NAG:nag, 
             variant:vrnt, comment:comm} = mv;
        if(nag || (vrnt.length > 0) || comm) {
            let nrm = moveNr(fen);  // numărul mutării, formatat corespunzător
            Cht.push(`<div class="annCrt">
                          <p>${nrm}<a href='' atrMovId="${id}">
                                         ${move}${mark}</a></p>`);
            if(nag) Cht.push(`<div class="annNAG">${NAG[nag]}</div>`);
            let pvr = [];
            for(let vr of vrnt) pvr.push(
                    `<div>${NAG_repl(vr)}</div>`);
            if(pvr.length > 0)
                Cht.push(`<div>${pvr.join('')}</div>`);
            if(comm) Cht.push(
                    `<div>${NAG_repl(comm)}</div>`);
            Cht.push('</div>');
        }
        id ++;  // indică următorul obiect mv și reia
    }
    this.pAnnLst.html(Cht.join(''));  // inserează adnotările
    let Self = this;
    this.pAnnLst.click(function(event) { // click in div.AnnLst
        event.preventDefault();
        var tgt = $(event.target);
        if(tgt.is('a')) {  // mutarea căreia îi este asociată adnotarea
            Self.pMovLst.scrollTop(0);  // derulează lista din div.Grid2
            Self._goToPos(tgt, true);  // actualizează poziţia
        }
        else {  // adnotarea asociată
            if(tgt.is('span[data-variant]')) {
                let scop = $(tgt);  // evidențiază vizual adnotarea
                scop.siblings().css('font-weight', 'normal')
                    .end().css('font-weight', 'bold');
            }
        }
    });
},

/* instanţiază un widget "secundar", pentru parcurgerea variantelor (cu specific Crafty) */
_setLinksChild: function() {
    let movs = this.Moves,
        Cht = [];   // HTML pentru variante
    let id = 0;  // indexul lui mv în movs
    for(let mv of movs) {
        if(mv.variant.length > 0) {
            let move = mv.SAN, fen = mv.FEN,
                mark = mv.mark, nag = mv.NAG,
                vrnt = mv.variant;
            let nrm = moveNr(fen);  // numărul formatat al mutării
            Cht.push(`<div class="annCrt" style="display:none">
                          <p>${nrm}<a href='' atrMovId="${id}">
                                         ${move}${mark}</a></p>`);
            if(nag) Cht.push(`<div class="annNAG">${NAG[nag]}</div>`);

            for(let vr of vrnt) {
                let crafty = vr.match(/^\{.*:(.*?)\}\s*(.*)\$/);
                let Est = crafty[1];  // estimarea variantei
                let Var = crafty[2].replace(/\. /g, "."); // varianta
                let First = Var.match(/^[^ ]*/);  // mutarea I a variantei
                let data_var = `[FEN "${this.Moves[id-1].FEN}"] ${Var} *`;
                Cht.push(`<span data-variant='${data_var}'>${First}</span>`,
                         `<span>(${Est})</span>&nbsp;&nbsp;`);
            }
            Cht.push("</div>");  // încheie div.annCrt curentă
        }
        id ++;  // vizează următoarea mutare din 'movs'
    }  // se încheie constituirea diviziunilor div.annCrt
    this.pChild.find('div.Grid1').append($(Cht.join('')));
    let Self = this;
    this.pChild.click(function(event) {
        event.preventDefault();
        var tgt = $(event.target);
        if(tgt.is('a')) {
            Self.pMovLst.scrollTop(0);
            Self._goToPos(tgt, true);  // poziția "principală"
        }
        else {
            if(tgt.is('span[data-variant]')) {
                let scop = $(tgt);
                scop.siblings().css('font-weight', 'normal')
                     .end().css('font-weight', 'bold');
                Self.pChild.find('textarea').val(scop.data('variant'));
                Self.chld.pgnbrw();  // _init() widget "secundar"
            }
        }
    });
},  /* încheie setLinksChild() */

/***  metode "publice" (utilitare)  ***/

/* generează "tabelele precalculate"  allMoves[] */
allMovesTable: function() {
    let allMoves = {
        'N': {}, 'K': {}, 'B': {}, 'R': {}, 'Q': {}
    }; // allMoves['N']['e2'] = ['c1', 'c3', 'd4', 'f4', 'g3', 'g1']
    let BOARD = this.x88Board; // vom avea o singură piesă (albă)
    for(let i = 0; i < 128; i++) BOARD[i] = 0; 
    this.to_move = 0; // fixăm Albul la mutare
    this.castle = 0;  // excludem rocadele (important!)
    for(let p = 4; p <= 12; p += 2) { // N, K, B, R, Q (piesele albe)
        let piece = PIECE_CHAR[p];
        for(let fld in TO_x88) { // 'a1', 'a2', ..., 'h8'
            BOARD[TO_x88[fld]] = p; // pune piesa p pe câmpul fld
            this._gen_moves();  // generează mutările în this.bin_moves
            let moves = this.bin_moves;
            let to_arr = []; // câmpurile TO din codurile mutărilor
            for(let i = 0, n = moves.length; i < n; i++) {
                let TO = (moves[i] >> 8) & 0xFF; // extrage indexul TO
                to_arr.push(revIDx88(TO));  // TO ==> [a-h][1-8]
            }
            allMoves[piece][fld] = to_arr;  //  console.log(piece, fld, to_arr);
            BOARD[TO_x88[fld]] = 0; // şterge piesa curentă de pe fld
        }
    }
    Object.keys(allMoves).forEach(function(key) {console.log(
          `const ${key}_Moves=${JSON.stringify(allMoves[key])};`);
    });
},

/* Numărul de mutări legale într-o poziţie dată (prin FEN-ul acesteia)  */
perft: function(pfen) {
    let fen = pfen || this.Tags['FEN'], 
        N = 0; // numărul mutărilor legale generate
    this._setBOARD(fen); // poziţia iniţială, conform FEN-ului dat
    this._gen_moves();   // this.bin\_moves[] = lista mutărilor posibile
    for(let mv of this.bin_moves) { 
        if(this._makeMove(mv)) { // dacă mutarea este şi legală
            N++;                 // o contorizează
            this._setBOARD(fen); // şi revine la poziţia iniţială
        } // mutările respinse de _makeMove() sunt ignorate
    }
   console.log(`[FEN "${fen}"]: ${N} mutări legale`);
},

/* setează poziţia iniţială la mutarea din PGN indicată prin numărul ei:
        $('#txtPGN').pgnbrw().pgnbrw('goToMove', 10, true);  */
goToMove: function(nr_move, side) {
    let links = this.Links;
    if(this.LAST_POS_MOVE != null)
        links.eq(this.LAST_POS_MOVE).removeClass('oneMoveSel');
    this.LAST_POS_MOVE = side==true ? 2*(nr_move-1) : 2*nr_move-1;
    let a = links.eq(this.LAST_POS_MOVE);
    this._goToPos(a, true);
}

});  /* încheie definiţia widget-ului 'vb.pgnbrw()' */

})(jQuery);  /* încheie definiţia IIFE (Immediately Invoked Function Expression) */
