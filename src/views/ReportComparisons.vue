<script setup>
import ComparisonTable from '@/components/ComparisonTable.vue'

const data = {
    report_type: '10K',
    year1: 2023,
    year2: 2024,
    section_name: 'Financial Highlights',
    table: {
        headers: ['Line Item', '2023 Value', '2024 Value', 'Discrepancy'],
        rows: [
            {
                line_item: 'Total Revenue',
                values: [
                    { report_year: 2023, line_item: 'Total Revenue', page: 5, value_year: 2023, value: '$100M' },
                    { report_year: 2024, line_item: 'Total Revenue', page: 5, value_year: 2024, value: '$110M' },
                    '10% increase'
                ]
            },
            {
                line_item: 'Net Income',
                values: [
                    { report_year: 2023, line_item: 'Net Income', page: 5, value_year: 2023, value: '$10M' },
                    { report_year: 2024, line_item: 'Net Income', page: 5, value_year: 2024, value: '$8M' },
                    '20% decrease'
                ]
            }
        ]
    }
}
</script>
<template>
    <ComparisonTable :data="data" header="Report Comparisons" />
</template>