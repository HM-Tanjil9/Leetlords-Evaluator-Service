import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

async function runJava(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  console.log("Initializing a new java docker container");
  await pullImage(JAVA_IMAGE);
  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > Main.java && javac Main.java && echo '${inputTestCase
    .replace(/'/g, `'\\"`)
    .trim()}' | java Main`;
  console.log(runCommand);

  const javaDockerContainer = await createContainer(JAVA_IMAGE, [
    "bin/sh",
    "-c",
    runCommand,
  ]);
  // starting or booting the corresponding docker container
  await javaDockerContainer.start();
  console.log("Started the docker container");

  const loggerStream = await javaDockerContainer.logs({
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

  await javaDockerContainer.remove();
}

export default runJava;
