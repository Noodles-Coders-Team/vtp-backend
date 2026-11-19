import schedule, {Job, RecurrenceRule} from "node-schedule";
import {getSettingByKey, updateSetting} from "./settingsService";

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
        await switchSystemJobSetting(name, true);
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
        await switchSystemJobSetting(name, false);
    }
}

export async function switchSystemJobSetting(name: string, value: boolean): Promise<void> {
    const setting = await getSettingByKey(name);
    if (setting == null)
        return;

    setting.value = value.toString();
    await updateSetting(setting);
}