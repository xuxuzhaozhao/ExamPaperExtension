<template>
  <div class="math-block">
    <span v-html="renderedContent"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '../../utils/markdown'

const props = defineProps({
  content: { type: String, required: true }
})

const renderedContent = computed(() => renderMarkdown(props.content))
</script>

<style scoped>
.math-block {
  font-size: 14px;
  line-height: 1.8;
}
</style>
