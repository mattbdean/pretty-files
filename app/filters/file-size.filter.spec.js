import chai from 'chai';
import dirtyChai from 'dirty-chai';
import { DIRECTORY_SIZE, fileSize } from './file-size.filter';

chai.use(dirtyChai);

const expect = chai.expect;

/* eslint-env mocha */

describe('file-size filter', () => {
    it('should return an empty string when given a non-"numbery" input', () => {
        const inputs = [{ foo: 'bar' }, true, false, [], null, undefined];
        for (const input of inputs) {
            expect(fileSize(input)).to.equal('');
        }
    });

    it('should return a string given a number or number string', () => {
        expect(fileSize(1000)).to.equal('1000B');
        expect(fileSize(1024)).to.equal('1kB');
        expect(fileSize(Math.pow(1024, 3))).to.equal('1GB');

        expect(fileSize('1000')).to.equal(fileSize(1000));
    });

    it('should handle directory sizes differently', () => {
        expect(fileSize(DIRECTORY_SIZE)).to.equal('-');
    });
});
