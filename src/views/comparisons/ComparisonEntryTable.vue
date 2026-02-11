<script setup lang="ts">
import { type ComparisonEntry } from './models'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon } from 'lucide-vue-next'

defineProps<{
    comparisons: ComparisonEntry[]
}>()
</script>

<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Report Type</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead class="text-right">
                    Actions
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="comparison in comparisons" :key="comparison.id">
                <TableCell>{{ comparison.report_type }}</TableCell>
                <TableCell>{{ comparison.section_name }}</TableCell>
                <TableCell>{{ comparison.year1 }}</TableCell>
                <TableCell>{{ comparison.year2 }}</TableCell>
                <TableCell class="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontalIcon />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem variant="destructive">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>
