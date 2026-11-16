<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <div class="auth-page">
    <section class="auth-panel">
      <div class="auth-content">
        <RouterLink to="/" class="auth-brand" aria-label="GoTicket - Inicio">
          <img
            src="/logo/goticket-logo-horizontal-transparente.png"
            alt="GoTicket"
            class="auth-logo"
          />
        </RouterLink>

        <div class="auth-heading">
          <span class="eyebrow">TU PRÓXIMA EXPERIENCIA COMIENZA ACÁ</span>
          <h1>¡Qué bueno verte de nuevo!</h1>
          <p>Iniciá sesión para descubrir eventos increíbles y gestionar tus entradas.</p>
        </div>

        <LoginForm />

        <p class="register-prompt">
          ¿Todavía no tenés una cuenta?
          <span>Registrate próximamente</span>
        </p>

        <RouterLink to="/" class="back-link"> ← Volver a explorar eventos </RouterLink>
      </div>
    </section>

    <aside class="auth-visual" aria-label="Fotografía de un concierto">
      <div class="visual-overlay">
        <span class="visual-tag">VIVÍ EL MOMENTO</span>
        <h2>Los mejores momentos no se cuentan. Se viven.</h2>
        <p>Música, festivales, experiencias y recuerdos que duran para siempre.</p>
        <div class="visual-decoration">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.auth-page {
  display: grid;
  grid-template-columns: minmax(0, 45fr) minmax(0, 55fr);
  min-height: 100dvh;
  background: #f5f7f4;
  color: #18332f;
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px clamp(24px, 5vw, 90px);
}

.auth-content {
  width: 100%;
  max-width: 430px;
  min-width: 0;
  overflow-wrap: anywhere;
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 28px;
  color: #20202a;
  font-size: 27px;
  font-weight: 850;
  letter-spacing: -1.3px;
  text-decoration: none;
}

.auth-logo {
  display: block;
  width: 180px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.auth-heading {
  margin-bottom: 35px;
}

.eyebrow {
  color: #526b24;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.auth-heading h1 {
  margin: 15px 0;
  font-size: clamp(30px, 3vw, 43px);
  line-height: 1.13;
  letter-spacing: -1.8px;
}

.auth-heading p {
  max-width: 380px;
  margin: 0;
  color: #65736d;
  font-size: 15px;
  line-height: 1.7;
}

.register-prompt {
  margin-top: 28px;
  text-align: center;
  color: #65736d;
  font-size: 13px;
}

.register-prompt span {
  color: #365b36;
  font-weight: 700;
}

.back-link {
  display: block;
  margin-top: 50px;
  color: #65736d;
  font-size: 13px;
  text-align: center;
  text-decoration: none;
}

.back-link:hover {
  color: #365b36;
}

.auth-visual {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 100dvh;
  background:
    linear-gradient(180deg, rgba(12, 10, 28, 0.08) 15%, rgba(12, 10, 28, 0.85) 100%),
    url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1600&q=85')
      center / cover no-repeat;
  color: white;
}

.visual-overlay {
  max-width: 700px;
  padding: clamp(40px, 7vw, 110px);
  padding-bottom: calc(clamp(40px, 7vw, 110px) + 40px);
}

.visual-tag {
  display: inline-block;
  margin-bottom: 24px;
  padding: 10px 15px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.visual-overlay h2 {
  max-width: 570px;
  margin: 0;
  font-size: clamp(36px, 4vw, 65px);
  line-height: 1.08;
  letter-spacing: -2px;
}

.visual-overlay p {
  max-width: 440px;
  margin-top: 23px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 1.7;
}

.visual-decoration {
  display: flex;
  gap: 8px;
  margin-top: 40px;
}

.visual-decoration span {
  width: 24px;
  height: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.35);
}

.visual-decoration span:first-child {
  width: 45px;
  background: white;
}

@media (max-width: 900px) {
  .auth-page {
    grid-template-columns: 1fr;
  }

  .auth-panel {
    min-height: 100dvh;
    padding: 36px 24px;
  }

  .auth-visual {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-heading h1 {
    font-size: 33px;
  }

  .back-link {
    margin-top: 35px;
  }
}
</style>
