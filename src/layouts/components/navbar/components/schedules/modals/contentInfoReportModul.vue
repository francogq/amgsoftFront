<template>
  <b-container>
    <b-row>
      <b-table-simple small caption-top responsive bordered>
        <b-thead>
          <b-tr>
            <b-th>User</b-th>
            <b-th></b-th>
            <b-th></b-th>
            <b-th></b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="(item, index) in items" :key="index">
            <b-td>{{ item.user_name }}</b-td>
            <b-td>
              <div class="bg-default p-s text-left r-c">
                HOURS: {{ item.hours }}
              </div>
              <div class="bg-default p-s text-left r-c">
                OVERTIME: {{ item.overtime }}
              </div>
            </b-td>
            <b-td>
              <div class="bg-default p-s text-left r-c">
                LATES: {{ item.lates }}
              </div>
              <div class="bg-default p-s text-left r-c">
                JUSTIFIEDS: {{ item.justifieds_late }}
              </div>
            </b-td>
            <b-td>
              <div class="bg-default p-s text-left r-c">
                ABSENCE: {{ item.absences }}
              </div>
              <div class="bg-default p-s text-left r-c">
                JUSTIFIEDS: {{ item.justifieds_abse }}
              </div>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-row>
  </b-container>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.getReport();
  },
  methods: {
    getReport() {
      let array = this.data;
      array.forEach((element) => {
        let json = element.json_data;
        let hours = 0;
        let overtime = 0;
        let lates = 0;
        let justifiedsLate = 0;
        let absences = 0;
        let justifiedsAbse = 0;
        json.forEach((schedule) => {
          hours += schedule.total_hours;
          overtime += schedule.overtime;
          lates += schedule.status;
          justifiedsLate += schedule.cantlates;
          absences += schedule.absences;
          justifiedsAbse += schedule.justifyabsence;
        });
        this.items.push({
          user_name: element.user_name,
          hours: hours,
          overtime: overtime,
          lates: lates,
          justifieds_late: justifiedsLate,
          absences: absences,
          justifieds_abse: justifiedsAbse,
        });
      });
    },
  },
};
</script>
<style>
.r-c {
  padding: 5px 5px;
}
</style>