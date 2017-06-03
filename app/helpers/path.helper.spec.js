import chai from 'chai';
import dirtyChai from 'dirty-chai';
import os from 'os';

chai.use(dirtyChai);
const expect = chai.expect;

/* eslint-env mocha */

import { isAccessibleDirectory, readdir, splitPath } from './path.helper';

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

    describe('readdir', () => {
        it('should reject when given an inaccessible directory', async () => {
            try {
                await readdir('foo');
                expect('should have failed').to.equal(0);
            } catch (err) {
                // pass
            }
        });

        it('should return an array of similar objects', async () => {
            const entries = await readdir('.');
            for (const entry of entries) {
                expect(Object.keys(entry)).to.deep.equal(['name', 'dir', 'size', 'type', 'lastModified']);

                // These properties are common to both files and directories
                expect(entry.lastModified).to.be.an.instanceof(Date);
                expect(entry.name).to.be.a('string');

                // These properties will be null for a directory and non-null
                // for a file
                expect(entry.size).to.satisfy((size) => size === null || typeof size === 'number');
                expect(entry.type).to.satisfy((size) => size === null || typeof size === 'string');
            }
        });
    });
});
