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
import { Report } from './models'

const reports: Report[] = [
    {
        id: '1',
        type: '10K',
        year: 2023,
        version: 1,
        description: 'Sample 10K report for 2023',
    },
    {
        id: '2',
        type: '10K',
        year: 2024,
        version: 1,
        description: 'Sample 10K report for 2024',
    }
]
</script>

<template>
    <Card>
        <CardHeader>
            <h2 class="text-lg font-semibold">Financial Reports</h2>
        </CardHeader>
        <CardContent>
            <Table>
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
</template>
