import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import App from './App.vue'
import router from './router'
import { store } from './store'
import Pusher from "pusher-js"
import Echo from "laravel-echo"
import VueFuse from 'vue-fuse'

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '40570976aecd9ffb53d3',
    cluster: 'eu',
    encrypted: true
});

Vue.use(VueProgressBar, {
    color: '#2196f3',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    inverse: false
});

Vue.use(VueFuse)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
