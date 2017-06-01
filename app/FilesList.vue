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

export default {
    data: () => {
        return {
            dir: '',
            contents: []
        }
    },
    watch: {
        dir: function() {
            this.contents = [];
            this.readdir().then(function(contents) {
                this.contents = contents;
            });
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
        }
    },
    created: function() {
        // Initialize to home directory (e.g. /home/{username} on linux)
        this.dir = os.homedir();
    }
}
</script>
