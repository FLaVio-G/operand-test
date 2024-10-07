<template>
  <main class="flex items-center justify-center min-h-screen">
    <div class="bg-white lg:max-w-[900px] lg:h-[700px] w-[500px]  shadow-md rounded-lg p-6">
      <div class="flex items-center justify-center mb-6">
        <h1 class="text-2xl font-bold text-blue-500">Minha To-Do List</h1>
      </div>
      <div class="flex justify-end mb-4">
        <el-button plain @click="dialogVisible = true">
          Cadastrar uma tarefa
        </el-button>
        <el-button plain @click="logoutAndGoToLogin" class="ml-2">
          Volta para login
        </el-button>
      </div>

      <el-dialog v-model="dialogVisible" title="Cadastrar Tarefa" width="500" @close="resetForm">
        <el-form :model="newTodo" label-width="120px">
          <el-form-item label="Título">
            <el-input v-model="newTodo.title" placeholder="Digite o título da tarefa"></el-input>
          </el-form-item>
          <el-form-item label="Descrição">
            <el-input type="textarea" v-model="newTodo.description" placeholder="Digite a descrição da tarefa"></el-input>
          </el-form-item>
          <el-form-item label="Status">
            <el-select v-model="newTodo.status" placeholder="Selecione o status">
              <el-option label="Pendente" value="pendente"></el-option>
              <el-option label="Concluída" value="concluída"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="resetForm">Cancelar</el-button>
          <el-button type="primary" @click="addTodo">Cadastrar</el-button>
        </template>
      </el-dialog>

      <div class="space-y-4 mt-4">
        <div v-for="todo in todoStore.todos" :key="todo.id"
          class="flex justify-between items-start bg-gray-50 p-4 rounded-md shadow-sm">
          <div>
            <p :class="{ 'line-through text-gray-400': todo.status === 'concluída' }" class="text-sm text-gray-500">{{
              todo.description }}</p>
            <p class="text-sm text-gray-500">Status: {{ todo.status }}</p>
            <p class="text-sm text-gray-400">Criado em: {{ formatDate(todo.createdAt) }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="updateTodoStatus(todo)" class="text-blue-500 hover:text-blue-600">Alterar Status</button>
            <button @click="editTodo(todo.id)" class="text-blue-500 hover:text-blue-600">Editar</button>
            <button @click="deleteTodo(todo.id)" class="text-red-500 hover:text-red-600">Excluir</button>
          </div>
        </div>
      </div>

      <el-dialog v-model="editDialogVisible" title="Editar Tarefa" width="500" @close="resetEditForm">
        <el-form :model="editTodoData" label-width="120px">
          <el-form-item label="Título">
            <el-input v-model="editTodoData.title" placeholder="Digite o título da tarefa"></el-input>
          </el-form-item>
          <el-form-item label="Descrição">
            <el-input type="textarea" v-model="editTodoData.description"
              placeholder="Digite a descrição da tarefa"></el-input>
          </el-form-item>
          <el-form-item label="Status">
            <el-select v-model="editTodoData.status" placeholder="Selecione o status">
              <el-option label="Pendente" value="pendente"></el-option>
              <el-option label="Concluída" value="concluída"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="resetEditForm">Cancelar</el-button>
          <el-button type="primary" @click="updateTodo">Atualizar</el-button>
        </template>
      </el-dialog>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import { useAuthStore } from '../stores/authStore';
import type { Todo } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import router from '@/router';

const todoStore = useTodoStore();
const authStore = useAuthStore();
const dialogVisible = ref(false);
const editDialogVisible = ref(false);

const logoutAndGoToLogin = () => {
  authStore.logout();
  router.push('/');
};

const newTodo = ref<Todo>({
  id: '',
  title: '',
  description: '',
  done: false,
  status: 'pendente',
  createdAt: Timestamp.now(),
});

const editTodoData = ref<Todo>({
  id: '',
  title: '',
  description: '',
  done: false,
  status: 'pendente',
  createdAt: Timestamp.now(),
});

const loadUserTodos = () => {
  const userId = authStore.user?.uid;
  if (userId) {
    todoStore.fetchTodos(userId);
  }
};

onMounted(() => {
  loadUserTodos();
});

const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('pt-BR', options);
};

const addTodo = () => {
  const userId = authStore.user?.uid;
  if (userId) {
    const newTodoCopy = {
      ...newTodo.value,
      id: uuidv4(),
      createdAt: Timestamp.now(),
    };
    todoStore.addTodo(userId, newTodoCopy).then(() => {

      loadUserTodos();
      resetForm();
    });
  }
};

const resetForm = () => {
  newTodo.value = {
    id: '',
    title: '',
    description: '',
    done: false,
    status: 'pendente',
    createdAt: Timestamp.now(),
  };
  dialogVisible.value = false;
};

const editTodo = (id: string) => {
  const todo = todoStore.todos.find(t => t.id === id);
  if (todo) {
    editTodoData.value = { ...todo };
    editDialogVisible.value = true;
  }
};

const updateTodo = () => {
  const userId = authStore.user?.uid;
  if (userId) {
    const updatedTodo = {
      ...editTodoData.value,
      createdAt: Timestamp.now(),
    };
    todoStore.updateTodo(userId, updatedTodo);
    resetEditForm();
  }
};

const resetEditForm = () => {
  editTodoData.value = {
    id: '',
    title: '',
    description: '',
    done: false,
    status: 'pendente',
    createdAt: Timestamp.now(),
  };
  editDialogVisible.value = false;
};

const deleteTodo = (id: string) => {
  const userId = authStore.user?.uid;
  if (userId) {
    console.log("Excluindo tarefa com ID:", id);
    todoStore.deleteTodo(userId, id);
  }
};

const updateTodoStatus = (todo: any) => {
  const userId = authStore.user?.uid;
  if (userId) {
    const updatedTodo = {
      ...todo,
      done: !todo.done,
      status: todo.done ? 'pendente' : 'concluída',
      createdAt: todo.createdAt,
    };
    console.log("Atualizando status da tarefa:", updatedTodo);
    todoStore.updateTodo(userId, updatedTodo);
  }
};
</script>

<style scoped></style>
