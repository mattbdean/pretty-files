<template>
    <md-table :md-sort="initialSort.name" md-sort-type="initialSort.type" @sort="onSort">
        <md-table-header>
            <md-table-row>
                <md-table-head md-sort-by="name">Name</md-table-head>
                <md-table-head md-sort-by="size">Size</md-table-head>
                <md-table-head md-sort-by="type">Type</md-table-head>
                <md-table-head md-sort-by="lastModified">Modified</md-table-head>
            </md-table-row>
        </md-table-header>
        <md-table-body>
            <md-table-row v-for="file in contents" :key="file.name">
                <md-table-cell>{{ file.name }}</md-table-cell>
                <md-table-cell>{{ file.size || '-' }}</md-table-cell>
                <md-table-cell>{{ file.type || '-' }}</md-table-cell>
                <md-table-cell>{{ file.lastModified | date }}</md-table-cell>
            </md-table-row>
        </md-table-body>
    </md-table>
</template>

<script>
import os from 'os';
import path from 'path';

import fs from 'fs-extra';
import _ from 'lodash';
import mime from 'mime-types';

import dateFilter from '../filters/date.filter';

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
                vm.contents = vm.orderBy(contents, vm.sort);
            });
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
        }
    },
    created: async function() {
        if (!(await this.isAccessibleDirectory(this.dir))) {
            this.dir = getDefaultDir();
        }
        this._updateContents();
    },
    filters: {
        date: dateFilter
    }
};
</script>
