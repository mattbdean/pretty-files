import path from 'path';
import Vue from 'vue';

export const createBus = () => {
    const busHelper = new Vue();

    return {
        cd: (dirOrHandler) => {
            if (typeof dirOrHandler === 'function') {
                busHelper.$on('cd', dirOrHandler);
            } else if (typeof dirOrHandler === 'string') {
                busHelper.$emit('cd', path.normalize(dirOrHandler));
            } else {
                throw new Error('Expected argument to be a string or a function, got ' + dirOrHandler);
            }
        }
    };
};

export const eventBus = createBus();
