<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch, useId } from 'vue'
import LoginForm from './LoginForm.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const id = useId()
let active = false
let background: Array<{ element: HTMLElement; inert: boolean }> = []
const dialog = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

let previousFocus: HTMLElement | null = null
let previousOverflow = ''

function closeModal() {
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeModal()
    return
  }

  if (event.key !== 'Tab' || !dialog.value) return

  const elements = Array.from(
    dialog.value.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
    ),
  )

  const first = elements[0]
  const last = elements[elements.length - 1]

  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function containFocus(event: FocusEvent) {
  if (active && !dialog.value?.contains(event.target as Node)) closeButton.value?.focus()
}

function restorePage() {
  active = false
  background.forEach(({ element, inert }) => {
    element.inert = inert
  })
  background = []
  document.removeEventListener('focusin', containFocus)
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', handleKeydown)
  previousFocus?.focus()
  previousFocus = null
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      active = true
      previousFocus = document.activeElement as HTMLElement | null
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)

      await nextTick()
      if (!active || !props.open) return
      background = Array.from(document.body.children)
        .filter(
          (element): element is HTMLElement =>
            element instanceof HTMLElement && !element.contains(dialog.value),
        )
        .map((element) => ({ element, inert: element.inert }))
      background.forEach(({ element }) => {
        element.inert = true
      })
      document.addEventListener('focusin', containFocus)
      closeButton.value?.focus()
    } else if (active) {
      restorePage()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (active) restorePage()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="auth-overlay" @click.self="closeModal">
      <section
        ref="dialog"
        class="auth-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${id}-title`"
        :aria-describedby="`${id}-description`"
      >
        <button
          ref="closeButton"
          type="button"
          class="auth-close"
          aria-label="Cerrar ventana de inicio de sesión"
          @click="closeModal"
        >
          ×
        </button>

        <div class="auth-dialog-heading">
          <span class="auth-eyebrow">GOTICKET</span>
          <h2 :id="`${id}-title`">¡Estás a un paso!</h2>
          <p :id="`${id}-description`">
            Iniciá sesión para continuar con tus entradas. Tu selección se mantendrá mientras estés
            acá.
          </p>
        </div>

        <LoginForm />

        <p class="auth-register">
          ¿Todavía no tenés cuenta?
          <span>Registro próximamente</span>
        </p>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  z-index: 1000;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 24px;
  background: rgb(10 26 22 / 72%);
  backdrop-filter: blur(5px);
}

.auth-dialog {
  position: relative;
  box-sizing: border-box;
  width: min(100%, 460px);
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  padding: clamp(24px, 4vw, 40px);
  border-radius: 20px;
  background: #f5f7f4;
  color: #18332f;
  box-shadow: 0 24px 90px rgb(0 0 0 / 25%);
}

.auth-close {
  position: absolute;
  top: 16px;
  right: 20px;
  border: 0;
  background: transparent;
  color: #18332f;
  font-size: 28px;
  cursor: pointer;
}

.auth-dialog-heading {
  margin-bottom: 28px;
}

.auth-eyebrow {
  color: #526b24;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.auth-dialog-heading h2 {
  margin: 12px 0;
  font-size: 29px;
  letter-spacing: -1px;
}

.auth-dialog-heading p {
  margin: 0;
  color: #65736d;
  font-size: 14px;
  line-height: 1.6;
}

.auth-register {
  margin-top: 24px;
  text-align: center;
  color: #65736d;
  font-size: 13px;
}

.auth-register span {
  color: #365b36;
  font-weight: 700;
}

@media (max-width: 480px) {
  .auth-overlay {
    padding: 12px;
  }

  .auth-dialog {
    max-height: calc(100dvh - 24px);
    padding: 28px 22px;
  }
}
</style>
