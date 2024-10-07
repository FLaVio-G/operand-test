import { defineStore } from "pinia";
import { ref } from "vue";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

interface Todo {
  id: string;
  title: string;
  description: string;
  done: boolean;
  createdAt: Timestamp;
  status: string;
}

export const useTodoStore = defineStore("todo", () => {
  const todos = ref<Todo[]>([]);

  const fetchTodos = (userId: string) => {
    const todosCollection = collection(db, `users/${userId}/todos`);
    onSnapshot(todosCollection, (snapshot) => {
      todos.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
    });
  };

  const addTodo = async (userId: string, newTodo: Omit<Todo, "id">) => {
    const todosCollection = collection(db, `users/${userId}/todos`);
    try {
      const todoData = {
        title: newTodo.title,
        description: newTodo.description || "",
        done: newTodo.done || false,
        createdAt: Timestamp.now(),
        status: newTodo.done ? "concluída" : "pendente",
      };
      const docRef = await addDoc(todosCollection, todoData);
      todos.value.push({ id: docRef.id, ...todoData });

      console.log("Estado dos todos após adição:", todos.value);
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  const updateTodo = async (userId: string, updatedTodo: Todo) => {
    const todoDoc = doc(db, `users/${userId}/todos/${updatedTodo.id}`);
    try {
      const todoData = {
        title: updatedTodo.title,
        description: updatedTodo.description || "",
        done: updatedTodo.done,
        createdAt: updatedTodo.createdAt,
        status: updatedTodo.done ? "concluída" : "pendente",
      };
      await updateDoc(todoDoc, todoData);

      const index = todos.value.findIndex((todo) => todo.id === updatedTodo.id);
      if (index !== -1) {
        todos.value[index] = { id: updatedTodo.id, ...todoData };
      }
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  const deleteTodo = async (userId: string, id: string) => {
    const todoDoc = doc(db, `users/${userId}/todos/${id}`);
    try {
      await deleteDoc(todoDoc);

      todos.value = todos.value.filter((todo) => todo.id !== id);
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  return { todos, fetchTodos, addTodo, updateTodo, deleteTodo };
});
