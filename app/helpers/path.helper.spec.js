import chai from 'chai';
import dirtyChai from 'dirty-chai';
import os from 'os';

chai.use(dirtyChai);
const expect = chai.expect;

/* eslint-env mocha */

import { isAccessibleDirectory, splitPath } from './path.helper';

describe('path helper', () => {
    describe('isAccessibleDirectory', () => {
        it('should resolve to false when given a non-existent directory', async () => {
            expect(await isAccessibleDirectory('/foo/bar')).to.be.false();

            if (process.platform !== 'win32') {
                expect(await isAccessibleDirectory('/root')).to.be.false();
            }
        });

        it('should resolve to true when given a dir that exists',  async () => {
            expect(await isAccessibleDirectory('.')).to.be.true();
            expect(await isAccessibleDirectory(os.homedir())).to.be.true();
        });
    });

    describe('splitPath', () => {
        it('should preserve the filesystem root ', () => {
            expect(splitPath('/foo/bar/baz')).to.deep.equal(['/', 'foo', 'bar', 'baz']);
        });

        it('should normalize the input path', () => {
            expect(splitPath('/foo/bar/../baz//qux')).to.deep.equal(['/', 'foo', 'baz', 'qux']);
        });

        it('should require an absolute path', () => {
            expect(() => splitPath('foo/bar')).to.throw(Error);
        });
    });
});
