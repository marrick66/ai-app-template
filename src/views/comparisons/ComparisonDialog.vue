<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
import type Report from '@/views/reports/models'
import type { ComparisonParams } from './models'

const SECTION_NAMES = [
  'Revenue Recognition',
  'Operating Expenses',
  'Cash Flow Analysis',
  'Risk Factors',
  'Balance Sheet Summary',
  'Equity Compensation',
]

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
  'submit': [data: ComparisonParams]
}>()

const reports = ref<Report[]>([])
const loadingReports = ref(false)
const report1Id = ref('')
const report2Id = ref('')
const sectionName = ref('')
const error = ref<string | null>(null)

const canSubmit = computed(
  () =>
    report1Id.value !== '' &&
    report2Id.value !== '' &&
    report1Id.value !== report2Id.value &&
    sectionName.value !== '',
)

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await fetchReports()
    }
  },
)

async function fetchReports() {
  try {
    loadingReports.value = true
    const response = await fetch(`${config.apiBaseUrl}/reports`)
    if (!response.ok) throw new Error(`Failed to fetch reports: ${response.statusText}`)
    const json = await response.json()
    reports.value = json.reports
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load reports'
  } finally {
    loadingReports.value = false
  }
}

function handleOpenChange(value: boolean) {
  if (!value) reset()
  emit('update:open', value)
}

function reset() {
  report1Id.value = ''
  report2Id.value = ''
  sectionName.value = ''
  error.value = null
}

function handleSubmit() {
  if (!canSubmit.value) return

  const r1 = reports.value.find((r) => r.id === report1Id.value)
  const r2 = reports.value.find((r) => r.id === report2Id.value)
  if (!r1 || !r2) return

  emit('submit', {
    report_type: r1.type,
    section_name: sectionName.value,
    year1: r1.year,
    year2: r2.year,
  })
  reset()
  emit('update:open', false)
}

function reportLabel(report: Report) {
  return `${report.type} — ${report.year} (v${report.version})`
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Comparison</DialogTitle>
        <DialogDescription>Select two reports and a section to compare.</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <label for="comparison-report1" class="text-sm font-medium">
            Report 1 <span class="text-destructive">*</span>
          </label>
          <select
            id="comparison-report1"
            v-model="report1Id"
            :disabled="loadingReports"
            class="border-input bg-transparent h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="" disabled>Select a report</option>
            <option v-for="report in reports" :key="report.id" :value="report.id">
              {{ reportLabel(report) }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-2">
          <label for="comparison-report2" class="text-sm font-medium">
            Report 2 <span class="text-destructive">*</span>
          </label>
          <select
            id="comparison-report2"
            v-model="report2Id"
            :disabled="loadingReports"
            class="border-input bg-transparent h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="" disabled>Select a report</option>
            <option v-for="report in reports" :key="report.id" :value="report.id">
              {{ reportLabel(report) }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-2">
          <label for="comparison-section" class="text-sm font-medium">
            Section <span class="text-destructive">*</span>
          </label>
          <select
            id="comparison-section"
            v-model="sectionName"
            class="border-input bg-transparent h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="" disabled>Select a section</option>
            <option v-for="section in SECTION_NAMES" :key="section" :value="section">
              {{ section }}
            </option>
          </select>
        </div>

        <div v-if="error" class="text-sm text-destructive">{{ error }}</div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="handleOpenChange(false)"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="!canSubmit">
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
