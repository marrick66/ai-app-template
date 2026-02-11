<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type ComparisonEntry } from './models'
import { Card, CardHeader, CardContent, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ComparisonEntryTable from './ComparisonEntryTable.vue'

const comparisons = ref<ComparisonEntry[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchMockComparisons = (): ComparisonEntry[] => {
    return [
        {
            id: '1',
            report_type: '10-K',
            section_name: 'Revenue Recognition',
            year1: 2023,
            year2: 2024,
        },
        {
            id: '2',
            report_type: '10-K',
            section_name: 'Operating Expenses',
            year1: 2023,
            year2: 2024,
        },
        {
            id: '3',
            report_type: '10-Q',
            section_name: 'Cash Flow Analysis',
            year1: 2023,
            year2: 2024,
        },
        {
            id: '4',
            report_type: '10-K',
            section_name: 'Risk Factors',
            year1: 2022,
            year2: 2023,
        }]
}

const fetchComparisons = async () => {
    try {
        loading.value = true
        error.value = null
        const response = await fetch('/comparisons')
        if (!response.ok) {
            throw new Error(`Failed to fetch comparisons: ${response.statusText}`)
        }
        comparisons.value = await response.json()
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'An error occurred'
        console.error('Error fetching comparisons:', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    comparisons.value = fetchMockComparisons()
    loading.value = false
})
</script>

<template>
    <div :class="'flex flex-col gap-6'">
        <Card>
            <CardHeader>
                <CardTitle>Report Comparisons</CardTitle>
                <CardAction>
                    <Button>
                        Create
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <ComparisonEntryTable :comparisons="comparisons" />
            </CardContent>
        </Card>
    </div>
</template>