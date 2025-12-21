type CountdownTarget = Date | string | number;

const DEFAULT_COUNTDOWN_TARGET_ISO =
    process.env.NEXT_PUBLIC_COUNTDOWN_TARGET_DATE ?? '2030-01-01T00:00:00.000Z';

const resolveTargetDate = (target?: CountdownTarget): Date => {
    if (target === undefined || target === null) return new Date(DEFAULT_COUNTDOWN_TARGET_ISO);
    return target instanceof Date ? target : new Date(target);
};

export const countdownTime = (target?: CountdownTarget) => {
    const targetDate: Date = resolveTargetDate(target);
    const currentDate: Date = new Date();
    const difference: number = targetDate.getTime() - currentDate.getTime();

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
}