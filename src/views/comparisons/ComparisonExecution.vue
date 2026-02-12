<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import ThinkingDialog from '@/components/ThinkingDialog.vue'
import type { TimelineStep } from '@/types/thinking'
import type { ComparisonParams } from './models'

const props = withDefaults(
  defineProps<{
    open?: boolean
    params: ComparisonParams
  }>(),
  {
    open: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  'completed': []
}>()

const isStreaming = ref(false)
const thinkingSteps = ref<TimelineStep[]>([])
const durationSeconds = ref(0)

let durationTimer: ReturnType<typeof setInterval> | null = null
let aborted = false

const thinkingStream = computed(() => ({
  summary: `Compared ${props.params.section_name} between ${props.params.year1} and ${props.params.year2}`,
  thinkingSteps: thinkingSteps.value,
  isStreaming: isStreaming.value,
  durationSeconds: durationSeconds.value,
}))

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function splitHtmlChunks(html: string): string[] {
  const chunks: string[] = []
  const regex = /<\/(?:p|li|ul|ol)>/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(html)) !== null) {
    const end = match.index + match[0].length
    chunks.push(html.substring(lastIndex, end))
    lastIndex = end
  }
  if (lastIndex < html.length) {
    const rest = html.substring(lastIndex).trim()
    if (rest) chunks.push(rest)
  }
  return chunks.length ? chunks : [html]
}

async function execute() {
  aborted = false
  thinkingSteps.value = []
  durationSeconds.value = 0
  isStreaming.value = true

  durationTimer = setInterval(() => {
    durationSeconds.value++
  }, 1000)

  try {
    const response = await fetch('/api/comparisons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props.params),
    })

    if (!response.ok) throw new Error(`Failed to create comparison: ${response.statusText}`)

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()!

      for (const line of lines) {
        if (aborted) { await reader.cancel(); break }
        if (!line.trim()) continue

        const step = JSON.parse(line) as TimelineStep

        if (step.type === 'thinking') {
          thinkingSteps.value.push({ ...step, html: '' })
          const chunks = splitHtmlChunks(step.html)
          for (const chunk of chunks) {
            if (aborted) break
            await sleep(60 + Math.random() * 140)
            const last = thinkingSteps.value[thinkingSteps.value.length - 1]
            if (last?.type === 'thinking') {
              last.html += chunk
            }
          }
        } else {
          thinkingSteps.value.push(step)
        }
      }

      if (aborted) break
    }

    emit('completed')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An error occurred'
    thinkingSteps.value.push({
      type: 'thinking',
      html: `<p style="color: var(--destructive)">Error: ${message}</p>`,
    })
  } finally {
    isStreaming.value = false
    if (durationTimer) {
      clearInterval(durationTimer)
      durationTimer = null
    }
  }
}

function stopTimers() {
  aborted = true
  if (durationTimer) {
    clearInterval(durationTimer)
    durationTimer = null
  }
}

function handleOpenChange(value: boolean) {
  if (isStreaming.value) return
  emit('update:open', value)
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      execute()
    } else {
      stopTimers()
    }
  },
)

onUnmounted(() => {
  stopTimers()
})
</script>

<template>
  <ThinkingDialog
    :open="open"
    :stream="thinkingStream"
    @update:open="handleOpenChange"
  />
</template>
