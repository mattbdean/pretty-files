import path from 'path';
import Vue from 'vue';

export const createState = () => {
    const busHelper = new Vue();
    const history = [];

    /**
     * Create a handler for/emit a 'cd' (change directory) event. If the
     * argument is a string, an event will be emitted. If the argument is a
     * function, it will be registered as a handler for the 'cd' event via
     * Vue's $on method.
     */
    const cd = (dirOrHandler) => {
        if (typeof dirOrHandler === 'function') {
            busHelper.$on('cd', dirOrHandler);
        } else if (typeof dirOrHandler === 'string') {
            const dir = path.normalize(dirOrHandler);
            history.push(dir);
            busHelper.$emit('cd', dir);
        } else {
            throw new Error('Expected argument to be a string or a function, got ' + dirOrHandler);
        }
    };

    /**
     * Revert state to a previous directory.
     *
     * ```js
     * ['/foo', '/foo/bar', '/foo/bar/baz'].forEach(state.cd);
     * state.cd(console.log);
     * state.revertCd();
     * ```
     *
     * Output: `/foo/bar`
     *
     * @param times
     */
    const revertCd = (times = 1) => {
        if (typeof times !== 'number')
            throw new Error('Expected argument to be a number, got ' + times);

        let indexes = times;
        if (indexes > history.length - 1)
            indexes = history.length - 1;

        const startIndex = history.length - indexes - 1;
        // Save this since cd() pushes to the history
        const current = history[startIndex];
        // Remove the array tail
        history.splice(startIndex, indexes + 1);
        // cd to the current directory
        cd(current);
    };

    /** Returns true if the history can be reverted */
    const canRevertCd = () =>
        history.length > 1;

    return {
        cd,
        revertCd,
        canRevertCd
    };
};

export const state = createState();
