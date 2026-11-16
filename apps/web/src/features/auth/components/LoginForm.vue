<script setup lang="ts">
import { computed, ref, useId } from 'vue'

const id = useId()
const emailInput = ref<HTMLInputElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)
const notice = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const submitted = ref(false)

const emailError = computed(() => {
  if (!submitted.value) return ''
  if (!email.value.trim()) return 'Ingresá tu correo electrónico'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    return 'Ingresá un correo válido'
  }
  return ''
})

const passwordError = computed(() => {
  if (!submitted.value) return ''
  if (!password.value) return 'Ingresá tu contraseña'
  return ''
})

const isValid = computed(() => !emailError.value && !passwordError.value)

function handleSubmit() {
  submitted.value = true

  notice.value = ''
  if (!isValid.value) {
    ;(emailError.value ? emailInput.value : passwordInput.value)?.focus()
    return
  }
  notice.value = 'El inicio de sesión estará disponible próximamente.'

  // Pendiente: conectar con NestJS.
  // No simulamos una autenticación exitosa.
}
</script>

<template>
  <form class="login-form" novalidate @submit.prevent="handleSubmit">
    <div class="login-field">
      <label :for="`${id}-email`">Correo electrónico</label>
      <input
        :id="`${id}-email`"
        ref="emailInput"
        required
        v-model="email"
        type="email"
        name="email"
        autocomplete="email"
        placeholder="tu@email.com"
        :aria-invalid="Boolean(emailError)"
        :aria-describedby="emailError ? `${id}-email-error` : undefined"
      />
      <p v-if="emailError" :id="`${id}-email-error`" role="alert" class="field-error">
        {{ emailError }}
      </p>
    </div>

    <div class="login-field">
      <div class="field-heading">
        <label :for="`${id}-password`">Contraseña</label>
        <span class="recovery-notice">Recuperación próximamente</span>
      </div>

      <div class="password-control">
        <input
          :id="`${id}-password`"
          ref="passwordInput"
          required
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          autocomplete="current-password"
          placeholder="Ingresá tu contraseña"
          :aria-invalid="Boolean(passwordError)"
          :aria-describedby="passwordError ? `${id}-password-error` : undefined"
        />
        <button
          type="button"
          class="password-toggle"
          :aria-pressed="showPassword"
          :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>

      <p v-if="passwordError" :id="`${id}-password-error`" role="alert" class="field-error">
        {{ passwordError }}
      </p>
    </div>

    <button type="submit" class="login-submit">Iniciar sesión</button>
    <p v-if="notice" role="status" class="form-notice">{{ notice }}</p>
  </form>
  <div class="social-login">
    <div class="social-divider">
      <span>O continuá con</span>
    </div>

    <div class="social-buttons">
      <button type="button" disabled title="Próximamente">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.35 12.24c0-.71-.06-1.42-.18-2.1H12v3.98h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.7 2.91-4.2 2.91-7.26Z"
          />
          <path
            fill="#34A853"
            d="M12 21.75c2.62 0 4.83-.87 6.44-2.35l-3.14-2.44c-.87.58-1.98.92-3.3.92-2.54 0-4.69-1.71-5.46-4.01H3.3v2.52A9.75 9.75 0 0 0 12 21.75Z"
          />
          <path
            fill="#FBBC05"
            d="M6.54 13.87a5.85 5.85 0 0 1 0-3.74V7.61H3.3a9.75 9.75 0 0 0 0 8.78l3.24-2.52Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.12c1.39 0 2.63.48 3.61 1.42l2.71-2.71A9.2 9.2 0 0 0 12 2.25 9.75 9.75 0 0 0 3.3 7.61l3.24 2.52c.77-2.3 2.92-4.01 5.46-4.01Z"
          />
        </svg>
        Google
      </button>

      <button type="button" disabled title="Próximamente">
        <span class="facebook-icon">f</span>
        Facebook
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-form {
  display: grid;
  gap: 24px;
}

.login-field {
  display: grid;
  gap: 9px;
}

.login-field label {
  font-size: 14px;
  font-weight: 650;
}

.login-field input {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 15px 16px;
  border: 1px solid #d9dce3;
  border-radius: 12px;
  border-color: #d8e1d5;
  background: #fff;
  color: #18332f;
  font: inherit;
}

.login-field input:focus {
  outline: 2px solid #8eaa35;
  outline-offset: 2px;
}

.login-field input[aria-invalid='true'] {
  border-color: #c43d52;
}

.field-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.recovery-notice {
  font-size: 12px;
  color: #365b36;
  text-decoration: none;
}

.password-control {
  position: relative;
}

.password-control input {
  padding-right: 90px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #365b36;
  cursor: pointer;
  font-size: 12px;
  font-weight: 650;
}

.field-error {
  margin: 0;
  color: #bd3449;
  font-size: 12px;
}

.login-submit {
  width: 100%;
  padding: 16px;
  border: 0;
  border-radius: 12px;
  background: #d9f06b;
  color: #18332f;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.login-submit:hover {
  background: #c7e052;
}

.social-login {
  margin-top: 28px;
}

.social-divider {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  color: #65736d;
  font-size: 12px;
}

.social-divider::before,
.social-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #d8e1d5;
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.social-buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  border: 1px solid #d8e1d5;
  border-radius: 12px;
  background: #fff;
  color: #18332f;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
}

.social-buttons button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.facebook-icon {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #1877f2;
  color: white;
  font-size: 17px;
  font-weight: 800;
}
</style>
