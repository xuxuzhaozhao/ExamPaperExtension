<template>
  <header class="app-header">
    <img class="logo-icon" src="/favicon.ico" alt="图标" />
    <span class="logo-text">试卷变式机</span>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--primary-color);
  color: white;
  padding: 0 20px;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.logo-text {
  font-size: 16px;
  font-weight: 500;
}
</style>
