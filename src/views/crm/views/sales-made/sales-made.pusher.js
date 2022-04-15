import Vue from "vue";
import store from "@/store";

const salesMadeAlert = () => {
  window.pusher.bind("sales-made-alert", async (data) => {
    const sessionId = store.state.auth.currentUser.user_id;
    if (data.to_id == sessionId) {
      const baseUrl = process.env.VUE_APP_BASE_URL_FRONT;
      Vue.swal
        .fire({
          html:
            '<img src="' +
            baseUrl +
            '/assets/images/icons/swal/success.svg" style="margin-bottom: 10px;">' +
            '<div><h2 style="font-weight: 600;">APPROVE | SALE MADE</h2></div>' +
            '<div style="text-align: center;">' +
            '<div style="font-weight: bolder; text-transform: uppercase;">LEAD: ' +
            data.lead_name +
            " </div>" +
            "</div>",
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        })
        .then(async (res) => {
          if (res) {
            data.to_id = sessionId;
            await window.amgApi.post('/commons/close-all-swal', data)
          }
        });
    }
  });
};
export default salesMadeAlert;
