import moment from 'moment';

export default function(date) {
    if (!date || typeof date !== 'number' || !(date instanceof Date)) return '';
    return moment(date).format('LLL');
}
