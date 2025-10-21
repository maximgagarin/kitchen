<template>
  <div class="configurator-menu">
    <div class="menu-header">
      <h2>Конфигуратор кухни</h2>
      <div class="progress-bar">
        <div class="progress" :style="{width: progress + '%'}"></div>
      </div>
    </div>
    
    <div class="menu-content">
      <!-- Шаг 1: Тип кухни -->
      <div v-if="step === 1" class="step">
        <h3>1. Тип кухни</h3>
        <div class="radio-cards">
          <label v-for="type in kitchenTypes" :key="type.value" 
                 :class="{'radio-card': true, 'active': selectedType === type.value}">
            <input type="radio" v-model="selectedType" :value="type.value" hidden>
            <div class="card-icon">
              <i :class="type.icon"></i>
            </div>
            <span>{{ type.label }}</span>
          </label>
        </div>
      </div>
      
      <!-- Шаг 2: Размеры -->
      <div v-if="step === 2" class="step">
        <h3>2. Размеры кухни</h3>
        <div class="range-group">
          <label>Длина (см)</label>
          <input type="range" v-model="length" min="150" max="500" step="10" class="slider">
          <div class="range-value">{{ length }} см</div>
        </div>
        
        <div class="range-group">
          <label>Ширина (см)</label>
          <input type="range" v-model="width" min="100" max="400" step="10" class="slider">
          <div class="range-value">{{ width }} см</div>
        </div>
      </div>
      
      <!-- Шаг 3: Высокие шкафы -->
      <div v-if="step === 3" class="step">
        <h3>3. Высокие шкафы</h3>
        <div class="toggle-group">
          <label class="toggle">
            <input type="checkbox" v-model="hasTallCabinets" hidden>
            <span class="toggle-slider"></span>
            <span class="toggle-label">{{ hasTallCabinets ? 'Да' : 'Нет' }}</span>
          </label>
        </div>
      </div>
      
      <!-- Шаг 4: Техника -->
      <div v-if="step === 4" class="step">
        <h3>4. Выберите технику</h3>
        <div class="radio-options">
          <label v-for="item in appliances" :key="item.value" 
                 :class="{'radio-option': true, 'active': selectedAppliance === item.value}">
            <input type="radio" v-model="selectedAppliance" :value="item.value" hidden>
            <span>{{ item.label }}</span>
          </label>
        </div>
      </div>
      
      <div class="navigation-buttons">
        <button @click="prevStep" :disabled="step === 1" class="nav-button back">
          Назад
        </button>
        <button @click="nextStep" :disabled="step === totalSteps" class="nav-button next">
          {{ step === totalSteps ? 'Завершить' : 'Далее' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.configurator-menu {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: #1e1e1e;
  color: #fff;
  box-shadow: -2px 0 15px rgba(0, 0, 0, 0.3);
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.menu-header {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.menu-header h2 {
  margin: 0 0 15px 0;
  font-weight: 500;
  font-size: 1.5rem;
}

.progress-bar {
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.menu-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.step {
  margin-bottom: 30px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.step h3 {
  margin: 0 0 20px 0;
  font-weight: 400;
  font-size: 1.2rem;
  color: #ddd;
}

.radio-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.radio-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-card:hover {
  background: #333;
}

.radio-card.active {
  background: #4CAF50;
  border-color: #4CAF50;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #fff;
}

.range-group {
  margin-bottom: 20px;
}

.range-group label {
  display: block;
  margin-bottom: 8px;
  color: #aaa;
}

.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: #333;
  border-radius: 3px;
  outline: none;
  margin-bottom: 10px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #4CAF50;
  border-radius: 50%;
  cursor: pointer;
}

.range-value {
  text-align: right;
  color: #4CAF50;
  font-weight: 500;
}

.toggle-group {
  display: flex;
  align-items: center;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  margin-right: 15px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: #4CAF50;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(30px);
}

.toggle-label {
  color: #ddd;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option:hover {
  background: #333;
}

.radio-option.active {
  background: #4CAF50;
  border-color: #4CAF50;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.nav-button {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button.back {
  background: #333;
  color: #fff;
}

.nav-button.back:hover {
  background: #444;
}

.nav-button.next {
  background: #4CAF50;
  color: #fff;
}

.nav-button.next:hover {
  background: #66BB6A;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<script>
export default {
  data() {
    return {
      step: 1,
      totalSteps: 4,
      selectedType: 'linear',
      kitchenTypes: [
        { value: 'linear', label: 'Линейная', icon: 'fas fa-ellipsis-h' },
        { value: 'l-shaped', label: 'Г-образная', icon: 'fas fa-border-none' },
        { value: 'u-shaped', label: 'П-образная', icon: 'fas fa-square' },
        { value: 'island', label: 'Островная', icon: 'fas fa-th-large' }
      ],
      length: 300,
      width: 250,
      hasTallCabinets: false,
      selectedAppliance: 'oven',
      appliances: [
        { value: 'oven', label: 'Духовой шкаф' },
        { value: 'dishwasher', label: 'Посудомоечная машина' },
        { value: 'microwave', label: 'Микроволновая печь' }
      ]
    }
  },
  computed: {
    progress() {
      return (this.step / this.totalSteps) * 100;
    }
  },
  methods: {
    nextStep() {
      if (this.step < this.totalSteps) this.step++;
    },
    prevStep() {
      if (this.step > 1) this.step--;
    }
  }
}
</script>