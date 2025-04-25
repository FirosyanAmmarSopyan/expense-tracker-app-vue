<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <!-- <h2>Welcome Back! Sign in to your account</h2> -->
        <img src="/src/assets/logo-ttg.svg" class="logo" width="125" height="100" />
        <div style="color: #a7a7ad; font-size: 14; margin-bottom: 1.5rem; text-align: center;">
          {{ isLoginMode ? 'Welcome Back! Sign in to your account' : 'Create your account' }}
        </div>
      </div>

      <!-- Form Login/Register -->
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input 
            id="email" 
            v-model="email" 
            type="text" 
            placeholder="Email" 
            required 
            :class="{ 'error-input': emailError }"
          />
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
        </div>
        <div class="form-group">
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="Password" 
            required 
            :class="{ 'error-input': passwordError }"
          />
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>
        <div v-if="!isLoginMode" class="form-group">
          <input id="username" v-model="username" type="text" placeholder="Username" required />
        </div>

        <div style="text-align: right;">
          <a href="#" class="forget-text">Forgot Password?</a>
        </div>

        <button type="submit" class="btn-login">
          {{ isLoginMode ? 'Sign In' : 'Sign Up' }}
        </button>
      </form>

      <p class="footer-text">
        <span style="color: #a7a7ad;">
          {{ isLoginMode ? "Don't Have an Account?" : "Already have an account?" }}
        </span>
        <a href="#" @click="toggleMode">
          {{ isLoginMode ? "Sign Up" : "Sign In" }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useNotification } from "naive-ui";
const router = useRouter()
const notification = useNotification();

// State untuk form
const email = ref('')
const password = ref('')
const username = ref('')
const isLoginMode = ref(true)
const emailError = ref('')
const passwordError = ref('')

// Toggle antara mode login dan register
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  // Reset form dan error saat toggle
  email.value = ''
  password.value = ''
  username.value = ''
  emailError.value = ''
  passwordError.value = ''
}

// Fungsi untuk handle submit form
const handleSubmit = async () => {
  try {
    // Reset error messages
    emailError.value = ''
    passwordError.value = ''

    // Validasi form
    if (!email.value || !password.value) {
      if (!email.value) emailError.value = 'Email is required'
      if (!password.value) passwordError.value = 'Password is required'
      return
    }

    if (!isLoginMode.value && !username.value) {
      alert('Username is required for registration')
      return
    }

    const endpoint = isLoginMode.value ? '/auth/login' : '/auth/register'
    const payload = isLoginMode.value 
      ? { email: email.value, password: password.value }
      : { 
          email: email.value, 
          password: password.value, 
          username: username.value 
        }

    console.log('Sending payload:', payload)

    const response = await axios.post(import.meta.env.VITE_API_URL + endpoint, payload)
    console.log('Response:', response.data)
    
    if (response.data.access_token && response.data.refresh_token) {
      // Simpan kedua token
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      notification.success({
        title: 'Success',
        content: 'Login successful',
        duration: 2500
      })

      // Redirect ke halaman utama
      router.push('/')
    } else {
      console.log(response.data.message || 'Something went wrong')
    }
  } catch (error) {
    console.error('Error:', error)
    if (error.response?.status === 401) {
      emailError.value = 'Email or password is incorrect'
      passwordError.value = 'Email or password is incorrect'
    } else {
      alert(error.response?.data?.message || 'An error occurred')
    }
  }
}

// Cek status login saat komponen dimuat
onMounted(() => {
  const token = localStorage.getItem('access_token')
  if (token) {
    router.push('/')
  }
})

// Watch untuk memantau perubahan isLoginMode
watch(isLoginMode, (newValue) => {
  console.log('isLoginMode changed:', newValue)
})

</script>

<style scoped>
/* Contoh styling sederhana, silakan sesuaikan dengan kebutuhan */

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: rgba(167, 233, 255, 1);
}

.forget-text {
  text-align: right;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #005F97;
}

.login-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e3e5e7;
  display: flex;
  flex-direction: column;
  width: 600px;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  box-sizing: border-box;
  border-radius: 15px;
  background: white;
  border: 0.5px solid rgba(226, 228, 231, 1);
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input.error-input {
  border-color: #ff4d4f;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 8px;
}

.btn-login {
  width: 100%;
  padding: 0.8rem;
  background-color: #005F97;
  color: #ffffff;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.btn-login:hover {
  background-color: #1BB3E5;
}

.footer-text {
  margin-top: 1.5rem;
  text-align: center;
}

.footer-text a {
  color: #82aaff;
  text-decoration: none;
}

.footer-text a:hover {
  text-decoration: underline;
}
</style>