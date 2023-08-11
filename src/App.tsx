import { Divider, Stack } from "@mui/material";
import AddQuad from "./quads/add/AddQuad";
import BoardQuad from "./quads/board/BoardQuad";
import GraphQuad from "./quads/graph/GraphQuad";
import TextQuad from "./quads/text/TextQuad";

export default function App() {
    return (
        <>
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <AddQuad />
                <BoardQuad />
                <GraphQuad />
                <TextQuad />
            </Stack>
        </>
    );
}
