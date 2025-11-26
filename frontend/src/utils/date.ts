export function getISOFormatedDate( date: Date ): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthS = String(month).padStart(2, '0');
    const day = date.getDate();
    const dayS = String(day).padStart(2, '0');
    return `${year}-${monthS}-${dayS}`;
}