import * as XLSX from "xlsx";

export let resultData2level900 = {}

export function setResultData(name, sheetData) {
  resultData2level900[name] = sheetData
}

export function clearResultData() {
  for (const key in resultData2level900) {
    delete resultData2level900[key]
  }
}

export function excel2level() {
  fetch('/excel/2level900.xlsx')
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const workbook = XLSX.read(buffer, { type: 'array' });
      workbook.SheetNames.forEach((name) => {
        const sheet = workbook.Sheets[name];

        // Ограничение диапазона: A1:K1000 (или больше, если нужно)
        const range = XLSX.utils.decode_range("A1:J1500");
        sheet["!ref"] = XLSX.utils.encode_range(range);

        const rows = XLSX.utils.sheet_to_json(sheet, {
          defval: "", // чтобы пустые ячейки тоже попадали
        });

        const renamedRows = renameKeys(rows);
        setResultData(name, renamedRows);
     //   console.log("Загруженные и переименованные листы:", resultData2level900);
      });
    });
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
  П1: "P_1",
  П2: "P_2",
  П3: "P_3",
  П4: "P_4",
  П5: "P_5",
  П6: "P_6",
  П7: "P_7",
  П8: "P_8",
  П9: "P_9",
  П10: "P_10",
};