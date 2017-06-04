import drivelist from 'drivelist';
import fs from 'fs-extra';
import _ from 'lodash';
import mime from 'mime-types';
import path from 'path';

// Files that pass this tests are included
export const includeFilter = (name) => name.indexOf('.') !== 0;

/** The reported "size" of a directory */
export const DIRECTORY_SIZE = -1;

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

/**
 * Reads a directory and returns a Promise that resolves to an array containing
 * objects of the given shape:
 *
 * {
 *   name: string,
 *   dir: boolean (is this entry a directory?)
 *   size: number (size in bytes),
 *   type: string (mime type)
 *   lastModified: Date
 * }
 *
 * This function does not explicitly handle filesystem read errors. Make sure to
 * handle EACCES and ENOENT errors.
 *
 * @param dir The directory to read
 * @returns {Promise.<*>}
 */
export const readdir = async (dir) => {
    const names = _.filter(await fs.readdir(dir), includeFilter);
    return Promise.all(_.map(names, async (n) => {
        const stats = await fs.lstat(path.resolve(dir, n));
        const isDir = stats.isDirectory();
        return {
            name: n,
            dir: isDir,
            size: isDir ? DIRECTORY_SIZE : stats.size,
            type: isDir ? 'folder' : mime.lookup(n) || 'application/octet-stream',
            lastModified: stats.mtime
        };
    }));
};

/**
 * Orders file entries by a given sort
 *
 * @param entries Filesystem entries returned by readdir()
 * @param sort
 * @param sort.name The name of the property to sort by ('name', 'size', etc.)
 * @param sort.type Either "asc" or "desc"
 */
export const orderBy = (entries, sort) => {
    let comparators = [(item) => item[sort.name]];
    let orders = [sort.type];

    // Handle sorting by name specially
    if (sort.name === 'name') {
        comparators = [
            // Order by dir property first
            'dir',
            // Then by the name of
            (item) => item[sort.name].toLowerCase(),
        ];
        // Show directories first
        orders.unshift('desc');
    }

    return _.orderBy(entries, comparators, orders);
};

export const getMountedDrives = () => {
    return new Promise((resolve, reject) => {
        drivelist.list((error, drives) => {
            if (error) reject(error);
            else resolve(_.filter(drives, (d) => d.mountpoints.length > 0));
        });
    });
};

