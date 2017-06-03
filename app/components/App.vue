<template>
    <div class="app-wrapper">
        <location-breadcrumb></location-breadcrumb>
        <files-list class="files-list"></files-list>
    </div>
</template>

<script>
import { getDefaultDir } from '../helpers/config.helper';
import { state } from '../helpers/state.helper';

import FilesList from './FilesList.vue';
import LocationBreadcrumb from './LocationBreadcrumb.vue';

export default {
    components: {
        FilesList,
        LocationBreadcrumb
    },
    mounted: () => {
        state.cd(getDefaultDir());
    }
};
</script>

<style scoped>
.app-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.app-wrapper .files-list {
    flex-grow: 1;
}
</style>
