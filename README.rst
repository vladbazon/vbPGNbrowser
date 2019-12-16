Browsing a PGN chess game is similar to browse a database table, the
records being the FEN strings corresponding to successive positions of
the game; the problem here is to obtain these FENs. Another problem is
using *different* sets of chessmen, with *minimum* changes (or
additions) to the chess diagram CSS definition.

We create a DOM + CSS homogeneous infrastructure, for providing the
chess diagram and DIV's for the moves list, annotations etc., using
several sprites of 12 NxN px chessmen (from which the pieces are
positioned in the diagram fields with *background-position*:
**-K\*100%** (K=1..N), independently of N).

On the other hand, we create a 0x88 reprezentation (BOARD[] array of 128
integers for the chessboard, position flags, 32-bit MOVE) and
corresponding infrastructure (moves generator, \_makeMove()) -
used for to validate the PGN moves for legality (by converting from SAN
to 32-bit moves and succesively making the moves on the BOARD[]); so we
also obtain the necessary FENs.

Finally, we bind together these two infrastructures - successively
validating and inserting the PGN moves as links (with corresponding
handlers) in the moves list DIV (and the annotations in corresponding
DIV).

<img src="vb.pgnbrw1.png" alt="instance1" />

<img src="vb.pgnbrw2.png" alt="instance2" />
