<template>
  <footer class="app-footer">
    <div class="app-footer__container">
      <div class="app-footer__main">
        <div class="app-footer__brand">
          <img
            src="/logo/goticket-logo-horizontal-transparente.png"
            alt="GoTicket!"
            class="app-footer__logo"
          />

          <p>
            Viví experiencias que te hacen vibrar. Descubrí eventos y encontrá tu próxima salida.
          </p>
        </div>

        <nav class="app-footer__links" aria-label="Navegación del pie de página">
          <div class="app-footer__column">
            <h3>Explorar</h3>
            <a href="/#eventos">Eventos</a>
            <a href="/#categorias">Categorías</a>
            <a href="/#destacados">Destacados</a>
          </div>

          <div class="app-footer__column">
            <h3>GoTicket!</h3>
            <a href="/#organizadores">Organizadores</a>
            <span>Ayuda</span>
            <span>Contacto</span>
          </div>
        </nav>
      </div>

      <div class="app-footer__bottom">
        <span>© {{ new Date().getFullYear() }} GoTicket! · Todos los derechos reservados.</span>

        <div class="app-footer__legal">
          <span>Privacidad</span>
          <span>Términos y condiciones</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #18332f;
  color: #ffffff;
  padding: 56px 24px 24px;
  margin-top: 64px;
}

.app-footer__container {
  max-width: 1200px;
  margin: 0 auto;
}

.app-footer__main {
  display: flex;
  justify-content: space-between;
  gap: 64px;
  padding-bottom: 48px;
}

.app-footer__brand {
  max-width: 340px;
}

.app-footer__logo {
  display: block;
  width: 190px;
  height: auto;
}

.app-footer__brand p {
  margin: 20px 0 0;
  color: #c8d8d2;
  font-size: 14px;
  line-height: 1.7;
}

.app-footer__links {
  display: flex;
  gap: 96px;
}

.app-footer__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.app-footer__column h3 {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 800;
}

.app-footer__column a,
.app-footer__column span {
  color: #c8d8d2;
  text-decoration: none;
  font-size: 13px;
}

.app-footer__column a:hover {
  color: #d9f06b;
}

.app-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid #42615a;
  color: #a9c0b7;
  font-size: 12px;
}

.app-footer__legal {
  display: flex;
  gap: 24px;
}

@media (max-width: 768px) {
  .app-footer__main {
    flex-direction: column;
    gap: 36px;
  }

  .app-footer__links {
    gap: 56px;
    flex-wrap: wrap;
  }

  .app-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
