const { spawn } = require("node:child_process"); // node: prefix for core modules
const path = require('node:path');

const SCRIPT_FILE = "auto.js";
const SCRIPT_PATH = path.join(__dirname, SCRIPT_FILE);

function start() {
    const main = spawn("node", [SCRIPT_PATH], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    main.on("close", (exitCode) => {
        switch (exitCode) {
            case 0:
                console.log("Main process exited normally");
                break;
            case 1:
                console.log("Main process requested restart");
                start();
                break;
            default:
                console.error(`Main process crashed with code ${exitCode}`);
        }
    });

    main.on("error", (error) => {
        console.error("Failed to start subprocess:", error);
        setTimeout(start, 1000); // Retry after 1 second on error
    });
}

start();
