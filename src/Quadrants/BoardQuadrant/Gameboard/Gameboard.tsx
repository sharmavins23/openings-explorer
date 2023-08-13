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

    // Move options and move select
    const moveOptionColor = "rgba(0, 0, 0, 0.2)";
    const [moveOptions, setMoveOptions] = useState<CustomSquareStyles>({});
    const moveSelectColor = "rgba(255, 0, 255, 0.4)";
    const [moveSelect, setMoveSelect] = useState<CustomSquareStyles>({});
    const [lastSelectedSquare, setLastSelectedSquare] = useState<Square | null>(
        null
    );

    // Last move highlighting
    const lastMoveColor = "rgba(0, 255, 0, 0.2)";
    const [lastMoveSquares, setLastMoveSquares] = useState<CustomSquareStyles>(
        {}
    );

    // Right-click square highlighting
    const highlightedSquareColor = "rgba(0, 0, 255, 0.4)";
    const [rightClickedSquares, setRightClickedSquares] =
        useState<CustomSquareStyles>({});

    // TODO: Check/mate highlighting

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
        // Reset highlighted squares - Arrows are automatically reset for us
        //  for no reason. This library is bad
        setRightClickedSquares({});

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

        // Reset highlight info if the move was legal
        if (move) {
            setMoveOptions({});
            setMoveSelect({});
            setLastSelectedSquare(null);
            setLastMoveSquares({
                [move.from]: { backgroundColor: lastMoveColor },
                [move.to]: { backgroundColor: lastMoveColor },
            });
        }

        // Now that the move is legal, update it in the game
        setPositionFEN(chess.fen());

        return Boolean(move).valueOf();
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

        // Short circuit: If we click one of the move options, make the move
        if (lastSelectedSquare && moveOptions[square]) {
            // Get the piece on the square
            const pieceOnSquare: Piece | null = chess.get(lastSelectedSquare);
            if (!pieceOnSquare) return; // This should never happen

            // Attempt the move. Re-use onPieceDrop()
            onPieceDrop(
                lastSelectedSquare,
                square,
                // Why does this function take in strings?!
                `${pieceOnSquare.color}${pieceOnSquare.type.toUpperCase()}`
            );

            return;
        }

        // Reset any move options squares
        setMoveOptions({});
        // Reset any move select squares
        setMoveSelect({});
        setLastSelectedSquare(null);

        // Get the piece on the square
        const moves: Move[] = chess.moves({ square, verbose: true });

        // Shortcut - If no moves, don't do anything
        if (moves.length === 0) return;

        // Set this square as the last selected move
        setLastSelectedSquare(square);
        // Highlight the square
        setMoveSelect({
            [square]: { backgroundColor: moveSelectColor },
        });

        // Make a temporary mapping of next moves
        let nextMoves: CustomSquareStyles = {};
        moves.map((move) => {
            // Get a corresponding square from move.to
            const moveTo: Square | boolean = coerceStringToSquare(move.to);

            if (moveTo === false) return;
            if (typeof moveTo === "boolean") return; // TypeScript, why must I write a proof for this garbage?

            // Check if this is a capturing move
            let isCapturingMove: boolean = Boolean(
                chess.get(move.to) && // The square exists
                    // The color of the piece on the square is different
                    chess.get(move.to)!.color !== chess.get(square)!.color
            ).valueOf();

            // Set the option squares to be highlighted
            nextMoves = {
                ...nextMoves,
                [moveTo]: {
                    background: isCapturingMove
                        ? `radial-gradient(circle, ${moveOptionColor} 65%, transparent 67%)`
                        : `radial-gradient(circle, ${moveOptionColor} 10%, transparent 12%)`,
                },
            };
        });

        // Update the move options
        setMoveOptions(nextMoves);

        console.log(lastSelectedSquare);
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
                customSquareStyles={{
                    ...moveOptions,
                    ...moveSelect,
                    ...lastMoveSquares,
                    ...rightClickedSquares,
                }}
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

    // ===== Helper functions ==================================================

    // String checking to square object
    function coerceStringToSquare(str: string): Square | boolean {
        const squareValues: string[] = [
            "a8",
            "b8",
            "c8",
            "d8",
            "e8",
            "f8",
            "g8",
            "h8",
            "a7",
            "b7",
            "c7",
            "d7",
            "e7",
            "f7",
            "g7",
            "h7",
            "a6",
            "b6",
            "c6",
            "d6",
            "e6",
            "f6",
            "g6",
            "h6",
            "a5",
            "b5",
            "c5",
            "d5",
            "e5",
            "f5",
            "g5",
            "h5",
            "a4",
            "b4",
            "c4",
            "d4",
            "e4",
            "f4",
            "g4",
            "h4",
            "a3",
            "b3",
            "c3",
            "d3",
            "e3",
            "f3",
            "g3",
            "h3",
            "a2",
            "b2",
            "c2",
            "d2",
            "e2",
            "f2",
            "g2",
            "h2",
            "a1",
            "b1",
            "c1",
            "d1",
            "e1",
            "f1",
            "g1",
            "h1",
        ];

        if (squareValues.includes(str)) {
            return str as Square;
        } else {
            return false;
        }
    }
}
