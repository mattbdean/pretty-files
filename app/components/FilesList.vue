<template>
    <div>
        <md-table class="files-list" :md-sort="initialSort.name" md-sort-type="initialSort.type" @sort="onSort">
            <md-table-header>
                <md-table-row>
                    <md-table-head md-sort-by="name">Name</md-table-head>
                    <md-table-head md-sort-by="size">Size</md-table-head>
                    <md-table-head md-sort-by="type">Type</md-table-head>
                    <md-table-head md-sort-by="lastModified">Modified</md-table-head>
                </md-table-row>
            </md-table-header>
            <md-table-body>
                <md-table-row v-for="file in contents" :key="file.name" @dblclick.native="onChooseDir(file)">
                    <md-table-cell>
                        <md-icon>{{ file.dir ? 'folder' : 'insert_drive_file' }}</md-icon>
                        <span class="entry-name">{{ file.name }}</span>
                    </md-table-cell>
                    <md-table-cell>{{ file.size | fileSize }}</md-table-cell>
                    <md-table-cell>{{ file.type || '-' }}</md-table-cell>
                    <md-table-cell>{{ file.lastModified | date }}</md-table-cell>
                </md-table-row>
            </md-table-body>
        </md-table>
        <md-snackbar ref="snackbar">
            <span>That directory is inaccessible</span>
        </md-snackbar>
    </div>
</template>

<script>
import os from 'os';
import path from 'path';

import fs from 'fs-extra';
import _ from 'lodash';
import mime from 'mime-types';

import dateFilter from '../filters/date.filter';
import { DIRECTORY_SIZE, fileSize } from '../filters/file-size.filter';

// Returns "/home/{username}" in linux
const getDefaultDir = os.homedir;
// Files that pass this tests are included
const includeFilter = (name) => name.indexOf('.') !== 0;

const getInitialSort = () => ({ name: 'name', type: 'asc' });

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
            contents: [],
            initialSort: getInitialSort(),
            sort: getInitialSort()
        };
    },
    methods: {
        readdir: async (dir) => {
            const names = _.filter(await fs.readdir(dir), includeFilter);
            return Promise.all(_.map(names, async (n) => {
                const stats = await fs.lstat(path.resolve(dir, n));
                const isDir = stats.isDirectory();
                return {
                    name: n,
                    dir: isDir,
                    size: isDir ? DIRECTORY_SIZE : stats.size,
                    type: isDir ? null : mime.lookup(n) || 'application/octet-stream',
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
        updateContents: async function() {
            this.contents = [];
            this.contents = this.orderBy((await this.readdir(this.dir)), this.sort);
        },

        /** Called by md-table to sort based on a given property */
        onSort: function(sort) {
            this.sort = sort;
            this.contents = this.orderBy(this.contents, this.sort);
        },

        /**
         * Orders file entries by a given sort
         *
         * @param sort.name The name of the property to sort by ('name', 'size', etc.)
         * @param sort.type Either "asc" or "desc"
         */
        orderBy: (entries, sort) => {
            let orderFn = (item) => item[sort.name];
            // Ignore case
            if (sort.name === 'name')
                orderFn = (item) => item[sort.name].toLowerCase();

            return _.orderBy(entries, [orderFn], sort.type);
        },

        /**
         * Called when the user double clicks on a row. Updates the current
         * directory to the one specified at entry.name
         */
        onChooseDir: async function(entry) {
            if (!entry.dir) return;

            const newDir = path.resolve(this.dir, entry.name);
            if (!(await this.isAccessibleDirectory(newDir))) {
                this.$refs.snackbar.open();
                return;
            }

            this.dir = newDir;
            return this.updateContents();
        }
    },
    created: async function() {
        if (!(await this.isAccessibleDirectory(this.dir))) {
            this.dir = getDefaultDir();
        }
        this.updateContents();
    },
    filters: {
        date: dateFilter,
        fileSize
    }
};
</script>

<style scoped>
.files-list * {
    user-select: none;
    cursor: default;
}

i.material-icons {
    margin: 0 8px 0 0;
}

</style>

<style>
/* Global style */
td .md-table-cell-container {
    justify-content: flex-start !important;
}
</style>
