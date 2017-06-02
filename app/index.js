import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';

import App from './components/App.vue';

import './base.scss';

Vue.use(VueMaterial);
Vue.material.registerTheme('default', {
    primary: 'blue',
    accent: 'deep-orange',
    warn: 'red'
});

new Vue({
    el: '#app',
    render: (h) => h(App),
});
