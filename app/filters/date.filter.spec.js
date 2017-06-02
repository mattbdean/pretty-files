import chai from 'chai';
import dirtyChai from 'dirty-chai';
import date from './date.filter';

chai.use(dirtyChai);

const expect = chai.expect;

/* eslint-env mocha */

describe('date filter', () => {
    it('should return an empty string when given something other than a Date or number', () => {
        const inputs = [undefined, null, false, { foo: 'bar' }, 'foo'];
        for (const input of inputs) {
            expect(date(input)).to.equal('');
        }
    });

    it('should return a string given a Date object or a number', () => {
        const inputs = [new Date(), 0];

        for (const input of inputs) {
            const result = date(input);
            expect(result).to.exist();
            expect(result).to.be.a('string');
        }
    });
});
