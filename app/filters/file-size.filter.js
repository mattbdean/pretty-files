import bytes from 'bytes';

/**
 * Uses the bytes library to format a number to a human-readable file size
 * @returns {string} The formatted value, or an empty string if the input
 *                   couldn't be parsed
 */
export function fileSize(input) {
    if (input === DIRECTORY_SIZE) return '-';

    let num;
    if (typeof input !== 'number') {
        num = parseInt(String(input));
        if (isNaN(num)) return '';
    } else {
        // typeof input === 'number'
        num = input;
    }
    return bytes.format(num, {
        decimalPlaces: 1
    });
}

export const DIRECTORY_SIZE = -1;
