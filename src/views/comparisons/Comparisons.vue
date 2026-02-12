<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type ComparisonEntry } from './models'
import { Card, CardHeader, CardContent, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import ComparisonEntryTable from './ComparisonEntryTable.vue'

const comparisons = ref<ComparisonEntry[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchComparisons = async () => {
    try {
        loading.value = true
        error.value = null
        const response = await fetch('/api/comparisons')
        if (!response.ok) {
            throw new Error(`Failed to fetch comparisons: ${response.statusText}`)
        }
        const json = await response.json()
        comparisons.value = json.comparisons
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'An error occurred'
        console.error('Error fetching comparisons:', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchComparisons()
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
                <div v-if="loading" class="py-8 flex items-center justify-center">
                    <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
                <div v-else-if="error" class="py-8 text-center text-destructive">{{ error }}</div>
                <ComparisonEntryTable v-else :comparisons="comparisons" />
            </CardContent>
        </Card>
    </div>
</template>