import { Chess } from "chess.ts";
import { Move, Piece, Square } from "chess.ts/dist/types";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

export default function Gameboard() {
    const [chess, setChess] = useState(new Chess());
    const [positionFEN, setPositionFEN] = useState(chess.fen());

    // ===== Hooks =============================================================

    // ===== Board event handlers ==============================================

    const onPieceDragBegin = (_piece: string, sourceSquare: Square): void => {
        // Short circuit if the game is over
        if (chess.gameOver()) return;

        // Get the piece on the square
        const pieceOnSquare: Piece | null = chess.get(sourceSquare);
        if (!pieceOnSquare) return;

        // Short circuit if it's not the player's turn
        if (pieceOnSquare.color !== chess.turn()) return;
    };

    const onPieceDrop = (
        sourceSquare: Square,
        targetSquare: Square,
        _piece: string
    ): boolean => {
        // Attempt the move
        const move: Move | null = chess.move({
            from: sourceSquare,
            to: targetSquare,
        });

        // Short circuit if the move is illegal
        if (!move) {
            return false;
        }

        // Now that the move is legal, update it in the game
        setPositionFEN(chess.fen());

        return true;
    };

    // ===== Render ============================================================
    return (
        <>
            <Chessboard
                areArrowsAllowed={true}
                arePiecesDraggable={true}
                arePremovesAllowed={false}
                boardOrientation="white"
                boardWidth={400} // TODO: Make this responsive
                customDarkSquareStyle={{ backgroundColor: "#997db5" }}
                customLightSquareStyle={{ backgroundColor: "#e6dbf1" }}
                customSquareStyles={undefined}
                position={positionFEN}
                // Event handlers
                onPieceDragBegin={onPieceDragBegin}
                onPieceDrop={onPieceDrop}
            />
        </>
    );
}
