export async function startJobs() {
    const { startReminderJob } = await import(
        "../modules/cashier/reminder.job"
    );

    startReminderJob();
}   