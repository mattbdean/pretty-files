import Vue from 'vue';

const busHelper = new Vue();

export const eventBus = Object.freeze({
    cd: (dirOrHandler) => {
        if (typeof dirOrHandler === 'function') {
            busHelper.$on('cd', dirOrHandler);
        } else if (typeof dirOrHandler === 'string') {
            busHelper.$emit('cd', dirOrHandler);
        } else {
            throw new Error('Expected argument to be a string or a function, got ' + dirOrHandler);
        }
    }
});
