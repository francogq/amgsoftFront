import SchedulesComponent from "@/views/commons/components/schedules/SchedulesComponent.vue";
import SchedulesReport from "@/views/commons/components/schedules/SchedulesReport.vue";
import SchedulesOvertime from "@/views/commons/components/schedules/SchedulesOvertime.vue";
import SchedulesJustifications from "@/views/commons/components/schedules/SchedulesJustifications.vue";

export default [
  {
    path: "/socialnetwork/schedules",
    name: "schedules-social-network",
    redirect: "/socialnetwork/schedules/report",
    component: SchedulesComponent,
    children: [
      {
        path: "report",
        name: "report-social-network",
        component: SchedulesReport,
        meta: {
          module: 15,
          route: "socialnetwork",
          permittedRoles: [1, 2],
          pageTitle: "Schedules",
          breadcrumb: [
            {
              text: "Reports By Module",
              active: true,
            },
          ],
        },
      },
      {
        path: "overtime",
        name: "overtime-social-network",
        component: SchedulesOvertime,
        meta: {
          module: 15,
          route: "socialnetwork",
          permittedRoles: [1, 2],
          pageTitle: "Schedules",
          breadcrumb: [
            {
              text: "Overtime",
              active: true,
            },
          ],
        },
      },
      {
        path: "justifications",
        name: "justifications-social-network",
        component: SchedulesJustifications,
        meta: {
          module: 15,
          route: "socialnetwork",
          permittedRoles: [1, 2],
          pageTitle: "Schedules",
          breadcrumb: [
            {
              text: "Justifications",
              active: true,
            },
          ],
        },
      },
    ],
    meta: {
      module: 15,
      route: "socialnetwork",
      permittedRoles: [1, 2],
    },
  },
];
