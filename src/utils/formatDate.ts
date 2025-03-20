export const formatDate = (date: Date | string | number, format: string = 'DD-MM-YYYY', locale: string = 'vi-VN'): string => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    const parts = formatter.formatToParts(date);

    const dateParts: Record<string, string> = {};
    parts.forEach(({ type, value }) => {
        dateParts[type] = value;
    });

    return format
        .replace('YYYY', dateParts.year)
        .replace('MM', dateParts.month)
        .replace('DD', dateParts.day)
        .replace('HH', dateParts.hour)
        .replace('mm', dateParts.minute)
        .replace('ss', dateParts.second);
};