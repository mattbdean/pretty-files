<template>
    <div class="app-wrapper">
        <location-breadcrumb :initial-dir="dir"></location-breadcrumb>
        <files-list class="files-list" :initial-dir="dir"></files-list>
    </div>
</template>

<script>
import { getDefaultDir } from '../helpers/config.helper';

import FilesList from './FilesList.vue';
import LocationBreadcrumb from './LocationBreadcrumb.vue';

export default {
    data: () => ({
        dir: getDefaultDir()
    }),
    components: {
        FilesList,
        LocationBreadcrumb
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
