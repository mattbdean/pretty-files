import chai from 'chai';
import dirtyChai from 'dirty-chai';
import path from 'path';

import { getDefaultDir } from './config.helper';
import { isAccessibleDirectory } from './path.helper';

chai.use(dirtyChai);
const expect = chai.expect;

/* eslint-env mocha */

describe('config service', () => {
    describe('getDefaultDir', () => {
        it('should return an absolute path', () => {
            expect(path.isAbsolute(getDefaultDir())).to.be.true();
        });

        it('should be accessible', async () => {
            const dir = getDefaultDir();
            expect(await isAccessibleDirectory(dir)).to.be.true();
        });
    });
});
