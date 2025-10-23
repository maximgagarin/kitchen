import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";

export class Service {
  constructor() {
    this.kitchenSizesStore = useKitchenSizesStore();

    this.modulesToPlace = [
      { name: "oven", sizes: [0.45, 0.6] },
      { name: "dishWasher", sizes: [0.45, 0.6] },
    ];

    this.parts = [];
  }



  generatePlacements(modules, parts) {
    const results = [];

    const backtrack = (index, currentParts) => {
      if (index === modules.length) {
        results.push(JSON.parse(JSON.stringify(currentParts)));
        return;
      }

      const mod = modules[index];
      for (const part of currentParts) {
        const used = part.modules.reduce((a, b) => a + b.size, 0);
        if (used + mod.size <= part.width) {
          part.modules.push(mod);
          backtrack(index + 1, currentParts);
          part.modules.pop();
        }
      }
    };

    backtrack(
      0,
      parts.map(p => ({ ...p, modules: [] }))
    );

    return results;
  }

  analyzeAllCombinations(parts) {
    
    this.parts = parts
    

    const results = [];

    // 🔹 Собираем возможные наборы модулей: только oven, только dish, или оба
    const moduleSets = [
      ["oven"],
      ["dishWasher"],
      ["oven", "dishWasher"],
    ];

    for (const set of moduleSets) {
      // Перебираем размеры для каждого модуля в наборе
      const sizesMap = {};
      if (set.includes("oven")) sizesMap.oven = this.modulesToPlace[0].sizes;
      if (set.includes("dishWasher")) sizesMap.dishWasher = this.modulesToPlace[1].sizes;

      const ovenSizes = sizesMap.oven || [null];
      const dishSizes = sizesMap.dishWasher || [null];

      for (const ovenSize of ovenSizes) {
        for (const dishSize of dishSizes) {
          const modules = [];

          if (ovenSize) modules.push({ name: "oven", size: ovenSize });
          if (dishSize) modules.push({ name: "dishWasher", size: dishSize });

          const partsCopy = this.parts.map(p => ({ ...p, modules: [] }));
          let placements = this.generatePlacements(modules, partsCopy);

          // if (placements.length === 0) {
          //   placements = [this.tryPartialPlacement(modules, partsCopy)];
          // }

          results.push({
            set: set.join("+"),
            ovenSize,
            dishSize,
            variants: placements,
          });
        }
      }
    }

    this.printResults(results);
    return results;
  }
  tryPartialPlacement(modules, partsCopy) {
    for (const mod of modules) {
      for (const part of partsCopy) {
        const used = part.modules.reduce((a, b) => a + b.size, 0);
        if (used + mod.size <= part.width) {
          part.modules.push(mod);
          break;
        }
      }
    }
    return partsCopy;
  }

  printResults(results) {
    
    results.forEach(r => {
  //    console.log(`\n=== [${r.set}] oven=${r.ovenSize ?? "-"} | dish=${r.dishSize ?? "-"} ===`);
      r.variants.forEach((variant, i) => {
   //     console.log(`  Вариант ${i + 1}:`);
        variant.forEach(p => {
          const content = p.modules.map(m => `${m.name}(${m.size})`).join(", ") || "пусто";
     //     console.log(`    ${p.name}: ${content}`);
        });
      });
    });
  }


filtredOven(result , size){
    const filteredByOven = filtred.filter(r => r.ovenSize === size).map(r => ({
    ...r,
    variants: r.variants.filter(variant => 
      variant.some(part => part.modules.some(m => m.name === "oven"))
    )
  }))
  .filter(r => r.variants.length > 0) // оставляем только записи с валидными вариантами

 return filteredByOven
}

}