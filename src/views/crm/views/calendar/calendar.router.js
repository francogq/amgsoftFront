import CalendarAppointment from '@/views/crm/views/calendar/components/appointment/default.vue'
import CalendarTask from '@/views/crm/views/calendar/components/task/default.vue'

export default [
  {
    path: '/crm/calendar',
    name: 'calendar-crm',
    component: () => import('./default.vue'),
    redirect: { name: 'crm-calendar-appointment' },
    children: [
      {
        path: '',
        redirect: { name: 'crm-calendar-appointment' },
      },
      {
        path: 'appointment',
        component: CalendarAppointment,
        name: 'crm-calendar-appointment',
        meta: {
          pageTitle: 'Calendar',
          breadcrumb: [
            {
              text: 'Appointments',
              active: true,
            },
          ],
        },
      },
      {
        path: 'task',
        component: CalendarTask,
        name: 'crm-calendar-task',
        meta: {
          pageTitle: 'Calendar',
          breadcrumb: [
            {
              text: 'Tasks',
              active: true,
            },
          ],
        },
      },
    ],
    meta: {
      pageTitle: 'Calendar',
      breadcrumb: [
        {
          text: 'Calendar',
        },
      ],
    },
  },
]
