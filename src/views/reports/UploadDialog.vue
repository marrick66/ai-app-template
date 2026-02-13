<script setup lang="ts">
import { ref, computed } from 'vue'
import { config } from '@/lib/config'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    open?: boolean
  }>(),
  {
    open: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  'uploaded': []
}>()

const file = ref<File | null>(null)
const description = ref('')
const uploading = ref(false)
const error = ref<string | null>(null)

const canSubmit = computed(() => file.value !== null && description.value.trim() !== '')

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
}

function handleOpenChange(value: boolean) {
  if (uploading.value) return
  if (!value) reset()
  emit('update:open', value)
}

function reset() {
  file.value = null
  description.value = ''
  error.value = null
}

async function handleSubmit() {
  if (!file.value || !description.value.trim()) return

  uploading.value = true
  error.value = null

  try {
    const formData = new FormData()
    formData.append('file', file.value)
    formData.append('description', description.value.trim())

    const response = await fetch(`${config.apiBaseUrl}/uploads`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`)

    emit('uploaded')
    reset()
    emit('update:open', false)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent :show-close-button="!uploading">
      <DialogHeader>
        <DialogTitle>Upload PDF</DialogTitle>
        <DialogDescription>Select a PDF file and provide a description.</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <label for="upload-file" class="text-sm font-medium">File</label>
          <Input
            id="upload-file"
            type="file"
            accept=".pdf,application/pdf"
            :disabled="uploading"
            @change="handleFileChange"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="upload-description" class="text-sm font-medium">
            Description <span class="text-destructive">*</span>
          </label>
          <Input
            id="upload-description"
            v-model="description"
            placeholder="Enter a description"
            :disabled="uploading"
          />
        </div>

        <div v-if="error" class="text-sm text-destructive">{{ error }}</div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            :disabled="uploading"
            @click="handleOpenChange(false)"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="!canSubmit || uploading">
            <Loader2 v-if="uploading" class="mr-2 h-4 w-4 animate-spin" />
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
