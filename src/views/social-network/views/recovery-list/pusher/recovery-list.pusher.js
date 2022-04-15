import Vue from "vue";
import store from "@/store";
import {swalSuccessIcon} from "@/icons/statusIcons";
const recoveryListAlert = () => {
  window.pusher.bind("recovery-list-alert", async (data) => {
    let isInside = false
    const sessionId = store.state.auth.currentUser.user_id;
    data.list_user_team_leader.map(element => {
      if(parseInt(element.id) == sessionId) isInside = true
    })
    if (isInside) {
      const baseUrl = process.env.VUE_APP_BASE_URL_FRONT;
      Vue.swal
        .fire({ 
          html:
            `<img src="${swalSuccessIcon}" style="margin-bottom: 10px;">` +
            '<div style="margin-top: 15px;"><h2 style="font-weight: 600;">REVIEW RECOVERY LIST</h2></div>' +
            '<div style="text-align: center;">' +
            '<div style="font-weight: bolder; text-transform: uppercase;">User Recovery : '+ data.fullname+
            " </div>" + 
            "<div> <span>Finished The Recovery List, Please review it.</span></div>" +
            "</div>",
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        })
        .then(async (res) => {
          if (res) {
            window.open(`${process.env.VUE_APP_BASE_URL_FRONT}/socialnetwork/recovery-list`, '_blank');
            await window.amgApi.post('/commons/close-all-swal', data)
          }
        });
     
    }
  });
};
export default recoveryListAlert;
