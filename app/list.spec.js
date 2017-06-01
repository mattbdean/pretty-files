import Vue from 'vue';
import list from '../app/list.vue';

describe('list', () => {
    describe('readdir', () => {
        const readdir = list.methods.readdir;

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
});
