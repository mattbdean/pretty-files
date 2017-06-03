import chai from 'chai';
import dirtyChai from 'dirty-chai';
import { createState } from './state.helper';

chai.use(dirtyChai);
const expect = chai.expect;

/* eslint-env mocha */

describe('state helper', () => {
    let state;
    beforeEach('create event bus', () => [
        state = createState()
    ]);

    describe('cd', () => {
        it('should normalize input paths', (done) => {
            const dir = '/foo/bar/..//baz';
            // Register event handler
            state.cd((d) => {
                expect(d).to.equal('/foo/baz');
                done();
            });

            // Send cd event
            state.cd(dir);
        });

        it('should throw an Error when given something other than a string or function', () => {
            expect(() => state.cd(true)).to.throw(Error);
        });
    });

    describe('revertCd', () => {
        const dirs = ['/foo', '/foo/bar', '/foo/bar/baz'];
        beforeEach('create history', () => {
            dirs.forEach(state.cd);
        });

        it('should send a cd event', (done) => {
            state.cd((newDir) => {
                expect(newDir).to.equal(dirs[dirs.length - 2]);
                done();
            });
            state.revertCd();
        });

        it('shouldn\'t revert past the original state', (done) => {
            state.cd((newDir) => {
                expect(newDir).to.equal(dirs[0]);
                done();
            });

            state.revertCd(dirs.length);
        });
    });

    describe('canRevertCd', () => {
        const dirs = ['/foo', '/foo/bar', '/foo/bar/baz'];
        beforeEach('create history', () => {
            dirs.forEach(state.cd);
        });

        it('should expect that there is at least 1 item in the history', () => {
            expect(state.canRevertCd()).to.be.true();

            state.revertCd(dirs.length);
            expect(state.canRevertCd()).to.be.false();
        });
    });
});
