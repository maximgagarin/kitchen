<template>  
    <div class="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
  <!-- Заголовок -->
  <div class="flex items-center justify-between">
    <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight">
      Панель конфигуратора кухни
    </h2>
    <div class="flex items-center gap-2 text-sm text-zinc-500">
      <span>Угловая кухня</span>
      <!-- Switch -->
      <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-300">
        <span class="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
      </button>
    </div>
  </div>

  <!-- Готовые варианты -->
  <div class="rounded-2xl border bg-white shadow-sm">
    <div class="p-4 border-b">
      <h3 class="flex items-center gap-2 text-xl font-semibold">
        <svg class="w-5 h-5" fill="none" stroke="currentColor"><path /></svg>
        Готовые варианты расстановки
      </h3>
    </div>
    <div class="p-4 space-y-5">
      <!-- Сетка вариантов -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button class="group rounded-2xl border p-3 text-left transition shadow-sm hover:shadow border-zinc-200">
          <div class="aspect-video w-full rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-100 grid place-items-center text-xs text-zinc-500">
            превью
          </div>
          <div class="mt-3 flex items-center justify-between">
            <span class="font-medium">Вариант 1</span>
            <div class="h-2.5 w-2.5 rounded-full bg-zinc-300"></div>
          </div>
          <p class="mt-1 text-xs text-zinc-500">
            Перестроит сцену и сбросит изменения.
          </p>
        </button>
        <!-- другие варианты ... -->
      </div>

      <!-- Управление ряд/сторона -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="flex items-center gap-2">
          <label class="min-w-[110px]">Ряд</label>
          <div class="inline-flex rounded-xl border p-1">
            <button class="px-3 py-1 rounded-lg bg-zinc-900 text-white">Нижний</button>
            <button class="px-3 py-1 rounded-lg">Верхний</button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label class="min-w-[110px]">Сторона</label>
          <div class="inline-flex rounded-xl border p-1">
            <button class="px-3 py-1 rounded-lg bg-zinc-900 text-white">Лево</button>
            <button class="px-3 py-1 rounded-lg">Право</button>
          </div>
        </div>

        <div class="flex items-center justify-end">
          <button class="px-3 py-1 rounded-xl border bg-zinc-100">
            Сбросить к выбранному варианту
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Редактирование (планировщик) -->
  <div class="rounded-2xl border bg-white shadow-sm">
    <div class="p-4 border-b">
      <h3 class="flex items-center gap-2 text-xl font-semibold">
        <svg class="w-5 h-5" fill="none" stroke="currentColor"><path /></svg>
        Редактирование (планировщик)
      </h3>
    </div>
    <div class="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button class="rounded-2xl px-3 py-2 bg-zinc-900 text-white">Добавить модуль</button>
      <button class="rounded-2xl px-3 py-2 border">Удалить модуль</button>
      <button class="rounded-2xl px-3 py-2 border">Переместить</button>
      <button class="rounded-2xl px-3 py-2 border">Изменить размер</button>
    </div>
  </div>

  <!-- Внешний вид -->
  <div class="rounded-2xl border bg-white shadow-sm">
    <div class="p-4 border-b">
      <h3 class="flex items-center gap-2 text-xl font-semibold">
        <svg class="w-5 h-5" fill="none" stroke="currentColor"><path /></svg>
        Внешний вид
      </h3>
    </div>
    <div class="p-4 space-y-4">
      <!-- Цвет фасадов -->
      <div class="flex items-center gap-3">
        <label class="w-32">Фасады</label>
        <input type="color" value="#E8E6E3" class="h-10 w-16 rounded" />
        <select class="border rounded-lg px-2 py-1">
          <option>Глухие</option>
          <option>Со стеклом</option>
        </select>
      </div>

      <!-- Ручки -->
      <div class="flex items-center gap-3">
        <label class="w-32">Ручки</label>
        <select class="border rounded-lg px-2 py-1">
          <option>Модерн</option>
          <option>Классика</option>
        </select>
      </div>

      <!-- Столешница -->
      <div class="flex items-center gap-3">
        <label class="w-32">Столешница</label>
        <select class="border rounded-lg px-2 py-1">
          <option>Камень</option>
          <option>Дерево</option>
        </select>
      </div>

      <!-- Ножки -->
      <div class="flex items-center gap-3">
        <label class="w-32">Ножки</label>
        <select class="border rounded-lg px-2 py-1">
          <option>Скрытые</option>
          <option>Металлические</option>
        </select>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
 </script>