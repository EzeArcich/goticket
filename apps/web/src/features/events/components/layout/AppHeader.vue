<script setup lang="ts"></script>

<template>
  <header class="app-header">
    <div class="app-header__container">
      <a href="/" class="app-header__brand">
        <img
          src="/logo/goticket-logo-horizontal-transparente.png"
          alt="GoTicket!"
          class="app-header__logo"
        />
      </a>

      <nav class="app-header__nav" aria-label="Navegación principal">
        <a href="/#eventos">Eventos</a>
        <a href="/#categorias">Categorías</a>
        <a href="/#organizadores">Organizadores</a>
      </nav>

      <div class="app-header__account">
        <span title="Próximamente" class="app-header__login">Iniciar sesión</span>
        <span title="Próximamente" class="app-header__register">Crear cuenta</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #18332f;
  padding: 16px 40px;
}

.app-header__container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 36px;
}

.app-header__brand {
  flex-shrink: 0;
}

.app-header__logo {
  display: block;
  width: 180px;
  height: auto;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: 24px;
}

.app-header__nav a,
.app-header__login {
  color: #ffffff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.app-header__nav a:hover {
  color: #d9f06b;
}

.app-header__account {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.app-header__register {
  padding: 11px 18px;
  background: #d9f06b;
  color: #18332f;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .app-header {
    padding: 16px 20px;
  }

  .app-header__nav {
    gap: 14px;
    margin-left: 0;
  }

  .app-header__account {
    gap: 10px;
  }
}

@media (max-width: 700px) {
  .app-header__nav,
  .app-header__account {
    display: none;
  }
}

@media (min-width: 701px) and (max-width: 1000px) {
  .app-header__container {
    gap: 16px;
    flex-wrap: wrap;
  }
  .app-header__account {
    gap: 12px;
  }
}
@media (max-width: 700px) {
  .app-header__container {
    flex-wrap: wrap;
    gap: 16px;
  }
  .app-header__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
