import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import bodyParser from "body-parser";
import express, { Express } from "express";
import serverConfig from "./config/serverConfig";
import runCpp from "./containers/runCppDocker";
import sampleQueue from "./queues/sampleQueue";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/ui");

createBullBoard({
  queues: [new BullMQAdapter(sampleQueue)],
  serverAdapter,
});

app.use("/ui", serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *: ${serverConfig.PORT}`);
  // This worker's is job listener, worker's duty is to complete the job
  SampleWorker("SampleQueue");
  const code = `
  #include<iostream>
  #include<stdio.h>
  using namespace std;

  int main() {
    int x;
    cin>>x;
    cout<<"Value of x is "<<x<<" ";
    for(int i=0; i<x; i++) {
      cout<<i<<" ";
    }
    fflush(stdout);
    return 0;
  }
  `;
  const testCase = `10`;
  runCpp(code, testCase);
});
