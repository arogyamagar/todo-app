<template>
  <div
    class="h-screen overflow-hidden flex flex-col items-center justify-start bg-gray-100 p-10"
  >
    <div
      class="bg-white p-10 rounded shadow-lg w-full max-w-xl overflow-hidden"
    >
      <div>
        <h1 class="text-3xl font-bold mb-6">{{ heading }}</h1>
        <div class="flex gap-2 mb-6">
          <input
            type="text"
            v-model="newNote"
            class="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="Add a new todo"
          />
          <button
            @click="addNewNotes"
            class="p-2 w-40 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Add Todo
          </button>
        </div>
      </div>
      <div class="overflow-auto max-h-[calc(100vh-20rem)]">
        <div
          v-for="note in notes"
          :key="note.id"
          class="flex items-center justify-between p-3 mb-4 shadow rounded"
          :class="{
            'bg-gray-300': note.isCompleted,
            'bg-gray-100': !note.isCompleted,
          }"
        >
          <div class="flex items-center gap-2">
            <p
              class="text-lg cursor-pointer"
              @click="updateNoteStatus(note)"
              :class="{ 'line-through': note.isCompleted }"
            >
              {{ note.description }}
            </p>
          </div>
          <div class="flex gap-2">
            <button @click="openEditModal(note)" class="p-2 rounded">
              <i class="fas fa-edit text-green-500"></i>
            </button>
            <button @click="deleteNotes(note.id)" class="p-2 rounded">
              <i class="fas fa-trash text-red-500"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="editModalOpen"
      class="fixed inset-0 flex items-start justify-center z-50 pt-10"
    >
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div
        class="bg-white p-10 rounded shadow-lg w-full max-w-xl relative z-10"
      >
        <h2 class="text-2xl mb-4">Edit Note</h2>
        <input
          type="text"
          v-model="noteToEdit.newDescription"
          class="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="editNote(noteToEdit.id, noteToEdit.newDescription)"
            class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            @click="editModalOpen = false"
            class="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import todoService from "./todoservice";

const heading = "What's the Plan for Today";
const notes = ref([]);
const newNote = ref("");
const editModalOpen = ref(false);
const noteToEdit = ref({});
const isLoading = ref(false);

async function getNotes() {
  isLoading.value = true;
  try {
    const response = await todoService.getNotes();
    notes.value = response.map((note) => ({ ...note }));
  } catch (error) {
    console.error("Error in getNotes:", error);
  } finally {
    isLoading.value = false;
  }
}

async function addNewNotes() {
  isLoading.value = true;
  if (!newNote.value.trim()) {
    alert("Note cannot be empty");
    return;
  }
  try {
    const response = await todoService.addNotes(newNote.value);
    alert(response);
    newNote.value = "";
    await getNotes();
  } catch (error) {
    console.error("Error in addNewNotes:", error);
  } finally {
    isLoading.value = false;
  }
}

function openEditModal(note) {
  noteToEdit.value = { ...note, newDescription: note.description };
  editModalOpen.value = true;
}

async function updateNoteStatus(note) {
  isLoading.value = true;
  try {
    const response = await todoService.updateNoteStatus(
      note.id,
      !note.isCompleted
    );
    console.log(response);
    await getNotes();
  } catch (error) {
    console.error("Error in updateNoteStatus:", error);
  } finally {
    isLoading.value = false;
  }
}

async function editNote(id, newDescription) {
  isLoading.value = true;
  try {
    if (!newDescription || newDescription === noteToEdit.value.description) {
      alert(
        "Note description cannot be empty or the same as the existing description"
      );
      return;
    }
    const response = await todoService.editNote(id, newDescription);
    console.log(response);
    await getNotes();
    editModalOpen.value = false;
  } catch (error) {
    console.error("Error in editNote:", error);
  } finally {
    isLoading.value = false;
  }
}

async function deleteNotes(id) {
  isLoading.value = true;
  try {
    const response = await todoService.deleteNotes(id);
    alert(response);
    await getNotes();
  } catch (error) {
    console.error("Error in deleteNotes:", error);
  } finally {
    isLoading.value = false;
  }
}

getNotes();
</script>
