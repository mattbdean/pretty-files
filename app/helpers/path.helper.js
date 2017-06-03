import fs from 'fs-extra';
import path from 'path';

/**
 * Tests if the contents of a given directory can be read by the
 * Electron process. Returns a Promise that resolves to a boolean.
 */
export const isAccessibleDirectory = async (dir) => {
    try {
        await fs.access(dir, fs.constants.R_OK);
        return (await fs.lstat(dir)).isDirectory();
    } catch (err) {
        // Doesn't exist or not readable
        return false;
    }
};

/**
 * Splits an absolute path into its parts. For example:
 *
 * splitPath('/foo/bar/../baz//qux') ==> ['/', 'foo', 'baz', 'qux']
 */
export const splitPath = (p) => {
    if (!path.isAbsolute(p)) throw new Error(`Expecting "${p}" to be absolute`);
    const parts = path.normalize(p).split(path.sep);
    if (process.platform === 'linux') parts[0] = '/';
    return parts;
};
