<template>
    <div class="forgot-password-container">
        <el-card class="forgot-password-card" shadow="hover">
            <h2>Recuperar Senha</h2>
            <el-form @submit.prevent="resetPassword" label-width="100px">
                <el-form-item label="Email">
                    <el-input v-model="email" placeholder="Digite seu email" />
                </el-form-item>
                <el-form-item>
                    <el-button :loading="isLoading" type="primary" @click="resetPassword">
                        Enviar Email de Recuperação
                    </el-button>
                </el-form-item>
            </el-form>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </el-card>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { ElMessage } from "element-plus";

export default defineComponent({
    setup() {
        const email = ref<string>(""); 
        const successMessage = ref<string>(""); 
        const errorMessage = ref<string>(""); 
        const isLoading = ref<boolean>(false); 

      
        const resetPassword = async () => {
            
            successMessage.value = "";
            errorMessage.value = "";

            if (!email.value) {
                errorMessage.value = "Por favor, insira um email válido.";
                ElMessage.error(errorMessage.value);
                return;
            }

            isLoading.value = true;
            try {
               
                await sendPasswordResetEmail(auth, email.value);
                successMessage.value = "Email de recuperação enviado!";
                ElMessage.success(successMessage.value);
            } catch (error) {
               
                errorMessage.value = (error as Error).message;
                ElMessage.error(errorMessage.value);
            } finally {
               
                isLoading.value = false;
            }
        };

        return {
            email,
            successMessage,
            errorMessage,
            isLoading,
            resetPassword,
        };
    },
});
</script>

<style scoped>
.forgot-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.forgot-password-card {
    width: 400px;
    padding: 20px;
}

.success-message {
    color: green;
    margin-top: 10px;
}

.error-message {
    color: red;
    margin-top: 10px;
}
</style>
