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
import { Button } from '@/components/ui/button'
import { Report } from './models'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardAction from '@/components/ui/card/CardAction.vue'

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
    <div :class="'flex flex-col gap-6'">
        <Card>
            <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardAction>
                    <Button>Upload</Button>
                </CardAction>
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
    </div>
</template>

