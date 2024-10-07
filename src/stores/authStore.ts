// src/stores/authStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "../firebase"; 
import { onAuthStateChanged } from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<any>(null);
  const isAuthenticated = ref(false);

  const setUser = (newUser: any) => {
    user.value = newUser;
    isAuthenticated.value = !!newUser; 
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null); 
  };


  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return {
    user,
    isAuthenticated,
    logout,
  };
});
