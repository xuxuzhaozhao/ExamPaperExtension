<template>
  <div class="app-container">
    <AppHeader />
    <div class="main-content">
      <div class="left-panel">
        <UploadPanel />
        <DifficultySlider />
        <VariationCoefficient />
        <DisplayOptions />
        <GenerateButton />
        <SettingsButton />
      </div>
      <div class="right-panel">
        <PaperToolbar />
        <PaperViewer />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import UploadPanel from './components/left/UploadPanel.vue'
import DifficultySlider from './components/left/DifficultySlider.vue'
import VariationCoefficient from './components/left/VariationCoefficient.vue'
import DisplayOptions from './components/left/DisplayOptions.vue'
import GenerateButton from './components/left/GenerateButton.vue'
import SettingsButton from './components/left/SettingsButton.vue'
import PaperToolbar from './components/right/PaperToolbar.vue'
import PaperViewer from './components/right/PaperViewer.vue'
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.left-panel {
  width: 300px;
  background: var(--card-background);
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
}

.right-panel {
  flex: 1;
  min-width: 0;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
