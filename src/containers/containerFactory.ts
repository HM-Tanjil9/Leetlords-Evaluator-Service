import Docker from "dockerode";

async function createContainer(imageName: string, cdmExecutable: string[]) {
  const docker = new Docker();
  const container = await docker.createContainer({
    Image: imageName,
    Cmd: cdmExecutable,
    AttachStdin: true, // enable input streams
    AttachStdout: true, // enable output streams
    AttachStderr: true, // enable err streams
    Tty: false,
    OpenStdin: true, // keep the terminal open or ready to input
  });

  return container;
}

export default createContainer;
