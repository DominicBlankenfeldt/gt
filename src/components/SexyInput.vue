<template>
    <div class="input-contain mt-3">
        <input
            v-if="type != 'textarea'"
            v-bind="$attrs"
            class="form-control shadow-none"
            :type="type"
            :value="modelValue"
            @input="updateValue"
            :class="{ dirty: modelValue }"
            autocomplete="off"
            style="text-shadow: none"
        />
        <textarea
            v-else
            v-bind="$attrs"
            class="form-control shadow-none"
            @input="updateValue"
            :value="modelValue"
            :class="{ dirty: modelValue }"
            rows="3"
        ></textarea>
        <label class="placeholder-text">
            <div class="text">{{ placeholder }}</div>
        </label>
        <button v-if="btnText" type="button" @click="affirm()" :class="btnClass">{{ btnText }}</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    setup() {
        return
    },
    data() {
        return {}
    },
    props: {
        placeholder: {
            type: String,
            required: true,
        },
        modelValue: {
            type: String || Number,
            required: true,
        },
        type: {
            type: String,
        },
        btnText: {
            type: String,
        },
        btnClass: {
            type: String,
        },
        btnAction: {
            type: Function,
        },
    },
    methods: {
        updateValue(event: Event) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.$emit('update:modelValue', event.target.value)
        },
        async affirm() {
            try {
                if (this.btnAction) await this.btnAction()
            } catch {
                return
            }
        },
    },
})
</script>
<style scoped lang="scss">
//material inputs
.input-contain {
    position: relative;

    input {
        text-align: start;
        padding-left: 1.5rem;
        padding-top: 1rem;
        height: 3.5rem;
        width: 100%;
        line-height: 4rem;
        border: 2px solid black;
        border-radius: 1rem;
        .placeholder-text {
            font-size: 1.4rem; //input fontsize
            padding: 0 1.2rem;
        }
        &:focus {
            outline: none;
            border-color: var(--navbarColor1);
            & + .placeholder-text .text {
                background-color: white;
                font-size: 1.1rem;
                transform: translate(0, -100%);
                border-color: var(--navbarColor1);
                color: var(--navbarColor1);
            }
        }
    }
    input[type='date'] {
        &:invalid::-webkit-datetime-edit {
            display: none;
        }
        &::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
        }
    }

    input[type='file'] {
        line-height: 1rem;
        &::-webkit-file-upload-button {
            margin-top: 0.05rem;
            padding: 0.3rem;
        }
    }
    button {
        align-items: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 80%;
        right: 0;
        width: 20%;
        border-radius: 1rem;
        display: flex;
        background-color: transparent;
        justify-content: center;
    }
    .placeholder-text {
        align-items: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        color: gray;
        pointer-events: none;
        .text {
            font-size: 1.4rem; // placeholder
            padding: 0 0.5rem;
            margin: 0 1rem;
            transform: translate(0);
            color: gray;
            transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out;
        }
    }
    input:focus + .placeholder-text .text,
    input.dirty + .placeholder-text .text,
    input[type='file'] + .placeholder-text .text {
        background-color: white;
        border-radius: 25%;
        font-size: 1.1rem;
        color: rgb(22, 22, 22);
        transform: translate(0, -100%);
    }
    input:focus + .placeholder-text .text {
        border-color: var(--navbarColor1);
        color: var(--navbarColor1);
    }
    textarea {
        text-align: start;
        padding-left: 1.5rem;
        min-height: 3.5rem;
        width: 100%;
        border: 2px solid black;
        border-radius: 1rem;
        padding-top: 1rem;
        .placeholder-text {
            font-size: 1.4rem; //input fontsize
            padding: 1rem 1.2rem;
        }
    }

    textarea:focus {
        outline: none;
        border-color: var(--navbarColor1);
        & + .placeholder-text .text {
            background-color: white;
            font-size: 1.1rem;
            transform: translate(0, -50%);
            border-color: var(--navbarColor1);
            color: var(--navbarColor1);
        }
    }
    .placeholder-text {
        align-items: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        color: gray;
        pointer-events: none;

        .text {
            font-size: 1.4rem; // placeholder
            padding: 0 0.5rem;
            margin: 0.6rem 1rem;
            transform: translate(0);
            color: gray;
            transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out;
        }
    }
    textarea:focus + .placeholder-text .text,
    textarea.dirty + .placeholder-text .text {
        background-color: white;
        border-radius: 25%;
        font-size: 1.1rem;
        color: black;
        transform: translate(0, -80%);
    }
    textarea:focus + .placeholder-text .text {
        border-color: var(--navbarColor1);
        color: var(--navbarColor1);
    }
    textarea + .placeholder-text {
        align-items: flex-start;
    }
}
</style>
