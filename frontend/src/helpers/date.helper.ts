/**
 * @param date
 * @param seconds
 */
export const datePlusSomeTime = (date: Date, seconds: number) => {
    return new Date(date.getTime() + (seconds * 1000))
}


export const getDateProgressPercentage = (startDate: Date | string, endDate: Date | string, currentDate = new Date()) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const current = new Date(currentDate).getTime();

    const total = end - start;
    const passed = current - start;

    if (total <= 0) {
        return current >= end ? 100 : 0;
    }

    return Math.max(0, Math.min(100, (passed / total) * 100));
}
