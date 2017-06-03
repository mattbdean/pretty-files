<template>
    <div class="wrapper">
        <abnormal-directory-display v-if="empty" @back="navigateUp" message="This folder is empty"></abnormal-directory-display>
        <md-table v-else class="files-list" :md-sort="initialSort.name" md-sort-type="initialSort.type" @sort="onSort">
            <md-table-header>
                <md-table-row>
                    <md-table-head md-sort-by="name">Name</md-table-head>
                    <md-table-head md-sort-by="size">Size</md-table-head>
                    <md-table-head md-sort-by="type">Type</md-table-head>
                    <md-table-head md-sort-by="lastModified">Modified</md-table-head>
                </md-table-row>
            </md-table-header>
            <md-table-body>
                <md-table-row v-for="file in contents" :key="file.name" @dblclick.native="onChoose(file)">
                    <md-table-cell>
                        <md-icon :md-src="file.dir ? folderIcon : fileIcon"></md-icon>
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
import path from 'path';

import { shell } from 'electron';
import _ from 'lodash';

import AbnormalDirectoryDisplay from '../components/AbnormalDirectoryDisplay.vue';
import dateFilter from '../filters/date.filter';
import { fileSize } from '../filters/file-size.filter';
import { eventBus } from '../helpers/event-bus.helper';
import fileIcon from '../../assets/file-outline.svg';
import folderIcon from '../../assets/folder.svg';
import { isAccessibleDirectory, orderBy, readdir } from '../helpers/path.helper';

const getInitialSort = () => ({ name: 'name', type: 'asc' });

export default {
    props: {
        initialDir: {
            type: String,
            required: true
        }
    },
    data: function() {
        return {
            dir: this.initialDir,
            empty: false,
            contents: [],
            initialSort: getInitialSort(),
            sort: getInitialSort(),
            fileIcon,
            folderIcon
        };
    },
    methods: {
        /**
         * Update the contents array based on the current directory
         * @private
         */
        updateContents: async function() {
            this.contents = null;
            this.contents = orderBy((await readdir(this.dir)), this.sort);
            this.empty = this.contents.length === 0;
        },

        /** Called by md-table to sort based on a given property */
        onSort: function(sort) {
            this.sort = sort;
            this.contents = orderBy(this.contents, this.sort);
        },

        /**
         * Called when the user double clicks on a row. Updates the current
         * directory to the one specified at entry.name
         */
        onChoose: async function(entry) {
            const newPath = path.resolve(this.dir, entry.name);
            if (entry.dir) {
                if (!(await isAccessibleDirectory(newPath))) {
                    this.$refs.snackbar.open();
                    return;
                }

                return this.cd(newPath);
            } else {
                shell.openItem(newPath);
            }
        },

        cd: async function(newDir) {
            this.dir = newDir;
            eventBus.cd(newDir);
            return this.updateContents();
        },

        navigateUp: function() {
            return this.cd(path.resolve(this.dir, '..'));
        }
    },
    created: async function() {
        if (!(await isAccessibleDirectory(this.dir))) {
            throw new Error('not accessible: ' + this.dir);
        }
        const vm = this;
        eventBus.cd((newDir) => {
            // Make sure the paths are different so we don't run into a stack
            // overflow
            if (vm.dir !== newDir) vm.dir = newDir;
            vm.updateContents();
        });
        return this.updateContents();
    },
    filters: {
        date: dateFilter,
        fileSize
    },
    components: {
        AbnormalDirectoryDisplay
    }
};
</script>

<style scoped>
.files-list * {
    user-select: none;
    cursor: default;
}

i.md-icon {
    margin: 0 8px 0 0;
}

.wrapper {
    height: 100%;
    overflow: auto;
}

</style>

<style>
/* Global style */
td .md-table-cell-container {
    justify-content: flex-start !important;
}
</style>
