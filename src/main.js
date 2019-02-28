import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import { L } from 'vue2-leaflet'
import Snotify from 'vue-snotify';
import 'vue-snotify/styles/material.css';
// const options = {
//   toast: {
//     position: SnotifyPosition.rightTop
//   }
// }

Vue.use(BootstrapVue);
Vue.use(Snotify);

Vue.config.productionTip = false

// this part resolve an issue where the markers would not appear
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

new Vue({
  render: h => h(App),
}).$mount('#app')
