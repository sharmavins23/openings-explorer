import { Chess } from "chess.ts";
import { useEffect } from "react";
import { Chessboard } from "react-chessboard";

export default function Gameboard() {
    const chess = new Chess();

    // ===== Hooks =============================================================

    // On mount...
    useEffect(() => {});

    // ===== Render ============================================================
    return (
        <>
            <Chessboard
                areArrowsAllowed={true}
                arePiecesDraggable={true}
                arePremovesAllowed={false}
                boardOrientation="white"
                boardWidth={400} // TODO: Make this responsive
            />
        </>
    );
}
