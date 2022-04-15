import Vue from 'vue'
import moment from 'moment'

Vue.filter('myHourTime', created => moment(created).format('h:mm A'))

Vue.filter('myHourTimeComplete', created => moment(created).format('h:mm:ss A'))
