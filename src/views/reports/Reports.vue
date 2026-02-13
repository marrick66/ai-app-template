<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import type Report from './models'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardAction from '@/components/ui/card/CardAction.vue'
import UploadDialog from './UploadDialog.vue'
import { config } from '@/lib/config'

const reports = ref<Report[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const uploadOpen = ref(false)

async function fetchReports() {
    try {
        loading.value = true
        const response = await fetch(`${config.apiBaseUrl}/reports`)
        if (!response.ok) throw new Error(`Failed to fetch reports: ${response.statusText}`)
        const json = await response.json()
        reports.value = json.reports
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'An error occurred'
        console.error('Error fetching reports:', err)
    } finally {
        loading.value = false
    }
}

onMounted(fetchReports)
</script>

<template>
    <div :class="'flex flex-col gap-6'">
        <Card>
            <CardHeader>
                <CardTitle>SEC Reports</CardTitle>
                <CardAction>
                    <Button @click="uploadOpen = true">Upload</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div v-if="loading" class="py-8 flex items-center justify-center">
                    <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
                <div v-else-if="error" class="py-8 text-center text-destructive">{{ error }}</div>
                <Table v-else>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[100px]">
                                Type
                            </TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>
                                Description
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="report in reports" :key="report.id">
                            <TableCell class="font-medium">
                                {{ report.type }}
                            </TableCell>
                            <TableCell>{{ report.year }}</TableCell>
                            <TableCell>{{ report.version }}</TableCell>
                            <TableCell>
                                {{ report.description }}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <UploadDialog v-model:open="uploadOpen" @uploaded="fetchReports" />
    </div>
</template>

