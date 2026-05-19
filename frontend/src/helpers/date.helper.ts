/**
 * @param date
 * @param seconds
 */
export const datePlusSomeTime = (date: Date, seconds: number) => {
    return new Date(date.getTime() + (seconds * 1000))
}


const parseLocalDate = (date: Date | string) => {
    if (typeof date === 'string') {
        return new Date(date.replace('Z', ''));
    }

    return new Date(date);
};

export const getDateProgressPercentage = (
    startDate: Date | string,
    endDate: Date | string,
    currentDate = new Date()
) => {
    const start = parseLocalDate(startDate).getTime();
    const end = parseLocalDate(endDate).getTime();
    const current = parseLocalDate(currentDate).getTime();

    const total = end - start;
    const passed = current - start;

    if (total <= 0) {
        return current >= end ? 100 : 0;
    }

    return Math.max(0, Math.min(100, (passed / total) * 100));
};