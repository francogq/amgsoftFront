import { amgApi } from "@/service/axios";

class ScheduleService {
    async getHourReport(params) {
        const data = await amgApi.post('/schedules/get-hour-report', params);
        return data.data;
    }
    async getDetailsSchedule(params){
        const data = await amgApi.post('/schedules/get-details-schedule', params);
        return data.data;
    }
    async getExportExcel(params){
        const data = await amgApi.post('/schedules/get-export-excel', params, {responseType: "blob"});
        return data.data;
    }
    // ********************* JUSTIFY LATE / ABSENCE ********************
    async getPendingJustify(params) {
        const data = await amgApi.post('/schedules/get-pending-justify', params);
        return data.data;
    }
    async sendJustify(formData) {
        const data = await amgApi.post('/schedules/send-justify', formData);
        return data.data;
    }
    async getTrackingJustify(params) {
        const data = await amgApi.post('/schedules/get-tracking-justify', params);
        return data.data;
    }
    async getDoneJustify(params) {
        const data = await amgApi.post('/schedules/get-done-justify', params);
        return data.data;
    }
    async getFiles(params) {
        const data = await amgApi.post('/schedules/get-files-justify', params);
        return data.data;
    }
    async updateSeendStatus(params) {
        amgApi.post('/schedules/update-seen-status', params);
    }
    // ********************* OVERTIME ********************
    async getOvertime(params) {
        const data = await amgApi.post('/schedules/get-overtime', params);
        return data.data;
    }
    async sendJustifyOvertime(params){
        const data = await amgApi.post('/schedules/send-justify-overtime', params);
        return data.data;
    }
    async getTrackingOvertime(params) {
        const data = await amgApi.post('/schedules/get-tracking-overtime', params);
        return data.data;
    }
}
export default new ScheduleService()
