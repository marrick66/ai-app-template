<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue'
import type { TimelineStep } from '@/types/thinking'
import {
  ClockIcon,
  FileReadIcon,
  FileWriteIcon,
  CheckIcon,
  FileOutputIcon,
  ChevronIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RetryIcon,
} from '@/components/icons'

const props = withDefaults(
  defineProps<{
    summary?: string
    thinkingSteps?: TimelineStep[]
    isStreaming?: boolean
    durationSeconds?: number
    startOpen?: boolean
  }>(),
  {
    summary: 'Thought about the request',
    thinkingSteps: () => [],
    isStreaming: false,
    durationSeconds: 0,
    startOpen: false,
  },
)

defineEmits<{
  feedback: [type: 'positive' | 'negative']
  retry: []
}>()

const isOpen = ref(props.startOpen)
const expandedThoughts = ref<Record<number, boolean>>({})

watch(
  () => props.startOpen,
  (val) => {
    isOpen.value = val
  },
)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const toggleThought = (idx: number) => {
  expandedThoughts.value[idx] = !expandedThoughts.value[idx]
}

const isThoughtExpanded = (idx: number) => !!expandedThoughts.value[idx]

const formattedDuration = computed(() => {
  if (props.isStreaming || !props.durationSeconds) return ''
  const s = props.durationSeconds
  if (s < 60) return `${s} seconds`
  const m = Math.floor(s / 60)
  const rem = s % 60
  return rem ? `${m}m ${rem}s` : `${m}m`
})

const displaySummary = computed(() => {
  if (props.isStreaming) return ''
  return props.summary
})

const iconMap: Record<string, Component> = {
  'file-read-icon': FileReadIcon,
  'file-write-icon': FileWriteIcon,
  'file-output-icon': FileOutputIcon,
  'check-icon': CheckIcon,
  'clock-icon': ClockIcon,
}

const resolveIcon = (iconName?: string) => {
  return iconMap[iconName ?? 'file-read-icon'] ?? FileReadIcon
}
</script>

<template>
  <div class="thinking-block">
    <!-- Toggle button -->
    <button class="toggle-btn" @click="toggle">
      <div :class="isStreaming ? 'shimmer' : ''">
        <span v-if="isStreaming" class="toggle-label">
          <span class="streaming-dots"><span>.</span><span>.</span><span>.</span></span>
          <span>Thinking</span>
        </span>
        <span v-else class="toggle-label">{{ displaySummary }}</span>
        <span v-if="formattedDuration && !isStreaming" style="opacity: 0.6; font-size: 12px; flex-shrink: 0">
          {{ formattedDuration }}
        </span>
        <span class="chevron" :class="isOpen ? 'open' : 'closed'">
          <ChevronIcon />
        </span>
      </div>
    </button>

    <!-- Collapsible content -->
    <div class="collapse-grid" :class="isOpen ? 'open' : 'closed'">
      <div class="collapse-inner">
        <div class="timeline" :class="{ 'accent-border': isStreaming }">
          <template v-for="(step, i) in thinkingSteps" :key="i">
            <!-- Spacer with connector line -->
            <div class="tl-spacer">
              <div class="tl-spacer-rail">
                <div class="tl-spacer-line" :class="{ connected: i > 0 || step.type !== 'thinking' }"></div>
              </div>
            </div>

            <!-- THINKING step -->
            <template v-if="step.type === 'thinking'">
              <div class="tl-step">
                <div class="tl-rail">
                  <div class="tl-rail-col">
                    <div class="tl-icon" :class="{
                      'spin-icon':
                        isStreaming && i === thinkingSteps.length - 1 && step.type === 'thinking',
                    }">
                      <ClockIcon />
                    </div>
                    <div class="tl-rail-tail"></div>
                  </div>
                </div>
                <div class="tl-content">
                  <div class="thinking-content-wrap">
                    <div class="thinking-clamp" :style="{ maxHeight: isThoughtExpanded(i) ? '9999px' : '200px' }">
                      <div v-html="step.html" :class="{
                        'streaming-cursor': isStreaming && i === thinkingSteps.length - 1,
                      }"></div>
                      <div v-if="!isThoughtExpanded(i) && step.clippable" class="fade-overlay"></div>
                    </div>
                    <button v-if="step.clippable" class="show-more-btn" @click="toggleThought(i)">
                      {{ isThoughtExpanded(i) ? 'Show less' : 'Show more' }}
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- ACTION step (tool use / file operation) -->
            <template v-if="step.type === 'action'">
              <div class="tl-step">
                <div class="tl-rail" style="display: flex; align-items: center">
                  <div class="tl-icon">
                    <component :is="resolveIcon(step.icon)" />
                  </div>
                </div>
                <div class="tl-content" style="display: flex; align-items: center">
                  <button class="action-btn">
                    <span class="action-label">{{ step.label }}</span>
                  </button>
                </div>
              </div>
              <!-- Sub-row for file badge if present -->
              <div v-if="step.file" style="display: flex; flex-direction: row">
                <div class="tl-spacer-rail">
                  <div class="tl-spacer-line connected"></div>
                </div>
                <div style="flex: 1; min-width: 0; padding: 4px 10px">
                  <span class="file-badge">{{ step.file }}</span>
                </div>
              </div>
            </template>

            <!-- PRESENT step (presented file) -->
            <template v-if="step.type === 'present'">
              <div class="tl-step">
                <div class="tl-rail" style="display: flex; align-items: center">
                  <div class="tl-icon">
                    <FileOutputIcon />
                  </div>
                </div>
                <div class="tl-content" style="display: flex; align-items: center">
                  <button class="action-btn" style="cursor: default">
                    <span class="action-label">{{ step.label }}</span>
                  </button>
                </div>
              </div>
            </template>

            <!-- DONE step -->
            <template v-if="step.type === 'done'">
              <div class="tl-step">
                <div class="tl-rail">
                  <div class="tl-rail-col">
                    <div class="tl-icon done-icon">
                      <CheckIcon />
                    </div>
                    <div class="tl-rail-tail" style="background: transparent"></div>
                  </div>
                </div>
                <div class="tl-content">
                  <div class="done-text">Done</div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thinking-block {
  padding-left: 8px;
  padding-top: 6px;
  padding-bottom: 12px;
}

