<template>
    <div class="app-wrapper">
        <sidenav class="sidenav"></sidenav>
        <div class="main-content-wrapper">
            <location-breadcrumb></location-breadcrumb>
            <files-list class="files-list"></files-list>
        </div>
    </div>
</template>

<script>
import { getDefaultDir } from '../helpers/config.helper';
import { state } from '../helpers/state.helper';

import FilesList from './FilesList.vue';
import LocationBreadcrumb from './LocationBreadcrumb.vue';
import Sidenav from './Sidenav.vue';

export default {
    components: {
        FilesList,
        LocationBreadcrumb,
        Sidenav
    },
    mounted: () => {
        state.cd(getDefaultDir());
    }
};
</script>

<style scoped>
.sidenav {

    box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
}
.app-wrapper {
    display: flex;
    flex-direction: row;
}

.main-content-wrapper {
    flex-grow: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.main-content-wrapper .files-list {
    flex-grow: 1;
}
</style>
