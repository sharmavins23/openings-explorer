import { Stack } from "@mui/material";
import Chessboard from "./Chessboard/Chessboard";

export default function BoardQuadrant() {
    return (
        <>
            <Stack spacing={2}>
                <h1>Stockfish eval (TODO)</h1>
                <Chessboard />
                <h1>Buttons (TODO)</h1>
            </Stack>
        </>
    );
}
