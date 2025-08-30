import { Job } from "bullmq";
import runCpp from "../containers/runCppDocker";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/SubmissionPayload";

export default class SubmissionJob implements IJob {
  name: string;
  payload?: Record<string, unknown>;
  constructor(payload: Record<string, SubmissionPayload>) {
    this.name = this.constructor.name;
    this.payload = payload;
  }
  handle = async (job?: Job) => {
    console.log("Handler of the job called");
    console.log("payload", this.payload);

    if (job) {
      const key = Object.keys(this.payload)[0];
      console.log(this.payload[key].language);
      if (this.payload[key].language === "CPP") {
        const response = await runCpp(
          this.payload[key].code,
          this.payload[key].testCase
        );
        console.log("Evaluated response ", response);
      }
    }
  };
  failed = (job?: Job): void => {
    console.log("Job failed");
    if (job) {
      console.log(job.id);
    }
  };
}