/* Toggle button */
.toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  line-height: 1.4;
  color: var(--text-500);
  transition: color 0.15s;
}

.toggle-btn:hover {
  color: var(--text-300);
}

.toggle-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  display: inline-flex;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(0deg);
}

.chevron.closed {
  transform: rotate(-90deg);
}

/* Collapsible wrapper */
.collapse-grid {
  display: grid;
  transition: grid-template-rows 0.3s ease-out;
}

.collapse-grid.open {
  grid-template-rows: 1fr;
}

.collapse-grid.closed {
  grid-template-rows: 0fr;
}

.collapse-inner {
  overflow: hidden;
  min-width: 0;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
}

/* Spacer between steps */
.tl-spacer {
  display: flex;
  flex-direction: row;
  height: 8px;
}

.tl-spacer-rail {
  width: 20px;
  display: flex;
  justify-content: center;
}

.tl-spacer-line {
  width: 1px;
  height: 100%;
  transition: background 0.15s;
}

.tl-spacer-line.connected {
  background: var(--border-300);
}

/* Step row */
.tl-step {
  display: flex;
  flex-direction: row;
  transition: background 0.15s;
  border-radius: 8px;
}

.tl-rail {
  width: 20px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.tl-rail-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.tl-rail-tail {
  width: 1px;
  flex: 1;
  margin-top: 4px;
  transition: background 0.15s;
  background: var(--border-300);
}

.tl-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-500);
  flex-shrink: 0;
}

.tl-icon.done-icon {
  color: var(--text-500);
}

.tl-content {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}

/* Thinking text content */
.thinking-content-wrap {
  padding: 0 10px;
  color: var(--text-300);
  font-size: 14px;
  line-height: 1.7;
}

.thinking-clamp {
  position: relative;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

/* v-html content needs :deep() to penetrate scoped styles */
.thinking-clamp :deep(p) {
  margin: 0 0 12px;
}

.thinking-clamp :deep(p:last-child) {
  margin-bottom: 0;
}

.thinking-clamp :deep(ul),
.thinking-clamp :deep(ol) {
  padding-left: 28px;
  margin: 0 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.thinking-clamp :deep(li) {
  padding-left: 8px;
}

.fade-overlay {
  position: absolute;
  inset: auto 0 0 0;
  height: 40px;
  background: linear-gradient(to top, var(--bg-100), transparent);
  pointer-events: none;
}

.show-more-btn {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  color: var(--text-500);
  opacity: 0.8;
  transition: color 0.15s;
  padding: 4px 0;
}

.show-more-btn:hover {
  color: var(--text-100);
}

/* Action row (tool use / file) */
.action-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  padding: 0 10px;
  width: 100%;
  justify-content: space-between;
  color: var(--text-300);
  cursor: pointer;
  transition: color 0.2s;
  background: none;
  border: none;
  font: inherit;
  text-align: left;
}

.action-btn:hover {
  color: var(--text-200);
}

.action-label {
  font-size: 14px;
  color: var(--text-500);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-badge {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  background: var(--bg-500-40);
  color: var(--text-200);
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 10px;
  line-height: 1;
  white-space: nowrap;
}

/* Done row */
.done-text {
  padding-left: 10px;
  padding-top: 2px;
  color: var(--text-300);
  font-size: 14px;
}

/* Streaming animated dots */
.streaming-dots span {
  animation: dotPulse 1.4s infinite ease-in-out both;
}

.streaming-dots span:nth-child(1) {
  animation-delay: 0s;
}

.streaming-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.streaming-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Blinking cursor for streaming */
.streaming-cursor::after {
  content: '\25CB';
  animation: blink 1s step-end infinite;
  color: var(--accent);
  font-size: 13px;
  margin-left: 1px;
}

/* Border accent while streaming */
.accent-border {
  border-left: 2px solid var(--accent);
  padding-left: 6px;
  margin-left: -8px;
}

/* Action bar (thumbs / retry) */
.action-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 8px;
  padding-left: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.thinking-block:hover .action-bar,
.action-bar:focus-within {
  opacity: 1;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-500);
  transition:
    color 0.15s,
    transform 0.15s;
}

.icon-btn:hover {
  color: var(--text-100);
}

.icon-btn:active {
  transform: scale(0.95);
}

/* Shimmer effect on toggle button while streaming */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
      transparent 0%,
      currentColor 50%,
      transparent 100%);
  opacity: 0.15;
  animation: shimmerSlide 2s infinite;
  pointer-events: none;
}

@keyframes shimmerSlide {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

/* Spinner for streaming clock */
.spin-icon {
  animation: spinClock 2s linear infinite;
}
</style>
