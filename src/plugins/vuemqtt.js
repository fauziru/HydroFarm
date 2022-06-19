import Vue from 'vue'
import VueMqtt from 'vue-mqtt'

const options = {
  clean: true, // Reserved sssion
  connectTimeout: 4000, // Time out
  reconnectPeriod: 4000, // Reconnection interval
  // Certification Information
  clientId: 'client-' + Date.now(),
  username: process.env.VUE_APP_MQTT_USERNAME,
  password: process.env.VUE_APP_MQTT_PASS
}
Vue.use(VueMqtt, process.env.VUE_APP_MQTT_URL, options)
export default VueMqtt
