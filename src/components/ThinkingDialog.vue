<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineStep } from '@/types/thinking'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import ThinkingBlock from '@/components/ThinkingBlock.vue'
import { X } from 'lucide-vue-next'

interface ThinkingStream {
  summary?: string
  thinkingSteps?: TimelineStep[]
  isStreaming?: boolean
  durationSeconds?: number
}

const props = withDefaults(
  defineProps<{
    open?: boolean
    stream?: ThinkingStream
  }>(),
  {
    open: false,
    stream: () => ({
      summary: '',
      thinkingSteps: [],
      isStreaming: false,
      durationSeconds: 0,
    }),
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isStreaming = computed(() => props.stream?.isStreaming ?? false)

const handleOpenChange = (value: boolean) => {
  // Only allow closing if not streaming
  if (!isStreaming.value) {
    emit('update:open', value)
  }
}

const handleClose = () => {
  if (!isStreaming.value) {
    emit('update:open', false)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent
      class="max-w-2xl max-h-[80vh] flex flex-col"
      :can-close="!isStreaming"
    >
      <DialogHeader class="flex-shrink-0">
        <DialogTitle>Thinking Process</DialogTitle>
        <button
          v-if="!isStreaming"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          @click="handleClose"
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </button>
      </DialogHeader>
      <div class="flex-1 overflow-y-auto">
        <ThinkingBlock
          :summary="stream?.summary"
          :thinking-steps="stream?.thinkingSteps"
          :is-streaming="stream?.isStreaming"
          :duration-seconds="stream?.durationSeconds"
          :start-open="false"
        />
      </div>
      <DialogFooter class="flex-shrink-0">
        <Button 
          @click="handleClose" 
          :disabled="isStreaming"
          variant="outline"
        >
          {{ isStreaming ? 'Streaming...' : 'Close' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
