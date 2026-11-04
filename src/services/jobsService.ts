import schedule, {Job, RecurrenceRule} from "node-schedule";

const jobs: Record<string, Job | null> = {};


//Returns true if Job is running
export function isJobRunning(name: string) {
    return !!jobs[name];
}


//Creates a job or disables it based on provided recurrence rule and async Function
export async function toggleJobRunner(rule: RecurrenceRule, name: string, jobFunction: () => Promise<void>) {
    const job = jobs[name];
    if (!job) {
        console.log(`Scheduling ${name} job!`);
        jobs[name] = schedule.scheduleJob(rule, async function () {
            console.log(`Starting job: ${name}`);
            try {
                await jobFunction();
            } catch (e) {
                console.error(`Error while running ${jobFunction.name}!`);
                console.error((e as Error).message);
            } finally {
                console.log(`Job ${name} finished.`);
            }
        });
    } else {
        console.log(`Cancelling ${name} job!`);
        job.cancel(false);
        jobs[name] = null;
    }
}