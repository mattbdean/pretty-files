import os from 'os';
import process from 'process';

import FilesList from '../app/FilesList.vue';
import chai from 'chai';
import dirtyChai from 'dirty-chai';

chai.use(dirtyChai);

const expect = chai.expect;

/* eslint-env mocha */

describe('FilesList', () => {
    describe('readdir', () => {
        const readdir = FilesList.methods.readdir;

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
                expect(Object.keys(entry)).to.deep.equal(['name', 'size', 'type', 'lastModified']);

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

    describe('isAccessibleDirectory', () => {
        const isAccessibleDirectory = FilesList.methods.isAccessibleDirectory;

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
});
