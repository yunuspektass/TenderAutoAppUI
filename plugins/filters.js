import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'

dayjs.locale('tr')

Vue.filter('formatDate', (value) => {
  if (value) {
    return dayjs(value).format('DD MMMM YYYY, hh:mm')
  }
  return ''
})

Vue.filter('formatCurrency', (value) => {
  const formatter = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  })
  return formatter.format(value)
})
