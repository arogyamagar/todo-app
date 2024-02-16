import axios from "axios";

const API_URL = "http://localhost:5038/api/todoapp";

export default {
  async getNotes() {
    const response = await axios.get(`${API_URL}/GetNotes`);
    return response.data;
  },
  async addNotes(newNotes) {
    const response = await axios.post(`${API_URL}/AddNotes`, { newNotes });
    return response.data;
  },
  async updateNoteStatus(id, isCompleted) {
    const response = await axios.put(`${API_URL}/UpdateNoteStatus/${id}`, {
      isCompleted,
    });
    return response.data;
  },
  async editNote(id, newDescription) {
    const response = await axios.put(`${API_URL}/EditNote/${id}`, {
      newDescription,
    });
    return response.data;
  },
  async deleteNotes(id) {
    const response = await axios.delete(`${API_URL}/DeleteNote/${id}`);
    return response.data;
  },
};
