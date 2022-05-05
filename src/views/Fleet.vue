<template>
    <div class="fleet" style="margin-top: 12vh"><FleetOptions /></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import FleetOptions from '@/components/FleetOptions.vue'
export default defineComponent({
    setup() {
        return
    },
    components: {
        FleetOptions,
    },
})
</script>
