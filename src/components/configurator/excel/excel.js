import * as XLSX from 'xlsx';


export let rules = [];
export let rules1 = [];
export let rules2 = [];
export let rules3 = [];

export function excel(){
    fetch('/excel/Algorithm2.xlsx')
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const sheet1 = workbook.Sheets[workbook.SheetNames[1]];
    const sheet2 = workbook.Sheets[workbook.SheetNames[2]];
    const sheet3 = workbook.Sheets[workbook.SheetNames[3]];

    rules = XLSX.utils.sheet_to_json(sheet);
    rules1 = XLSX.utils.sheet_to_json(sheet);
    rules2 = XLSX.utils.sheet_to_json(sheet);
    rules3 = XLSX.utils.sheet_to_json(sheet);

 //   console.log(rules);
  });
}