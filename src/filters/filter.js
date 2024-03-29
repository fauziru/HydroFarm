/* eslint-disable */
import Vue from 'vue'

const CDate = date => {
  return !date ? new Date().getTime() : new Date(date).getTime()
}

Vue.filter('newBadge', function (time) {
  var dift_d = Math.floor((CDate() - CDate(time)) / 1000 / 86400)
  return dift_d < 1
})

Vue.filter('cD', t => {
  var dift_s = (CDate() - CDate(t)) / 1000
  var dift_d = Math.floor(dift_s / 86400)
  switch (true) {
    case dift_d == 0:
      switch (true) {
        case dift_s < 10:
          return 'Baru Saja'
        case dift_s < 60:
          return Math.floor(dift_s) + ' Detik'
        case dift_s < 3600:
          return Math.floor(dift_s / 60) + ' Menit'
        case dift_s < 86400:
          return Math.floor(dift_s / 3600) + ' Jam'
      }
      break
    case dift_d == 1:
      return 'Kemarin'
    case dift_d < 7:
      return dift_d + ' Hari'
    case dift_d < 31:
      return Math.floor(dift_d / 7) + ' Minggu'
    case dift_d < 365:
      return Math.floor(dift_d / 31) + ' Bulan'
    case dift_d > 365:
      return Math.floor(dift_d / 365) + ' Tahun'
  }
})

Vue.filter('typeNotif', function (section, attribute) {
  const keyIconColor = [
    {
      type: 'AppNotificationsReachThreshold',
      title: 'Pemberitahuan sensor',
      icon: 'mdi-leak',
      color: 'green'
    },
    {
      type: 'AppNotificationsAdminActivity',
      title: 'Aktivitas',
      icon: 'mdi-history',
      color: 'blue lighten-1'
    }
  ]
  section = section.replace(/\\/g, '')
  const item = Object.values(keyIconColor).filter(e => e.type == section)
  return item[0][attribute]
})

Vue.filter('truncate', function (text, length, suffix) {
  return text.length > length ? text.substring(0, length) + suffix : text
})

Vue.filter('toString', function (data) {
  return data.toString()
})
