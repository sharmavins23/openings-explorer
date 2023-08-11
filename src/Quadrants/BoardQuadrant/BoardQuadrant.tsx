import { Stack } from "@mui/material";

import Gameboard from "./Gameboard/Gameboard";

export default function BoardQuadrant() {
    return (
        <>
            <Stack spacing={2}>
                <h1>Stockfish eval (TODO)</h1>
                <Gameboard />
                <h1>Buttons (TODO)</h1>
            </Stack>
        </>
    );
}
