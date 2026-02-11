<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

import CardTitle from '@/components/ui/card/CardTitle.vue'
import { computed } from 'vue'

export interface ReportValue {
    report_year: number
    line_item: string
    page: number
    value_year: number
    value: string
}

export interface DiscrepancyRow {
    line_item: string
    values: [ReportValue, ReportValue, string]
}

export interface DiscrepancyData {
    report_type: string
    year1: number
    year2: number
    section_name: string
    table: {
        headers: string[]
        rows: DiscrepancyRow[]
    }
}

export interface TableProps {
    header?: string
    data: DiscrepancyData
}

const props = defineProps<TableProps>()

const columns = computed(() => props.data.table.headers.map((header, index) => ({
    label: header || 'Description',
    align: index === 0 ? 'left' as const : 'center' as const
})))

function getDiscrepancyClass(value: string): string {
    if (value === 'None') {
        return 'text-success'
    }
    return 'text-danger font-semibold'
}

function isReportValue(value: any): value is ReportValue {
    return typeof value === 'object' && value !== null && 'report_year' in value
}

const emit = defineEmits<{
    referenceClick: [value: ReportValue]
}>()

function handleCellClick(value: ReportValue) {
    emit('referenceClick', value)
}
</script>

<template>
    <div :class="'flex flex-col gap-6'">
        <Card>
            <CardHeader>
                <CardTitle v-if="props.header">{{ props.header }}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead v-for="column in columns" :key="column.label" :align="column.align">
                                {{ column.label }}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="(row, rowIndex) in props.data.table.rows" :key="rowIndex">
                            <TableCell :align="'left'">
                                <span class="text-xs font-medium text-dark">
                                    {{ row.line_item }}
                                </span>
                            </TableCell>
                            <TableCell v-for="(value, valueIndex) in row.values" :key="valueIndex">
                                <a v-if="isReportValue(value)" href="#" @click.prevent="handleCellClick(value)"
                                    class="text-xs text-dark-lighter hover:text-primary hover:underline cursor-pointer">
                                    {{ value.value }}
                                </a>
                                <span v-else class="text-xs" :class="[
                                    'text-dark-lighter',
                                    getDiscrepancyClass(value)
                                ]">
                                    {{ value }}
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
</template>
