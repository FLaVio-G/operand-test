<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <h2>Login</h2>
      <el-form @submit.prevent="login" label-width="100px">
        <el-form-item label="Email">
          <el-input v-model="email" placeholder="Digite seu email" />
        </el-form-item>
        <el-form-item label="Senha">
          <el-input v-model="password" type="password" placeholder="Digite sua senha" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">Entrar</el-button>
        </el-form-item>
      </el-form>
      <el-button type="text" @click="resetPassword">Esqueceu sua senha?</el-button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore"; 
import { auth } from "@/firebase";

export default defineComponent({
  setup() {
    const email = ref<string>("");
    const password = ref<string>("");
    const errorMessage = ref<string>("");
    const router = useRouter();
    const authStore = useAuthStore(); 

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        ElMessage.success("Login realizado com sucesso!");
        router.push("/home-view");
      } catch (error) {
        errorMessage.value = (error as Error).message;
        ElMessage.error(errorMessage.value);
      }
    };

    const resetPassword = () => {
      router.push("/forgot-password");
    };

    return {
      email,
      password,
      errorMessage,
      login,
      resetPassword,
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 400px;
}

.error-message {
  color: red;
}
</style>
