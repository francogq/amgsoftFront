import Vue from 'vue'
import NotificationMixin from '@/mixins/notification'
import store from '@/store'

const infoAdmToCrm = () => {
    window.pusher.bind('info-adm-to-crm', async data => {
        const sessionId = store.state.auth.currentUser.user_id
        if (sessionId == data.to_id && sessionId != data.from_id) {
            if (data.status == "2" && data.process) {
                const htmlSwal = '<img src="/assets/images/icons/swal/success.svg" style="margin-bottom: 10px;">' +
                    '<div><h2 style="font-weight: 600;">CREDIT REPORT WAS OBTAINED CORRECTLY</h2></div>' +
                    "<div>LEAD: " + data.lead_name + " </div>" +
                    "<div>ADMINISTRATOR: " + data.admin_name + " </div>"

                const res = await Vue.swal.fire({
                    html: htmlSwal,
                    confirmButtonText: "Ok",
                    customClass: {
                        confirmButton: "btn btn-primary",
                    },
                    buttonsStyling: false,
                })
                if (res) {
                    let routeSocialNetwork = "/social-network/leads/new/dashboard/" + data.lead_id;      
                    let routeCrm = "/crm/leads/" + data.lead_id;      
                    window.open(store.state.auth.currentUser.modul_id == 15?routeSocialNetwork:routeCrm, "_blank");
                    NotificationMixin.methods.showWindowNotification(
                        data.lead_name,
                        'CREDIT REPORT WAS OBTAINED SUCCESSFULLY',
                        '/assets/images/icons/swal/success.svg',
                        '',
                        () => {
                            window.focus()
                        }
                    )
                    await window.amgApi.post('/commons/close-all-swal', data)
                }
            }
            else if (data.status == "3") {
                const otherSource = data.count_request == 3 ? "" : '<option value="5">OTHER SOURCE</option>'
                const htmlSwal =
                    '<img src="/assets/images/icons/swal/warning.svg" style="margin-bottom: 10px;">' +
                    '<div><h2 style="font-weight: 600;">CREDIT REPORT WAS DISAPPROVED</h2></div>' +
                    "<div>LEAD: " +
                    data.lead_name +
                    " </div>" +
                    "<div>ADMINISTRATOR: " +
                    data.admin_name +
                    " </div>" +
                    '<div><select name="swal-select" id="swal-select" class="form-control" style="width: 80%; margin: 5px auto;">' +
                    '<option value="4">VALIDATE INFORMATION</option>' +
                    otherSource +
                    "</select><div>" +
                    '<div><textarea name="swal-textarea" id="swal-textarea" class="form-control" style="height: 80px;width: 80%;margin: 15px auto;" rows="3" cols="50"></textarea></div>'
                const result = await Vue.swal.fire({
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes",
                    customClass: {
                        confirmButton: "btn btn-primary mr-1",
                        cancelButton: "btn btn-outline-danger  ",
                    },
                    html: htmlSwal,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            resolve([
                                document.querySelector("#swal-select").value,
                                document.querySelector("#swal-textarea").value,
                            ]);
                        });
                    }
                })
                if (result) {
                    data.status = result.value[0];
                    data.note = result.value[1];
                    const response = await window.amgApi.post("/lead/credit-report/set-status-lead", data)
                    if (response.status == 200) {
                        // CLose all swal
                    }
                    NotificationMixin.methods.showWindowNotification(
                        data.lead_name,
                        'CREDIT REPORT WAS DISAPPROVED',
                        '/assets/images/icons/swal/warning.svg',
                        '',
                        () => {
                            window.focus()
                        }
                    )
                    await window.amgApi.post('/commons/close-all-swal', data)

                }

            }
            else if (data.status == "6") {
                const otherSource = data.count_request == 3 ? "" : '<option value="8">OTHER SOURCE</option>'
                const htmlSwal = '<img src="/assets/images/icons/swal/warning.svg" style="margin-bottom: 10px;">' +
                    '<div><h2 style="font-weight: 600;">CREDIT REPORT WAS INCORRECT INFORMATION</h2></div>' +
                    "<div>LEAD: " +
                    data.lead_name +
                    " </div>" +
                    "<div>ADMINISTRATOR: " +
                    data.admin_name +
                    " </div>" +
                    '<div><select name="swal-select" id="swal-select" class="form-control" style="width: 80%;">' +
                    '<option value="7">INFORMATION WAS CORRECT</option>' +
                    otherSource +
                    "</select></div>" +
                    '<div><textarea name="swal-textarea" id="swal-textarea" class="form-control" style="height: 80px;width: 80%;margin-top:5px;" rows="3" cols="50"></textarea></div>'

                const result = await Vue.swal.fire({
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes",
                    customClass: {
                        confirmButton: "btn btn-primary mr-1",
                        cancelButton: "btn btn-outline-danger  ",
                    },
                    html: htmlSwal,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            resolve([
                                document.querySelector("#swal-select").value,
                                document.querySelector("#swal-textarea").value,
                            ]);
                        });
                    }
                })
                if (result) {
                    data.status = result.value[0];
                    data.note = result.value[1];
                    const response = await window.amgApi.post("/lead/credit-report/set-status-lead", data)
                    if (response.status == 200) {
                        // CLose all swal
                    }
                    NotificationMixin.methods.showWindowNotification(
                        data.lead_name,
                        'CREDIT REPORT WAS INCORRECT INFORMATION',
                        '/assets/images/icons/swal/warning.svg',
                        '',
                        () => {
                            window.focus()
                        }
                    )
                    await window.amgApi.post('/commons/close-all-swal', data)
                }
            }
            else if (data.status == "9") {
                const htmlSwal = '<img src="/assets/images/icons/swal/warning.svg" style="margin-bottom: 10px;">' +
                    '<div><h2 style="font-weight: 600;">CREDIT REPORT WAS REJECTED</h2></div>' +
                    "<div>LEAD: " +
                    data.lead_name +
                    " </div>" +
                    "<div>ADMINISTRATOR: " +
                    data.admin_name +
                    " </div>"
                const result = await Vue.swal.fire({
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes",
                    customClass: {
                        confirmButton: "btn btn-primary mr-1",
                        cancelButton: "btn btn-outline-danger  ",
                    },
                    html: htmlSwal,
                })
                if (result.value) {
                    await window.amgApi.post('/commons/close-all-swal', data)
                }
                NotificationMixin.methods.showWindowNotification(
                    data.lead_name,
                    'CREDIT REPORT WAS REJECTED',
                    '/assets/images/icons/swal/warning.svg',
                    '',
                    () => {
                        window.focus()
                    }
                )
            }
            else if (data.status == "10") {
                const htmlSwal = '<img src="/assets/images/icons/swal/warning.svg" style="margin-bottom: 10px;">' +
                    '<div><h2 style="font-weight: 600;">CREDIT REPORT WAS INVALID</h2></div>' +
                    "<div>LEAD: " +
                    data.lead_name +
                    " </div>" +
                    "<div>ADMINISTRATOR: " +
                    data.admin_name +
                    " </div>"
                const result = await Vue.swal.fire({
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes",
                    customClass: {
                        confirmButton: "btn btn-primary mr-1",
                        cancelButton: "btn btn-outline-danger  ",
                    },
                    html: htmlSwal,
                })
                if (result.value) {
                    await window.amgApi.post('/commons/close-all-swal', data)
                }
                NotificationMixin.methods.showWindowNotification(
                    data.lead_name,
                    'CREDIT REPORT WAS INVALID',
                    '/assets/images/icons/swal/warning.svg',
                    '',
                    () => {
                        window.focus()
                    }
                )
            }
        }

    })
}
export default infoAdmToCrm