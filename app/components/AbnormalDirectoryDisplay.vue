<template>
<div class="contents">
    <p :class="cssClass + ' non-interactive'">{{ message }}</p>
    <md-button class="md-raised md-primary" @click.native="onBackRequested">Go back</md-button>
</div>
</template>
<script>
import { state } from '../helpers/state.helper';

export default {
    props: {
        message: {
            type: String,
            required: true
        },
        cssClass: {
            type: String,
            default: 'md-display-1'
        }
    },
    methods: {
        onBackRequested: () => { state.revertCd(); }
    }
};
</script>
<style scoped>
.contents {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

p {
    text-align: center;
}
</style>
