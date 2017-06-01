<template>
    <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Type</th>
            <th>Modified</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="file in contents">
            <td>{{ file.name }}</td>
            <td>{{ file.size || '-' }}</td>
            <td>{{ file.type || '-' }}</td>
            <td>{{ file.lastModified }}</td>
        </tr>
        </tbody>
    </table>
</template>

<script>
import os from 'os';
import path from 'path';

import fs from 'fs-extra';
import _ from 'lodash';
import mime from 'mime-types';

// Returns "/home/{username}" in linux
const getDefaultDir = os.homedir;

export default {
    props: {
        initialDir: {
            type: String,
            default: getDefaultDir
        }
    },
    data: function() {
        return {
            dir: this.initialDir,
            contents: []
        }
    },
    methods: {
        readdir: async (dir) => {
            const names = await fs.readdir(dir);
            return Promise.all(_.map(names, async (n) => {
                const stats = await fs.lstat(path.resolve(dir, n));
                return {
                    name: n,
                    size: stats.isDirectory() ? null : stats.size,
                    type: stats.isDirectory() ? null : mime.lookup(n) || 'application/octet-stream',
                    lastModified: stats.mtime
                };
            }));
        },

        /**
         * Tests if the contents of a given directory can be read by the
         * Electron process. Returns a Promise that resolves to a boolean.
         */
        isAccessibleDirectory: async (dir) => {
            try {
                await fs.access(dir, fs.constants.R_OK);
                return (await fs.lstat(dir)).isDirectory();
            } catch (err) {
                // Doesn't exist or not readable
                return false;
            }
        },

        /**
         * Update the contents array based on the current directory
         * @private
         */
        _updateContents: function() {
            const vm = this;

            this.contents = [];
            this.readdir(this.dir).then(function(contents) {
                vm.contents = contents;
            });
        }
    },
    created: async function() {
        if (!(await this.isAccessibleDirectory(this.dir))) {
            this.dir = getDefaultDir();
        }
        this._updateContents();
    }
}
</script>
