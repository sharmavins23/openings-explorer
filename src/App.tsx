import { Divider, Stack } from "@mui/material";

import AddQuadrant from "./Quadrants/AddQuadrant/AddQuadrant";
import BoardQuadrant from "./Quadrants/BoardQuadrant/BoardQuadrant";
import GraphQuadrant from "./Quadrants/GraphQuadrant/GraphQuadrant";
import TextQuadrant from "./Quadrants/TextQuadrant/TextQuadrant";

export default function App() {
    return (
        <>
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <AddQuadrant />
                <BoardQuadrant />
                <GraphQuadrant />
                <TextQuadrant />
            </Stack>
        </>
    );
}
