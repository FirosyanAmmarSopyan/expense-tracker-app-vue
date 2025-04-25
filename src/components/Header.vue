<template>
    <div class="header">
        <div class="header-right">
            <img src="/src/assets/logo-ttg.svg" class="logo" width="50" height="25" />
            <img src="/src/assets/hamburger.svg" width="25" height="25" />
        </div>
        <div class="header-left">
            <div 
                class="profil" 
                @click="showColorPicker = !showColorPicker"
            >
                Profil
            </div>
                <!-- Popup color picker -->
                <transition name="fade">
                <div v-if="showColorPicker" class="color-picker-popup">
                    <label for="themeColor">Choose Theme Color:</label>
                    <input 
                    id="themeColor" 
                    type="color" 
                    v-model="selectedColor" 
                    @input="applyThemeColor" 
                    />
                </div>
            </transition>

        </div>
    </div>
</template>


<script setup>
import { useThemeStore } from '@/stores/themeStore';
import { ref } from 'vue';

const showColorPicker = ref(false);
const selectedColor = ref('#ffffff');
const themeStore = useThemeStore();

function applyThemeColor() {
  themeStore.setBackgroundColor(selectedColor.value)
}

</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #f0fff0;
}

.header-right {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.profil{
    cursor: pointer;
}
</style>