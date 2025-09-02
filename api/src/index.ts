import { env } from "./utils/env.js";
import { createServer } from "./server.js";

const port = env.PORT || 4000;

const app = createServer();

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
})
