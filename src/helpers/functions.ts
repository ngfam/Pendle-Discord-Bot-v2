import { EmbedFieldData } from 'discord.js';

export function numberPrettify(num: number | string): string {
    if (typeof num === 'string') {
        num = parseFloat(num);
    }
    num = toFixed(num);
    var str = num.toString().split('.');
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return str.join('.');
}

export function toFixed(num: number): number {
    if (num < 1) return parseFloat(num.toFixed(3));
    if (num < 100) return parseFloat(num.toFixed(1));
    return parseFloat(num.toFixed(0));
}

export function convertUnixToDate(UNIX_timestamp: number) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
    ];
    const month = months[a.getMonth()];
    const date = a.getDate();
    return `${month} ${date}`;
}

export function getField(name: string, lines: string[], inline: boolean): EmbedFieldData {
    return {
        name: name,
        value: lines.join('\n'),
        inline: inline,
    };
}
