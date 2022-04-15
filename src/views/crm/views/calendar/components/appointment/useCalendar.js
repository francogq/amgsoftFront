// Full Calendar Plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

// eslint-disable-next-line object-curly-newline
import { ref, computed, watch, onMounted, methods } from "@vue/composition-api";
import store from "@/store";
import moment from "moment";

import crmCalendar from "@/views/crm/services/calendar";
import crmEvent from "@/views/crm/services/event";
import mixins from "@/mixins/general";

export default function userCalendar() {
  // Use toast
  const toast = useToast();
  // ------------------------------------------------
  // refCalendar
  // ------------------------------------------------
  const refCalendar = ref(null);

  // ------------------------------------------------
  // calendarApi
  // ------------------------------------------------
  let calendarApi = null;
  onMounted(() => {
    calendarApi = refCalendar.value.getApi();
  });

  // ------------------------------------------------
  // calendars
  // ------------------------------------------------
  const calendarsColor = {
    TEL: "primary",
    CN: "success",
    Personal: "danger",
    Family: "warning",
    ETC: "info",
  };

  // ------------------------------------------------
  // event
  // ------------------------------------------------
  const blankEvent = {
    title: "",
    start: "",
    end: "",
    allDay: false,
    url: "",
    extendedProps: {
      calendar: "",
      guests: [],
      location: "",
      description: "",
    },
  };
  const event = ref(JSON.parse(JSON.stringify(blankEvent)));
  const clearEventData = () => {
    event.value = JSON.parse(JSON.stringify(blankEvent));
  };

  const updateEventInCalendar = (
    updatedEventData,
    propsToUpdate,
    extendedPropsToUpdate
  ) => {
    toast({
      component: ToastificationContent,
      props: {
        title: "Event Updated",
        icon: "CheckIcon",
        variant: "success",
      },
    });

    const existingEvent = calendarApi.getEventById(updatedEventData.id);

    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index];
      existingEvent.setProp(propName, updatedEventData[propName]);
    }
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, {
      allDay: updatedEventData.allDay,
    });

    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index];
      existingEvent.setExtendedProp(
        propName,
        updatedEventData.extendedProps[propName]
      );
    }
  };

  const grabEventDataFromEventApi = (eventApi) => {
    const {
      id,
      title,
      start,
      end,
      // eslint-disable-next-line object-curly-newline
      extendedProps: { calendar, guests, location, description },
      allDay,
    } = eventApi;

    return {
      id,
      title,
      start,
      end,
      extendedProps: {
        calendar,
        guests,
        location,
        description,
      },
      allDay,
    };
  };

  // ------------------------------------------------
  // updateEvent
  // ------------------------------------------------
  const updateEvent = (eventData) => {
    store
      .dispatch("calendar/updateEvent", { event: eventData })
      .then((response) => {
        const updatedEvent = response.data.event;

        const propsToUpdate = ["id", "title", "url"];
        const extendedPropsToUpdate = [
          "calendar",
          "guests",
          "location",
          "description",
        ];

        updateEventInCalendar(
          updatedEvent,
          propsToUpdate,
          extendedPropsToUpdate
        );
      });
  };

  const refetchEvents = () => {
    calendarApi.refetchEvents();
  };

  const selectedCalendars = computed(
    () => store.state.calendar.selectedCalendars
  );

  watch(selectedCalendars, () => {
    refetchEvents();
  });

  const yearact = ref(moment().format("YYYY"));
  const monthact = ref(moment().format("MMM"));
  const host = ref(0);

  const fetchEvents = async (info, successCallback) => {
    try {
      if (!info) return;

      const currentYear = moment(info.start).add(15, "d").format("YYYY");
      const currentMonth = moment(info.start).add(15, "d").format("MM");

      const response = await crmCalendar.filterMonthNext({
        year: currentYear,
        month: currentMonth,
        host: host.value,
      });

      if (mixins.methods.isResponseSuccess(response)) {
        const eventos = JSON.parse(response.data[0].events_month);
        yearact.value = response.data[0].current_year;
        monthact.value = moment(response.data[0].current_month, "MM").format(
          "MMM"
        );
        const data = eventos.map((el) => ({
          id: el.id,
          url: "",
          title: el.title,
          start: `${el.date} ${el.from}`,
          end: `${el.date} ${el.to}`,
          allDay: false,
          extendedProps: {
            ...el,
            description: el.description,
          },
        }));
        successCallback(data);
      } else {
        mixins.methods.showToast(
          "warning",
          "top-right",
          "Warning!",
          "AlertTriangleIcon",
          `Something went wrong. ${response.message}`
        );
      }
    } catch (error) {
      console.log("Something went wrong fetchEvents", error);
      mixins.methods.showErrorSwal();
    }
  };
  const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "sidebarToggle, prev,next, title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    events: fetchEvents,
    editable: true,
    eventResizableFromStart: true,
    dragScroll: false,
    dayMaxEvents: 2,
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {
      const colorName =
        calendarsColor[calendarEvent._def.extendedProps.title] || "info";

      return [`bg-light-${colorName}`, "fc-daygrid-block-event", "fc-h-event"];
    },
    async eventClick({ event: clickedEvent }) {
      try {
        const response = await crmEvent.getEvent({
          id: clickedEvent._def.extendedProps.id,
        });
        if (mixins.methods.isResponseSuccess(response)) {
          mixins.methods.toggleModal("modal-event-edit");
        } else
          mixins.methods.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            `Something went wrong. ${response.message}`
          );
      } catch (error) {
        console.log("Something went wrong eventClick", error);
        mixins.methods.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          mixins.methods.getInternalErrors(error)
        );
      }
    },
    customButtons: {
      sidebarToggle: {
        text: "sidebar",
        click() {
          isCalendarOverlaySidebarActive.value =
            !isCalendarOverlaySidebarActive.value;
        },
      },
    },
    dateClick(info) {
      event.value = JSON.parse(
        JSON.stringify(Object.assign(event.value, { start: info.date }))
      );
      isEventHandlerSidebarActive.value = true;
    },
    eventResize({ event: resizedEvent }) {
      updateEvent(grabEventDataFromEventApi(resizedEvent));
    },
    direction: computed(() => (store.state.appConfig.isRTL ? "rtl" : "ltr")),
    rerenderDelay: 350,
  });

  const isEventHandlerSidebarActive = ref(false);

  const isCalendarOverlaySidebarActive = ref(false);

  return {
    refCalendar,
    isCalendarOverlaySidebarActive,
    calendarOptions,
    event,
    clearEventData,
    updateEvent,
    refetchEvents,
    fetchEvents,

    isEventHandlerSidebarActive,
  };
}
