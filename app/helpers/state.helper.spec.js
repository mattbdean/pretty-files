import chai from 'chai';
import dirtyChai from 'dirty-chai';
import { createBus } from './state.helper';

chai.use(dirtyChai);
const expect = chai.expect;

/* eslint-env mocha */

describe('state helper', () => {
    let bus;
    beforeEach('create event bus', () => [
        bus = createBus()
    ]);

    describe('cd', () => {
        it('should normalize input paths', (done) => {
            const dir = '/foo/bar/..//baz';
            // Register event handler
            bus.cd((d) => {
                expect(d).to.equal('/foo/baz');
                done();
            });

            // Send cd event
            bus.cd(dir);
        });

        it('should throw an Error when given something other than a string or function', () => {
            expect(() => bus.cd(true)).to.throw(Error);
        });
    });
});
