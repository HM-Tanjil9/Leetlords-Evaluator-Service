import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runPython(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  console.log("Initializing a new python docker container");

  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > test.py && echo '${inputTestCase
    .replace(/'/g, `'\\"`)
    .trim()}' | python3 test.py`;
  console.log(runCommand);

  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    "bin/sh",
    "-c",
    runCommand,
  ]);
  // starting or booting the corresponding docker container
  await pythonDockerContainer.start();
  console.log("Started the docker container");

  const loggerStream = await pythonDockerContainer.logs({
    stdout: true,
    stderr: true,
    timestamps: false,
    follow: true, // logs are streams or returned as a string
  });

  // Attach events on the stream objects to start and stop reading
  loggerStream.on("data", (chunk) => {
    rawLogBuffer.push(chunk);
  });

  await new Promise((res) => {
    loggerStream.on("end", () => {
      console.log("raw", rawLogBuffer);
      const completedBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStream(completedBuffer);
      console.log(decodedStream);
      console.log(decodedStream.stdout);
      res(decodedStream);
    });
  });

  await pythonDockerContainer.remove();
}

export default runPython;
