import Vue from 'vue'
import VueMqtt from 'vue-mqtt'

const options = {
  clean: true, // Reserved sssion
  connectTimeout: 4000, // Time out
  reconnectPeriod: 4000, // Reconnection interval
  // Certification Information
  clientId: 'mqttjs_3be2c321',
  username: 'Dhydro',
  password: 'asdasd'
}
Vue.use(VueMqtt, 'ws://192.168.43.11:8083/ws', options)
export default VueMqtt
