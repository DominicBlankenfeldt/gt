<template>
    <div class="d-flex justify-content-center">
        <div class="p-0" id="game">
            <game />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import game from '@/components/SpaceGame.vue'

export default defineComponent({
    data() {
        return {}
    },
    components: {
        game,
    },
})
</script>

<style scoped lang="scss">
* {
    color: white;
}
</style>
