import fs from "fs";
import path from 'path';
import morgan from "morgan";
import { createStream } from "rotating-file-stream";

const projectRoot = process.cwd();

const srcLogDirectory = path.join(projectRoot, "src", "logs");
const distLogDirectory = path.join(projectRoot, "dist", "logs");

[srcLogDirectory, distLogDirectory].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        console.log("Creating log directory:", dir);
        fs.mkdirSync(dir, { recursive: true });
    }
});

const srcLogStream = createStream("access.log", {
    interval: "7d",
    path: srcLogDirectory,
    maxFiles: 4,
});

const distLogStream = createStream("access.log", {
    interval: "7d",
    path: distLogDirectory,
    maxFiles: 4,
});

const logger = morgan("combined", {
    stream: {
        write: (message) => {
            srcLogStream.write(message);
            distLogStream.write(message);
        },
    },
});

export default logger;