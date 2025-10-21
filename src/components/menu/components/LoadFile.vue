  <template>
  <div class="mt-6">
      <label class="block">
        <span class="sr-only">Загрузить файл</span>
        <input 
          type="file" 
          @change="handleFile"
          class="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </label>
      <p v-if="loading" class="mt-2 text-sm text-gray-600">Идёт загрузка...</p>
    </div>
  </template>
  <script setup>
  const loading = ref(false);
const sheets = ref(null);
function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    clearResultData();

    workbook.SheetNames.forEach((name) => {
      const sheet = workbook.Sheets[name];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const renamedRows = renameKeys(rows); // ← здесь переименование
      setResultData(name, renamedRows);
    });

    loading.value = false;
    ("Загруженные и переименованные листы:", resultData);
  };

  reader.readAsArrayBuffer(file);
}

function renameKeys(data) {
  return data.map(item => {
    const renamed = {};

    for (const key in item) {
      // Переименование ключей, если указано в карте
      const newKey = renameMap.hasOwnProperty(key) ? renameMap[key] : key;
      let value = item[key];

      // Округляем числовые значения
      if (typeof value === "number") {
        value = Number(value.toFixed(2));
      }

      renamed[newKey] = value;
    }

    // Обязательно добавляем __rowNum__, если есть
    if ('__rowNum__' in item) {
      renamed.rowNum = item.__rowNum__;
    }

    return renamed;
  });
}

const renameMap = {
  СД: "cd",
  СД_1: "cd_1",
  СД_2: "cd_2",


  Я1: "c1",
  Я1_1: "c1_1",

  Я2: "c2",
  Я2_1: "c2_1",
  Я2_2: "c2_2",

 

  Я3: "c3",
  Я3_1: "c3_1",

  
  ДХ: "d",
  ПМ: "p",
  
  П1:"P_1",
  П2:"P_2",
  П3:"P_3",
  П4:"P_4",
  П5:"P_5",
  П6:"P_6",
  П7:"P_7",
  П8:"P_8",
  П9:"P_9",
  П10:"P_10",

  

  



};
//__rowNum__
   </script>
