import { mapActions } from "vuex";
import { mapGetters } from "vuex";
// import Service
import NrcService from '../service/ncr.service'
export default {
  computed: {
    ...mapGetters("ncr-store", ["ListSellers"]),
  },
  methods: {
    openModalQuestionnaire(score_id, lead_name, status_id, question_id) {
      this.status_id = status_id;
      this.question_id = question_id;
      this.score_id = score_id;
      this.lead_name = lead_name;
      this.modalQuestionnaire = true;
    },
    ...mapActions("ncr-store", ["LIST_SELLERS"]),
    getSellers:async function() {
      if (this.ListSellers != null) {
        this.filter[0].options = this.ListSellers;
      } else {
        try{
          const response = await NrcService.getSellers({
            roles: "[3,5]",
            type: "1",})
            if (response.status == 200) {
              this.filter[0].options = response.data;
              this.LIST_SELLERS(response.data);
            }

        }catch(error){
          console.error(error)
          this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong!"
          );
        }  
      }
    },
    // Status of Table Pending, Returned and Completed
    statusColor(status){
      switch(status){
        case 1:
          return '#38c172'
        case 2:
          return '#3490dc'
        case 3:
          return '#e13232'
        case 4:
          return '#ffd46a'
        case 5:
          return '#ffd46a'
        case 6:
          return '#e13232'
        case 7:
          return '#eabc73'
        case 8:
          return '#eabc73'
        case 9:
          return '#e13232'
        case 10:
          return '#e13232'
        default:
          return ''
      }
    },
  },
  created: function () {
    this.getSellers();
  },
};
