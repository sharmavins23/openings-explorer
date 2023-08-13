import { Chess } from "chess.ts";
import { Move, Piece, PieceSymbol, Square } from "chess.ts/dist/types";
import { isPieceSymbol } from "chess.ts/dist/utils";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { CustomSquareStyles } from "react-chessboard/dist/chessboard/types";

export default function Gameboard() {
    const [chess] = useState(new Chess());
    const [positionFEN, setPositionFEN] = useState(chess.fen());

    // Arrows
    const arrowColor = "rgba(255, 0, 0, 0.8)";
    const [arrows, setArrows] = useState<Square[][]>([]);

    // Square highlighting
    const highlightedSquareColor = "rgba(0, 0, 255, 0.4)";
    const [rightClickedSquares, setRightClickedSquares] =
        useState<CustomSquareStyles>({});

    // ===== Hooks =============================================================

    // ===== Board event handlers ==============================================

    function onArrowsChange(squares: Square[][]): void {
        // Shortcut - If nothing actually has changed, don't update state
        if (JSON.stringify(arrows) === JSON.stringify(squares)) return;

        setArrows(squares);
    }

    function onPieceDragBegin(_piece: string, sourceSquare: Square): void {
        // Short circuit if the game is over
        if (chess.gameOver()) return;

        // Get the piece on the square
        const pieceOnSquare: Piece | null = chess.get(sourceSquare);
        if (!pieceOnSquare) return;

        // Short circuit if it's not the player's turn
        if (pieceOnSquare.color !== chess.turn()) return;
    }

    function onPieceDrop(
        sourceSquare: Square,
        targetSquare: Square,
        piece: string
    ): boolean {
        const pieceSymbol: PieceSymbol = piece[1].toLowerCase() as PieceSymbol;
        // Ensure this conversion works
        // This hacky solution is necessary because the chess.ts library doesn't
        //  pass the pieces as Piece objects for no valid/good reason
        if (!isPieceSymbol(pieceSymbol)) {
            return false;
        }

        // Attempt the move
        const move: Move | null = chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: pieceSymbol,
        });

        // Now that the move is legal, update it in the game
        setPositionFEN(chess.fen());

        // Short circuit if the move is illegal
        if (!move) {
            return false;
        }

        return true;
    }

    function onPromotionCheck(
        sourceSquare: Square,
        targetSquare: Square,
        piece: string
    ): boolean {
        return (
            ((piece === "wP" &&
                sourceSquare[1] === "7" &&
                targetSquare[1] === "8") ||
                (piece === "bP" &&
                    sourceSquare[1] === "2" &&
                    targetSquare[1] === "1")) &&
            Math.abs(sourceSquare.charCodeAt(0) - targetSquare.charCodeAt(0)) <=
                1
        );
    }

    function onSquareClick(square: Square): void {
        // Reset any highlighted squares
        setRightClickedSquares({});
    }

    function onSquareRightClick(square: Square): void {
        setRightClickedSquares({
            ...rightClickedSquares,
            [square]:
                rightClickedSquares[square] &&
                rightClickedSquares[square]?.backgroundColor ===
                    highlightedSquareColor
                    ? undefined
                    : { backgroundColor: highlightedSquareColor },
        });
    }

    // ===== Render ============================================================
    return (
        <>
            <Chessboard
                areArrowsAllowed={true}
                arePiecesDraggable={true}
                arePremovesAllowed={false}
                boardOrientation="white"
                boardWidth={0.3 * window.innerWidth}
                customArrowColor={arrowColor}
                customArrows={arrows}
                customDarkSquareStyle={{ backgroundColor: "#997db5" }}
                customLightSquareStyle={{ backgroundColor: "#e6dbf1" }}
                customSquareStyles={{ ...rightClickedSquares }}
                position={positionFEN}
                promotionToSquare={"h8"}
                // Event handlers
                onArrowsChange={onArrowsChange}
                onPieceDragBegin={onPieceDragBegin}
                onPieceDrop={onPieceDrop}
                onPromotionCheck={onPromotionCheck}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
            />
        </>
    );
}
