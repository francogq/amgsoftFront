import { amgApi } from "@/service/axios";

class StickyNotesService {

    async getUserNotes(userId) {
        const data = await amgApi.post('/note/sticky-note/get-sticky-note', {
            id: userId,
            campo1: "",
            order: 7,
            orderby: "desc"
        })
        let notes = data.data;
        notes.forEach(element => {
            element.isSelected = false
        });
        return notes;
    }
    async getColorNotes() {
        const data = await amgApi.get('/note/sticky-note/get-category-note')
        return data.data
    }
    async saveUserNote(payload) {
        const data = await amgApi.post('/note/sticky-note/save-sticky-note', {
            id: payload.userId,
            note_id: payload.noteId,
            subject: payload.title,
            content: payload.note,
            color_id: payload.colorId
        })
        return data.data
    }
    async deleteUserNote(selectedNoteIds, userId) {
        const data = await amgApi.post('/note/sticky-note/delete-sticky-note', {
            id: selectedNoteIds,
            userid: userId
        })
        return data.data
    }
}
export default new StickyNotesService()
