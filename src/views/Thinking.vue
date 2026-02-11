<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ThinkingDialog from '@/components/ThinkingDialog.vue'
import { Button } from '@/components/ui/button'
import type { TimelineStep } from '@/types/thinking'

const isStreaming = ref(false)
const thinkingSteps = ref<TimelineStep[]>([])
const durationSeconds = ref(0)
const dialogOpen = ref(false)

const thinkingStream = computed(() => ({
    summary: 'Thought about creating a thinking component',
    thinkingSteps: thinkingSteps.value,
    isStreaming: isStreaming.value,
    durationSeconds: durationSeconds.value,
}))

let durationTimer: ReturnType<typeof setInterval> | null = null
let aborted = false

const sourceSteps: TimelineStep[] = [
    {
        type: 'thinking',
        clippable: true,
        html: `<p>The user wants me to create a Vue.js component that replicates the "extended thinking" display from Claude's web interface — the collapsible thinking block that shows Claude's internal reasoning process.</p><p>Let me think about what this looks like:</p><ul><li>It's a collapsible/expandable block</li><li>Has a "thinking" header with an icon</li><li>Shows the thinking content when expanded</li><li>Has a smooth animation</li><li>Often shows a summary like "Thinking..." or duration info</li></ul><p>Let me read the frontend-design skill first for best practices.</p>`,
    },
    {
        type: 'action',
        icon: 'file-read-icon',
        label: 'Read frontend design skill for best practices',
    },
    {
        type: 'thinking',
        clippable: true,
        html: `<p>Now let me create a Vue.js component that replicates the extended thinking display from Claude's web interface. I'll make it a polished, interactive component with:</p><ol><li>Collapsible thinking block</li><li>Animated expand/collapse</li><li>Thinking indicator with animation</li><li>Clean styling that matches Claude's aesthetic</li><li>Support for streaming thinking text</li><li>Duration display</li></ol><p>Let me create this as an HTML file with Vue.js embedded since that's what renders in the interface.</p>`,
    },
    {
        type: 'action',
        icon: 'file-write-icon',
        label:
            "Create a Vue.js Extended Thinking component that replicates Claude's web interface thinking block",
        file: 'extended-thinking.html',
    },
    {
        type: 'thinking',
        clippable: false,
        html: '<p>Let me present this file to the user.</p>',
    },
    {
        type: 'present',
        label: 'Presented file',
    },
    {
        type: 'thinking',
        clippable: false,
        html: '<p>The file is ready for the user to view.</p>',
    },
    {
        type: 'done',
    },
]

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
    return chunks
}

function openThinkingDialog() {
    dialogOpen.value = true
    runDemo()
}

async function runDemo() {
    aborted = false
    thinkingSteps.value = []
    durationSeconds.value = 0
    isStreaming.value = true

    durationTimer = setInterval(() => {
        durationSeconds.value++
    }, 1000)

    for (const step of sourceSteps) {
        if (aborted) break

        if (step.type === 'thinking') {
            thinkingSteps.value.push({ ...step, html: '' })
            const chunks = splitHtmlChunks(step.html)
            for (const chunk of chunks) {
                if (aborted) break
                await sleep(60 + Math.random() * 140)
                const last = thinkingSteps.value[thinkingSteps.value.length - 1] as TimelineStep | undefined
                if (last?.type === 'thinking') {
                    last.html += chunk
                }
            }
            if (!aborted) await sleep(500)
        } else if (step.type === 'done') {
            thinkingSteps.value.push(step)
        } else {
            thinkingSteps.value.push(step)
            if (!aborted) await sleep(500)
        }
    }

    isStreaming.value = false
    if (durationTimer) {
        clearInterval(durationTimer)
        durationTimer = null
    }
}

function stopTimers() {
    aborted = true
    if (durationTimer) {
        clearInterval(durationTimer)
        durationTimer = null
    }
}

onMounted(() => {
    // Demo can be triggered by button click
})

onUnmounted(() => {
    stopTimers()
})
</script>

<template>
    <div class="thinking-view">
        <div class="demo-controls">
            <h2>Thinking Dialog Demo</h2>
            <Button @click="openThinkingDialog" :disabled="dialogOpen">
                {{ dialogOpen ? 'Dialog Open' : 'Open Thinking Dialog' }}
            </Button>
        </div>
        
        <ThinkingDialog 
            v-model:open="dialogOpen" 
            :stream="thinkingStream" 
        />
    </div>
</template>

<style scoped>
.thinking-view {
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;
}

.demo-controls {
    margin-bottom: 32px;
    padding: 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    border: 1px solid var(--border-300);
}

.demo-controls h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-200);
}

.replay-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 16px;
    font: inherit;
    font-size: 13px;
    color: var(--text);
    cursor: pointer;
    transition:
        color 0.15s,
        border-color 0.15s;
}


.response-text {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 16px;
    line-height: 1.7;
    color: var(--text-200);
    padding-left: 8px;
    padding-right: 32px;
}

.response-text p {
    margin-bottom: 12px;
}

.response-text code {
    background: var(--background);
    border: 1px solid var(--border);
    color: var(--destructive);
    border-radius: 5px;
    padding: 1px 5px;
    font-size: 0.9em;
}
</style>
