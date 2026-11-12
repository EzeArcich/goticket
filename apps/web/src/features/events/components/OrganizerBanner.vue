<template>
  <section id="organizadores" class="organizer-banner">
    <div class="organizer-banner__icon" aria-hidden="true">🎟</div>

    <div class="organizer-banner__content">
      <h2>¿Organizás eventos?</h2>

      <p>
        Sumate a GoTicket! y llevá tus eventos a más personas. Nosotros te ayudamos a conectar con
        tu público.
      </p>
    </div>

    <span class="organizer-banner__action"> Organizaciones · Próximamente </span>
  </section>
</template>

<style scoped>
.organizer-banner {
  display: flex;
  align-items: center;
  gap: 24px;

  max-width: 1152px;
  margin: 48px auto 0;
  padding: 32px;

  background: #e7ede7;
  border-radius: 16px;
}

.organizer-banner__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 76px;
  height: 76px;
  flex-shrink: 0;

  background: #d9f06b;
  border-radius: 16px;
  font-size: 36px;
}

.organizer-banner__content {
  flex: 1;
}

.organizer-banner__content h2 {
  margin: 0 0 8px;
  color: #18332f;
  font-size: 24px;
  font-weight: 800;
}

.organizer-banner__content p {
  margin: 0;
  color: #647a70;
  font-size: 14px;
  line-height: 1.6;
}

.organizer-banner__action {
  flex-shrink: 0;
  padding: 14px 22px;

  background: #18332f;
  color: #ffffff;

  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
}

@media (max-width: 768px) {
  .organizer-banner {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 24px;
    margin-right: 24px;
  }
}
</style>
