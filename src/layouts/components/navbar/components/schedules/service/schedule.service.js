import { amgApi } from "@/service/axios";

class ScheduleService {
    async currentTime() {
        const data = await amgApi.get('/schedules/current-time')
        return data.data;
    }
    async geTimeToDial(user) {
        const params = { user_id: user.user_id, modul_id: user.modul_id};
        const data = await amgApi.post('/schedules/get-time-to-dial', params)
        return data.data;
    }    
    async sendAssistance(params) {
        const data = await amgApi.post('/schedules/send-assistance', params);
        return data.data;
    }
    async sendJustifyLate(formData) {
        const data = await amgApi.post('/schedules/send-justify-late', formData);
        return data.data;
    }
    async getHourReport(params) {
        const data = await amgApi.post('/schedules/get-hour-report-user', params);
        return data.data;
    }
    async getDetailsSchedule(params){
        const data = await amgApi.post('/schedules/get-details-schedule', params);
        return data.data;
    }
}
export default new ScheduleService()
