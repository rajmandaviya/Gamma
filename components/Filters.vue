<template>
    <Accordion type="multiple" collapsible className="w-full">
        <AccordionItem class="border-b-2 border-gray-500 rounded" v-for="(filter, index) in filters" :key="filter.title" :value="'filter-' + index">
            <AccordionTrigger>{{ filter.title }}</AccordionTrigger>
            <AccordionContent>
                <div v-if="filter.type === 'range'">
                    <div v-for="option in filter.options" :key="option.label">
                        <label>
                            <input
                                type="checkbox"
                                :value="option.value"
                                :checked="selectedFilters.Price.some(selectedRange =>
                  selectedRange[0] === option.value[0] && selectedRange[1] === option.value[1]
                )"
                                @change="togglePriceRange(option.value)"
                            />
                            {{ formatPriceLabel(option.value[0], option.value[1]) }}
                        </label>
                    </div>

<!--                    <div>-->
<!--                        <input-->
<!--                            type="range"-->
<!--                            :min="filter.range.min"-->
<!--                            :max="filter.range.max"-->
<!--                            v-model="selectedFilters[filter.title][0]"-->
<!--                        />-->
<!--                        <input-->
<!--                            type="range"-->
<!--                            :min="filter.range.min"-->
<!--                            :max="filter.range.max"-->
<!--                            v-model="selectedFilters[filter.title][1]"-->
<!--                        />-->
<!--                        <p>Selected Range: {{ selectedFilters[filter.title][0] }} - {{ selectedFilters[filter.title][1] }}</p>-->
<!--                    </div>-->
                </div>

                <div v-else-if="filter.type === 'checkbox'">
                    <div v-for="option in filter.options" :key="option">
                        <label>
                            <input type="checkbox" :value="option" v-model="selectedFilters[filter.title]" />
                            {{ option }}
                        </label>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>

    <!-- Output for debugging -->
    <pre>{{ selectedFilters }}</pre>
</template>
<script setup>
import { ref, reactive } from 'vue';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const filters = ref([
    {
        title: 'Price',
        type: 'range',
        options: [
            { label: '0-100', value: [0, 100] },
            { label: '100-300', value: [100, 300] },
            { label: '300-500', value: [300, 500] },
            { label: '500-700', value: [500, 700] },
            { label: '700-1000', value: [700, 1000] },
            { label: '> 1000', value: [1000, Infinity] },
        ],
        range: {
            min: 0,
            max: 5700,
            value: [0, 5700],
        }
    },
    {
        title: 'Brand',
        type: 'checkbox',
        options: ['Ailiang', 'CASK', 'F&D', 'GOLD JINRU', 'GOLON', 'GS'],
    },
    {
        title: 'Material',
        type: 'checkbox',
        options: ['Metal', 'Plastic', 'Aluminium', 'Silicon'],
    },
    {
        title: 'Color',
        type: 'checkbox',
        options: ['White', 'Red', 'Green', 'Black'],
    },
    {
        title: 'Length',
        type: 'checkbox',
        options: ['110 cm', '230 cm', '343 cm', '49 cm', '521 cm', '612 cm'],
    },
    {
        title: 'Weight',
        type: 'checkbox',
        options: ['180 g', '260 g', '325 g', '5100 g', '653 g'],
    },
    {
        title: 'Diameter',
        type: 'checkbox',
        options: ['110cm', '220cm', '323cm', '418cm', '524cm', '615cm'],
    }
]);

const selectedFilters = reactive({});


filters.value.forEach(filter => {
    selectedFilters[filter.title] = [];
    // if (filter.type === 'range') {
    //     // Initialize an empty array for the price ranges, allowing multiple selections
    //     selectedFilters[filter.title] = [];
    // } else if (filter.type === 'checkbox') {
    //     // Initialize empty array for checkbox filters like brands, materials, colors
    //     selectedFilters[filter.title] = [];
    // }

});
const formatPriceLabel = (min, max) => {
    if (max === Infinity) return `> ${min}`;
    return `${min} - ${max}`;
};

const togglePriceRange = (range) => {
    const index = selectedFilters.Price.findIndex(selectedRange =>
        selectedRange[0] === range[0] && selectedRange[1] === range[1]
    );

    // Add range if not selected, remove it if already selected
    if (index > -1) {
        selectedFilters.Price.splice(index, 1);
    } else {
        selectedFilters.Price.push(range);
    }
};
</script>
<style scoped>
</style>
