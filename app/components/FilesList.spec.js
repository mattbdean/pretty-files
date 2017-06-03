import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Vue from 'vue';
import VueMaterial from 'vue-material';

Vue.use(VueMaterial);

import FilesList from './FilesList.vue';

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
