<template>
    <div class="input-contain mt-3" style="text-shadow: none">
        <input
            v-if="type != 'textarea'"
            v-bind="$attrs"
            class="form-control shadow-none"
            :type="viewPassword ? 'text' : type"
            :value="modelValue"
            @input="updateValue"
            :class="{ dirty: modelValue }"
            :list="id"
            autocomplete="off"
        />
        <textarea
            v-if="type == 'textarea'"
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
        <datalist :id="id" v-if="options">
            <option :value="optionKey ? option[optionKey] : option" v-for="option of options" :key="JSON.stringify(option)"></option>
        </datalist>
        <button v-if="btnText" type="button" @click="affirm()" :class="btnClass">{{ btnText }}</button>
        <button v-if="type == 'password'" type="button" @click="showPassword()" :class="btnClass">
            <template v-if="!viewPassword">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                    <path
                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
                    />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
            </template>
            <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                    <path
                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"
                    />
                    <path
                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"
                    />
                    <path
                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"
                    />
                </svg>
            </template>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    setup() {
        return
    },
    data() {
        return {
            id: '',
            viewPassword: false,
        }
    },
    mounted() {
        this.id = 'input' + Math.random()
        if (this.type == 'date') {
            if (this.modelValue.length == 10) {
                return
            }
            const date = new Date()
            const result = date.toISOString().split('T')[0]
            this.updateValue(result)
        }
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
        options: {
            type: Array,
        },
        optionKey: {
            type: String,
        },
    },
    methods: {
        showPassword() {
            this.viewPassword = !this.viewPassword
        },
        updateValue(event: Event | string) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (typeof event == 'string') {
                this.$emit('update:modelValue', event)
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.$emit('update:modelValue', event.target.value)
            }
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
        &:not(.dirty)::-webkit-datetime-edit {
            color: transparent;
            cursor: pointer;
        }
        &:focus::-webkit-datetime-edit {
            display: block !important;
        }
        &::-webkit-calendar-picker-indicator {
            display: block;
            cursor: pointer;
            height: auto;
            width: 5%;
            position: absolute;
            left: 94%;
            right: 0;
            top: 0;
            bottom: 0;
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
            border-radius: 1rem;
            transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out;
        }
    }
    input:focus + .placeholder-text .text,
    input.dirty + .placeholder-text .text,
    input[type='file'] + .placeholder-text .text {
        background-color: white;
        border-radius: 1rem;
        font-size: 1.1rem;
        color: rgb(22, 22, 22);
        transform: translate(0, -100%);
        &.text:after {
            content: '';
            position: absolute;
            left: 0px;
            // top: 25%;
            width: 100%;
            border-radius: 1rem 1rem 0rem 0rem;
            height: 50%;
            border-top: 2px solid black;
            border-left: 2px solid black;
            border-right: 2px solid black;
        }
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
        text-shadow: none;
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
        border-radius: 1rem;
        font-size: 1.1rem;
        color: black;
        transform: translate(0, -80%);
        &.text:after {
            content: '';
            position: absolute;
            left: 0px;
            // top: 25%;
            width: 100%;
            border-radius: 1rem 1rem 0rem 0rem;
            height: 50%;
            border-top: 2px solid black;
            border-left: 2px solid black;
            border-right: 2px solid black;
        }
    }
    textarea:focus + .placeholder-text .text {
        border-color: var(--navbarColor1);
        color: var(--navbarColor1);
    }
    option {
        text-align: start;
    }
}
</style>
