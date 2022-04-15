import store from '@/store';
import Vue from "vue";
import "@core/scss/vue/libs/vue-sweetalert.scss";
import moment from 'moment'
const assignTaskToSeller = () => {
    window.pusher.bind('assign-task-to-seller', async data => {
        const sessionId = store.state.auth.currentUser.user_id
        setTimeout (async () => {
          if (data.to_id == sessionId) {
              let timerInterval = 0;
              let sellersObject = data.sellers.reduce((a, v) => ({ ...a, [v.id]: v.label}), {})
              let lead = JSON.parse(data.lead);
              const result = await Vue.swal.fire({
                  icon: 'warning',
                  // input: 'select',
                  // inputOptions: sellersObject,
                  html: `
                    <p class="text-left"><span class="font-weight-bolder">Lead:</span> ${lead.first_name} ${lead.last_name}</p>
                    <p class="text-left"><span class="font-weight-bolder">Phone (M):</span> ${lead.mobile}</p>
                    <p class="text-left"><span class="font-weight-bolder">Hour:</span> ${moment(lead.due_date).format('h:mm A')}</p>
                    You have <strong></strong> left to accept the task or to pass it to the next catcher.
                  
                  `,
                  timer: 300000,
                  text: ` ${data.to_id}`,
                  showCancelButton: true,
                  confirmButtonText: "Open Lead",
                  customClass: {
                  confirmButton: "btn btn-primary mr-1",
                  cancelButton: "btn btn-danger  ",
                  allowOutsideClick: false,
                  },
                  didOpen: () => {
                    function secondsToHms(d) {
                      d = Number(d);
                      var h = Math.floor(d / 3600);
                      var m = Math.floor((d % 3600) / 60);
                      var s = Math.floor((d % 3600) % 60);
          
                      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                      return hDisplay + mDisplay + sDisplay;
                    }
                    timerInterval = setInterval(() => {
                      Vue.swal.getHtmlContainer().querySelector("strong").textContent = secondsToHms((
                        Vue.swal.getTimerLeft() / 1000
                      ).toFixed(0));
                    }, 100);
                  },
                  willClose: () => {
                    clearInterval(timerInterval);
                  },
              })
              if(result.isConfirmed) {
                  // data.assign_id = result.value 
                  let routeDashboardLead = "/social-network/leads/new/dashboard/" + lead.id;
                  await window.amgApi.post('/commons/close-all-swal', data)
                  window.open(routeDashboardLead, "_blank");
                  await window.amgApi.post('/round-robin/social-network/on-accept-task-seller-assign', data)
              } else if (result.isDismissed && (result.dismiss == 'timer' || result.dismiss == 'backdrop' || result.dismiss == 'cancel')) {
                  data.catchers_denny.push(sessionId);
                  await window.amgApi.post('/commons/close-all-swal', data)
                  await window.amgApi.post('/round-robin/social-network/on-deny-task-seller-assign', data)
              }
          }
        }, Math.floor(Math.random() * 10000));
    })
}
export default assignTaskToSeller
