import { Divider, Stack } from "@mui/material";

function App() {
    return (
        <>
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <h1>Hello, world!</h1>
                <h1>This is a test.</h1>
            </Stack>
        </>
    );
}

export default App;
