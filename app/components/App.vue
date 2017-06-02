<template>
    <div class="app-wrapper">
        <files-list></files-list>
    </div>
</template>

<script>
import FilesList from './FilesList.vue';

export default {
    components: {
        FilesList
    }
};
</script>

<style scoped>
.app-wrapper {
    height: 100%;
}
</style>
