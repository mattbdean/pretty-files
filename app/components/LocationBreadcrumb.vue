<template>
    <md-toolbar class="md-primary">
        <div class="breadcrumb-wrapper">
            <span class="breadcrumb" v-for="(part, index) in parts" @click="onSelect(index)">{{ part }}</span>
        </div>
    </md-toolbar>
</template>

<script>
import path from 'path';

import { eventBus } from '../helpers/state.helper';
import { splitPath } from '../helpers/path.helper';

export default {
    props: {
        initialDir: {
            type: String,
            required: true
        }
    },
    data: function() {
        return {
            dir: this.initialDir
        };
    },
    computed: {
        parts: function() {
            return splitPath(this.dir);
        }
    },
    methods: {
        onSelect: function(partIndex) {
            const newDir = path.normalize(this.parts.slice(0, partIndex + 1).join(path.sep));
            if (this.dir !== newDir) {
                this.dir = newDir;
                eventBus.cd(newDir);
            }
        }
    },
    created: function() {
        const vm = this;
        eventBus.cd((newDir) => {
            if (vm.dir !== newDir) vm.dir = newDir;
        });
    }
};
</script>

<style lang="scss">
.breadcrumb-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    padding-left: 15px;
    height: 100%;
}

.breadcrumb {
    display: flex;
    flex-direction: row;
    align-items: center;

    user-select: none;
    cursor: pointer;

    color: rgba(255, 255, 255, 0.7);
    font-size: 18px;
    transition: color 0.2s;

    &::before {
        //noinspection CssNoGenericFontName
        font-family: 'Material Icons';
        // chevron-right
        content: '\E5CC';
        font-size: 25px;
        margin: 0 4px;

        position: relative;
        top: 2px;
    }

    &:first-child::before {
        // No chevron for the first child
        content: '';
    }

    &:hover {
        color: #FFF;
    }
}
</style>
