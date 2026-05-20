/**
 * @param date
 * @param seconds
 */
export const datePlusSomeTime = (date: Date, seconds: number) => {
    return new Date(date.getTime() + (seconds * 1000))
}


const parseDateTimestamp = (date: Date | string) => {
    const timestamp = date instanceof Date ? date.getTime() : new Date(date).getTime();

    if (Number.isNaN(timestamp)) {
        throw new Error(`Invalid date: ${date}`);
    }

    return timestamp;
};

export const getDateProgressPercentage = (
    startDate: Date | string,
    endDate: Date | string,
    currentDate = new Date()
) => {
    const start = parseDateTimestamp(startDate);
    const end = parseDateTimestamp(endDate);
    const current = parseDateTimestamp(currentDate);

    const total = end - start;
    const passed = current - start;

    if (total <= 0) {
        return current >= end ? 100 : 0;
    }

    return Math.max(0, Math.min(100, (passed / total) * 100));
};
