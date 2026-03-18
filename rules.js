window.techniqueRules = [
  {
    id: "protein_denaturation",
    label: "蛋白质变性",
    categoryId: "reshape_structure",
    directInputs: ["protein", "heatSensitiveProtein", "coagulableProtein", "muscleProtein"],
    functionalSupportInputs: [],
    directWeightRules: [
      "蛋白质、热敏感蛋白、可凝固蛋白、组成肌肉的蛋白任一成立时给予基础值",
      "热敏感蛋白、可凝固蛋白同时成立时继续上调",
      "蛋白质主类高上调，中轻上调，低下调"
    ],
    functionalSupportWeightRules: [],
    invalidBoundary: "仅有蛋白质主类、无具体蛋白子类支持时，不应高排具体蛋白路径。"
  },
  {
    id: "protein_hydrolysis",
    label: "蛋白质分解",
    categoryId: "soften_structure",
    directInputs: ["protein", "solubleProtein", "muscleProtein"],
    functionalSupportInputs: ["protease", "proteinHydrolysisPrecursor"],
    directWeightRules: [
      "蛋白质、可溶性蛋白、组成肌肉的蛋白任一成立时给予基础值",
      "可溶性蛋白、组成肌肉的蛋白同时成立时继续上调",
      "蛋白质主类高上调，中轻上调，低下调"
    ],
    functionalSupportWeightRules: [
      "蛋白酶、蛋白水解前体成立时上调"
    ],
    invalidBoundary: "仅有蛋白质主类、无具体蛋白子类支持时，不应高排具体蛋白路径。"
  },
  {
    id: "gelatin_conversion",
    label: "明胶转化",
    categoryId: "soften_structure",
    directInputs: ["collagen"],
    functionalSupportInputs: ["collagenSpecial", "water", "flexibleTexture"],
    directWeightRules: [
      "胶原蛋白成立时给予基础值",
      "胶原蛋白高明显上调，中上调，低轻下调"
    ],
    functionalSupportWeightRules: [
      "胶原蛋白天然凝胶物质板块、水、柔软有韧性成立时上调"
    ],
    invalidBoundary: "无胶原蛋白时，不显示明胶转化。"
  },
  {
    id: "collagen_softening",
    label: "胶原结构软化",
    categoryId: "soften_structure",
    directInputs: ["collagen"],
    functionalSupportInputs: ["water", "protease", "flexibleTexture"],
    directWeightRules: [
      "胶原蛋白成立时给予基础值",
      "胶原蛋白高明显上调，中上调，低轻下调"
    ],
    functionalSupportWeightRules: [
      "水、蛋白酶、柔软有韧性成立时上调"
    ],
    invalidBoundary: "无胶原蛋白时，不显示胶原结构软化。"
  },
  {
    id: "temperature_control_cooking",
    label: "控温烹饪",
    categoryId: "soften_structure",
    directInputs: ["heatSensitiveProtein"],
    functionalSupportInputs: ["coagulableProtein", "wheyProteinGel", "ovalbumin"],
    directWeightRules: [
      "热敏感蛋白成立时给予基础值",
      "热敏感蛋白高上调，中轻上调，低下调"
    ],
    functionalSupportWeightRules: [
      "可凝固蛋白、乳清蛋白、卵白蛋白成立时上调"
    ],
    invalidBoundary: "无热敏感蛋白时，不显示控温烹饪。"
  },
  {
    id: "muscle_fiber_softening",
    label: "蛋白纤维结构软化",
    categoryId: "soften_structure",
    directInputs: ["muscleProtein"],
    functionalSupportInputs: ["protease", "flexibleTexture", "collagen"],
    directWeightRules: [
      "组成肌肉的蛋白成立时给予基础值",
      "组成肌肉的蛋白高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "蛋白酶、柔软有韧性、胶原蛋白成立时上调"
    ],
    invalidBoundary: "无组成肌肉的蛋白时，不显示蛋白纤维结构软化。"
  },
  {
    id: "hard_structure_softening",
    label: "硬质结构软化",
    categoryId: "soften_structure",
    directInputs: ["hardTexture"],
    functionalSupportInputs: ["fiberGroup", "boundWater", "cellulase", "protease"],
    directWeightRules: [
      "坚硬成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "纤维类、结合水、纤维素酶、蛋白酶成立时上调"
    ],
    invalidBoundary: "无坚硬质地时，不显示硬质结构软化。"
  },
  {
    id: "texture_toughness_adjustment",
    label: "韧性结构调整",
    categoryId: "soften_structure",
    directInputs: ["flexibleTexture"],
    functionalSupportInputs: ["muscleProtein", "collagen"],
    directWeightRules: [
      "柔软有韧性成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "组成肌肉的蛋白、胶原蛋白成立时上调"
    ],
    invalidBoundary: "无柔软有韧性质地时，不显示韧性结构调整。"
  },
  {
    id: "fiber_breakdown",
    label: "纤维分解",
    categoryId: "soften_structure",
    directInputs: ["fiberGroup"],
    functionalSupportInputs: ["cellulase", "hardTexture"],
    directWeightRules: [
      "纤维类成立时给予基础值",
      "纤维类高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "纤维素酶、坚硬成立时上调"
    ],
    invalidBoundary: "无纤维类时，不显示纤维分解。"
  },
  {
    id: "cellulose_structure_breakdown",
    label: "纤维结构分解",
    categoryId: "soften_structure",
    directInputs: ["cellulase"],
    functionalSupportInputs: ["fiberGroup", "hardTexture"],
    directWeightRules: [
      "纤维素酶成立时给予基础值",
      "纤维素酶高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "纤维类、坚硬成立时上调"
    ],
    invalidBoundary: "无纤维素酶时，不显示纤维结构分解。"
  },
  {
    id: "pectin_structure_breakdown",
    label: "果胶结构分解",
    categoryId: "soften_structure",
    directInputs: ["pectinase"],
    functionalSupportInputs: ["pectinInSugar", "pectinGel", "pectinThickener", "acidicSubstances"],
    directWeightRules: [
      "果胶酶成立时给予基础值",
      "果胶酶高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "果胶相关来源、酸性物质成立时上调"
    ],
    invalidBoundary: "无果胶酶时，不显示果胶结构分解。"
  },
  {
    id: "protein_enzymolysis",
    label: "蛋白质酶解",
    categoryId: "soften_structure",
    directInputs: ["protease"],
    functionalSupportInputs: ["protein", "collagen", "muscleProtein", "solubleProtein"],
    directWeightRules: [
      "蛋白酶成立时给予基础值",
      "蛋白酶高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "蛋白质、胶原蛋白、组成肌肉的蛋白、可溶性蛋白成立时上调"
    ],
    invalidBoundary: "无蛋白酶时，不显示蛋白质酶解。"
  },
  {
    id: "acid_caused_structure_change",
    label: "酸导致结构变化",
    categoryId: "soften_structure",
    directInputs: ["acidicSubstances"],
    functionalSupportInputs: ["protein", "collagen", "pectinInSugar", "pectinGel", "fiberGroup"],
    directWeightRules: [
      "酸性物质成立时给予基础值",
      "酸性物质高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "蛋白质、胶原蛋白、果胶、纤维类成立时上调"
    ],
    invalidBoundary: "无酸性物质时，不显示酸导致结构变化。"
  },

  {
    id: "protein_crisp_sheet",
    label: "蛋白类脆片",
    categoryId: "crisp_texture",
    directInputs: ["collagen"],
    functionalSupportInputs: ["protein", "coagulableProtein", "dehydratedState", "crispyTexture"],
    directWeightRules: [
      "胶原蛋白成立时给予基础值",
      "胶原蛋白高明显上调，中上调，低轻下调"
    ],
    functionalSupportWeightRules: [
      "蛋白质、可凝固蛋白、脱水、脆成立时上调"
    ],
    invalidBoundary: "无胶原蛋白时，不显示蛋白类脆片。"
  },
  {
    id: "sugar_crystal_crisping",
    label: "糖结晶脆化",
    categoryId: "crisp_texture",
    directInputs: ["sweetSugar"],
    functionalSupportInputs: ["dehydratedState", "water", "crispyTexture"],
    directWeightRules: [
      "有甜味的糖成立时给予基础值",
      "有甜味的糖高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "脱水、水、脆成立时上调"
    ],
    invalidBoundary: "无有甜味的糖时，不显示糖结晶脆化。"
  },
  {
    id: "starch_crisp_structure",
    label: "淀粉类脆化结构",
    categoryId: "crisp_texture",
    directInputs: ["starchGroup"],
    functionalSupportInputs: ["water", "dehydratedState", "crispyTexture"],
    directWeightRules: [
      "淀粉类成立时给予基础值",
      "淀粉类高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "水、脱水、脆成立时上调"
    ],
    invalidBoundary: "无淀粉类时，不显示淀粉类脆化结构。"
  },
  {
    id: "gel_structure_crisping",
    label: "凝胶结构脆化",
    categoryId: "crisp_texture",
    directInputs: ["gelGroup"],
    functionalSupportInputs: ["strongGel", "dehydratedState", "crispyTexture"],
    directWeightRules: [
      "凝胶类成立时给予基础值",
      "凝胶类高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "强凝胶、脱水、脆成立时上调"
    ],
    invalidBoundary: "无凝胶类时，不显示凝胶结构脆化。"
  },
  {
    id: "gel_puffed_crisping",
    label: "凝胶膨化脆化",
    categoryId: "crisp_texture",
    directInputs: ["gelGroup"],
    functionalSupportInputs: ["strongGel", "water", "dehydratedState", "crispyTexture"],
    directWeightRules: [
      "凝胶类成立时给予基础值",
      "凝胶类高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "强凝胶、水、脱水、脆成立时上调"
    ],
    invalidBoundary: "无凝胶类时，不显示凝胶膨化脆化。"
  },
  {
    id: "shape_dry_puff",
    label: "形态干燥膨化",
    categoryId: "crisp_texture",
    directInputs: ["acceptShapeChange_yes"],
    functionalSupportInputs: ["dehydratedState", "protein", "starchGroup", "gelGroup", "collagen", "coagulableProtein", "viscousPolysaccharide", "fillableSpace_yes"],
    directWeightRules: [
      "是否接受形态改变选择是时给予基础值",
      "若同时存在对应物质基础，例如淀粉、凝胶类、可凝固蛋白、黏性多糖、内部可填充空间，则进一步上调",
      "若原料本身同时具备坚硬、柔软易碎、柔软有韧性、脆中的任一明确质地，则再轻度上调"
    ],
    functionalSupportWeightRules: [
      "脱水、蛋白质、淀粉类、凝胶类、胶原蛋白、可凝固蛋白、黏性多糖、内部可填充空间成立时上调"
    ],
    invalidBoundary: "未接受形态改变时，不显示形态干燥膨化。"
  },
  {
    id: "crisp_structure_keep_or_convert",
    label: "脆性结构保持或转化",
    categoryId: "crisp_texture",
    directInputs: ["crispyTexture"],
    functionalSupportInputs: ["dehydratedState", "water"],
    directWeightRules: [
      "脆成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脱水、水成立时上调"
    ],
    invalidBoundary: "无脆属性时，不显示脆性结构保持或转化。"
  },

  {
    id: "protein_gelation",
    label: "蛋白质凝胶化",
    categoryId: "reshape_structure",
    directInputs: ["solubleProtein", "coagulableProtein"],
    functionalSupportInputs: ["protein", "water"],
    directWeightRules: [
      "可溶性蛋白、可凝固蛋白任一成立时给予基础值",
      "两者同时成立时上调",
      "可溶性蛋白高上调，中上调，低下调",
      "可凝固蛋白高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "蛋白质主类、水成立时上调"
    ],
    invalidBoundary: "无可溶性蛋白且无可凝固蛋白时，不显示蛋白质凝胶化。"
  },
  {
    id: "protein_flocculation_separation",
    label: "蛋白质絮凝分离",
    categoryId: "reshape_structure",
    directInputs: ["solubleProtein"],
    functionalSupportInputs: ["water", "acidicSubstances", "protein"],
    directWeightRules: [
      "可溶性蛋白成立时给予基础值",
      "可溶性蛋白高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "水、酸性物质、蛋白质主类成立时上调"
    ],
    invalidBoundary: "无可溶性蛋白时，不显示蛋白质絮凝分离。"
  },
  {
    id: "protein_as_emulsifier",
    label: "蛋白质做乳化成分",
    categoryId: "reshape_structure",
    directInputs: ["solubleProtein"],
    functionalSupportInputs: ["fat", "water", "emulsifiedFat"],
    directWeightRules: [
      "可溶性蛋白成立时给予基础值",
      "可溶性蛋白高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "脂肪、水、处于乳化系统内的脂肪成立时上调"
    ],
    invalidBoundary: "无可溶性蛋白时，不显示蛋白质做乳化成分。"
  },
  {
    id: "thickening",
    label: "增稠",
    categoryId: "reshape_structure",
    directInputs: ["solubleProtein", "starchGroup", "easyGelatinizingStarch", "viscousPolysaccharide", "waterHoldingType"],
    functionalSupportInputs: ["pectinInSugar", "pectinThickener", "starchSpecial", "guarGum", "locustBeanGum", "seaweedPolysaccharide", "gumArabic", "glucomannan", "water", "fillableSpace_yes"],
    directWeightRules: [
      "可溶性蛋白、淀粉类、易糊化淀粉、黏性多糖、持水型任一成立时给予基础值",
      "多个直接来源同时成立时明显上调"
    ],
    functionalSupportWeightRules: [
      "果胶、天然增稠来源、水、内部可填充空间成立时上调"
    ],
    invalidBoundary: "无增稠来源时，不显示增稠。"
  },
  {
    id: "muscle_fiber_reorganization",
    label: "蛋白纤维结构重组",
    categoryId: "reshape_structure",
    directInputs: ["muscleProtein"],
    functionalSupportInputs: ["flexibleTexture", "acceptShapeChange_yes"],
    directWeightRules: [
      "组成肌肉的蛋白成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "柔软有韧性、接受形态改变成立时上调"
    ],
    invalidBoundary: "无组成肌肉的蛋白时，不显示蛋白纤维结构重组。"
  },
{
  id: "oil_phase_emulsification_participation",
  label: "油相乳化参与",
  categoryId: "reshape_structure",
  directInputs: ["emulsifiedFat"],
  functionalSupportInputs: ["fat", "water", "lecithin", "otherPhospholipids", "caseinSurface", "soyProteinSurface", "lipoproteinComplex", "wheyProteinSurface", "solubleProtein", "solidFat"],
  directWeightRules: [
    "处于乳化系统内的脂肪成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与表面活性物质、水共同出现时上调"
  ],
  invalidBoundary: "无油相基础时，不成立油相乳化参与。"
},
  {
    id: "solid_fat_phase_change",
    label: "固态脂肪形态转变",
    categoryId: "reshape_structure",
    directInputs: ["solidFat", "highMeltingFat", "lowMeltingFat"],
    functionalSupportInputs: ["fat"],
    directWeightRules: [
      "固态脂肪、高熔点脂肪、低熔点脂肪任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脂肪成立时轻度上调"
    ],
    invalidBoundary: "无固态脂肪相关基础时，不显示固态脂肪形态转变。"
  },
  {
    id: "fat_layer_structure_building",
    label: "脂肪层状结构构建",
    categoryId: "reshape_structure",
    directInputs: ["solidFat", "highMeltingFat"],
    functionalSupportInputs: ["acceptShapeChange_yes"],
    directWeightRules: [
      "固态脂肪或高熔点脂肪成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "接受形态改变成立时上调"
    ],
    invalidBoundary: "无固态脂肪或高熔点脂肪时，不显示脂肪层状结构构建。"
  },
 {
  id: "fat_whipping_foaming",
  label: "脂肪打发起泡",
  categoryId: "reshape_structure",
  directInputs: ["solidFat"],
  functionalSupportInputs: ["highMeltingFat", "lecithin", "otherPhospholipids", "wheyProteinSurface", "caseinSurface", "soyProteinSurface", "lipoproteinComplex"],
  directWeightRules: [
    "固态脂肪成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "若同时有高熔点脂肪、表面活性物质则上调"
  ],
  invalidBoundary: "无固态脂肪时，不成立脂肪打发起泡。"
},
  {
    id: "starch_gelatinization",
    label: "淀粉凝胶化",
    categoryId: "reshape_structure",
    directInputs: ["starchGroup", "easyGelatinizingStarch", "elasticStarch"],
    functionalSupportInputs: ["water"],
    directWeightRules: [
      "淀粉类、易糊化淀粉、弹性淀粉任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水成立时上调"
    ],
    invalidBoundary: "无淀粉类基础时，不显示淀粉凝胶化。"
  },
  {
    id: "starch_thickening",
    label: "淀粉增稠",
    categoryId: "reshape_structure",
    directInputs: ["starchGroup", "easyGelatinizingStarch", "starchSpecial"],
    functionalSupportInputs: ["water", "fillableSpace_yes"],
    directWeightRules: [
      "淀粉类相关来源成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、内部可填充空间成立时上调"
    ],
    invalidBoundary: "无淀粉类来源时，不显示淀粉增稠。"
  },
  {
    id: "starch_retrogradation_structure_formation",
    label: "淀粉回生结构形成",
    categoryId: "reshape_structure",
    directInputs: ["starchGroup", "elasticStarch"],
    functionalSupportInputs: ["water", "acceptShapeChange_yes"],
    directWeightRules: [
      "淀粉类或弹性淀粉成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、接受形态改变成立时上调"
    ],
    invalidBoundary: "无淀粉类基础时，不显示淀粉回生结构形成。"
  },
  {
  id: "gel_formation",
  label: "凝胶形成",
  categoryId: "reshape_structure",
  directInputs: ["gelGroup", "strongGel", "pectinInSugar"],
  functionalSupportInputs: ["pectinGel", "gelatin", "agar", "carrageenan", "alginate", "konjacGlucomannan", "seaweedPolysaccharide"],
  directWeightRules: [
    "凝胶类、强凝胶、果胶任一成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与天然凝胶来源共同出现时上调"
  ],
  invalidBoundary: "无凝胶类时，不成立凝胶形成；无果胶时，不成立果胶相关凝胶路径。"
},
  {
    id: "fiber_structure_firming",
    label: "纤维结构固化",
    categoryId: "reshape_structure",
    directInputs: ["fiberGroup"],
    functionalSupportInputs: ["dehydratedState", "hardTexture"],
    directWeightRules: [
      "纤维类成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脱水、坚硬成立时上调"
    ],
    invalidBoundary: "无纤维类时，不显示纤维结构固化。"
  },
  {
    id: "fiber_thickening",
    label: "使用纤维增稠",
    categoryId: "reshape_structure",
    directInputs: ["fiberGroup"],
    functionalSupportInputs: ["water", "fillableSpace_yes"],
    directWeightRules: [
      "纤维类成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、内部可填充空间成立时上调"
    ],
    invalidBoundary: "无纤维类时，不显示使用纤维增稠。"
  },
  {
    id: "polyphenol_binding_firming",
    label: "多酚结合固化",
    categoryId: "reshape_structure",
    directInputs: ["fiberGroup"],
    functionalSupportInputs: ["polyphenolMonomer", "tannin"],
    directWeightRules: [
      "纤维类成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "多酚类单体、单宁类物质成立时上调"
    ],
    invalidBoundary: "无纤维类时，不显示多酚结合固化。"
  },
  {
    id: "acid_or_enzyme_coagulation",
    label: "酸或酶凝固",
    categoryId: "reshape_structure",
    directInputs: ["acidicSubstances"],
    functionalSupportInputs: ["pectinGel", "caseinGel", "soyProteinGel", "pectinase"],
    directWeightRules: [
      "酸性物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "果胶、酪蛋白、大豆蛋白、果胶酶成立时上调"
    ],
    invalidBoundary: "无酸性物质且无酶凝条件时，不显示酸或酶凝固。"
  },
  {
    id: "heat_coagulation",
    label: "热凝固",
    categoryId: "reshape_structure",
    directInputs: ["heatSensitiveProtein", "coagulableProtein"],
    functionalSupportInputs: ["wheyProteinGel", "ovalbumin", "eggWhiteProtein", "wheyProteinSurface"],
    directWeightRules: [
      "热敏感蛋白或可凝固蛋白成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "乳清蛋白、卵白蛋白、蛋清蛋白成立时上调"
    ],
    invalidBoundary: "无热敏感蛋白和可凝固蛋白时，不显示热凝固。"
  },
  {
    id: "cooling_gel_formation",
    label: "冷却凝胶形成",
    categoryId: "reshape_structure",
    directInputs: ["gelatin", "agar", "carrageenan"],
    functionalSupportInputs: ["gelGroup", "strongGel"],
    directWeightRules: [
      "明胶、琼脂、卡拉胶任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "凝胶类、强凝胶成立时上调"
    ],
    invalidBoundary: "无热溶冷凝来源时，不显示冷却凝胶形成。"
  },
  {
    id: "ion_induced_gel_formation",
    label: "离子诱导凝胶形成",
    categoryId: "reshape_structure",
    directInputs: ["alginate"],
    functionalSupportInputs: ["gelGroup", "strongGel"],
    directWeightRules: [
      "海藻酸盐成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "凝胶类、强凝胶成立时上调"
    ],
    invalidBoundary: "无海藻酸盐时，不显示离子诱导凝胶形成。"
  },
  {
    id: "alkali_induced_gel_formation",
    label: "碱诱导凝胶形成",
    categoryId: "reshape_structure",
    directInputs: ["konjacGlucomannan"],
    functionalSupportInputs: ["gelGroup", "strongGel"],
    directWeightRules: [
      "魔芋葡甘聚糖成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "凝胶类、强凝胶成立时上调"
    ],
    invalidBoundary: "无魔芋葡甘聚糖时，不显示碱诱导凝胶形成。"
  },
  {
    id: "collagen_gel_formation",
    label: "胶原凝胶形成",
    categoryId: "reshape_structure",
    directInputs: ["collagenSpecial", "collagen"],
    functionalSupportInputs: ["water"],
    directWeightRules: [
      "胶原蛋白天然凝胶来源或胶原蛋白成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水成立时上调"
    ],
    invalidBoundary: "无胶原蛋白时，不显示胶原凝胶形成。"
  },
  {
    id: "seed_polysaccharide_thickening",
    label: "种子多糖增稠",
    categoryId: "reshape_structure",
    directInputs: ["guarGum", "locustBeanGum"],
    functionalSupportInputs: ["water", "fillableSpace_yes"],
    directWeightRules: [
      "瓜尔胶、刺槐豆胶任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、内部可填充空间成立时上调"
    ],
    invalidBoundary: "无种子多糖来源时，不显示种子多糖增稠。"
  },
  {
    id: "seaweed_polysaccharide_thickening",
    label: "海藻多糖增稠",
    categoryId: "reshape_structure",
    directInputs: ["seaweedPolysaccharide"],
    functionalSupportInputs: ["water", "gelGroup", "fillableSpace_yes"],
    directWeightRules: [
      "海藻多糖成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、凝胶类、内部可填充空间成立时上调"
    ],
    invalidBoundary: "无海藻多糖时，不显示海藻多糖增稠。"
  },
  {
    id: "plant_polysaccharide_thickening",
    label: "植物多糖增稠",
    categoryId: "reshape_structure",
    directInputs: ["gumArabic", "glucomannan"],
    functionalSupportInputs: ["water", "fillableSpace_yes"],
    directWeightRules: [
      "阿拉伯胶、葡甘露聚糖任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、内部可填充空间成立时上调"
    ],
    invalidBoundary: "无植物多糖来源时，不显示植物多糖增稠。"
  },
  {
    id: "pectin_thickening",
    label: "果胶增稠",
    categoryId: "reshape_structure",
    directInputs: ["pectinThickener", "pectinInSugar"],
    functionalSupportInputs: ["water", "fillableSpace_yes"],
    directWeightRules: [
      "果胶类增稠来源成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、内部可填充空间成立时上调"
    ],
    invalidBoundary: "无果胶来源时，不显示果胶增稠。"
  },
  {
    id: "water_holding_thickening",
    label: "持水增稠作用",
    categoryId: "reshape_structure",
    directInputs: ["waterHoldingType"],
    functionalSupportInputs: ["water", "viscousPolysaccharide"],
    directWeightRules: [
      "持水型成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、黏性多糖成立时上调"
    ],
    invalidBoundary: "无持水型时，不显示持水增稠作用。"
  },
  {
    id: "fragile_structure_stabilization",
    label: "碎散结构稳定",
    categoryId: "reshape_structure",
    directInputs: ["fragileTexture"],
    functionalSupportInputs: ["gelGroup", "viscousPolysaccharide", "coagulableProtein", "starchGroup"],
    directWeightRules: [
      "柔软易碎成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "凝胶类、黏性多糖、可凝固蛋白、淀粉类成立时上调"
    ],
    invalidBoundary: "无柔软易碎质地时，不显示碎散结构稳定。"
  },
  {
    id: "internal_space_filling",
    label: "内部空间填充",
    categoryId: "reshape_structure",
    directInputs: ["fillableSpace_yes"],
    functionalSupportInputs: ["viscousPolysaccharide", "strongGel", "pectinThickener", "starchSpecial", "emulsifiedFat", "water"],
    directWeightRules: [
      "内部有可以填充和灌注的空间选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "增稠、凝胶、乳化、水成立时上调"
    ],
    invalidBoundary: "无内部空间时，不显示内部空间填充。"
  },
  {
    id: "shape_cut_reorganization",
    label: "形态切分重组",
    categoryId: "reshape_structure",
    directInputs: ["acceptShapeChange_yes"],
    functionalSupportInputs: ["hardTexture", "fragileTexture", "flexibleTexture", "muscleProtein", "fiberGroup"],
    directWeightRules: [
      "接受形态改变选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "质地阻力来源、蛋白、纤维类成立时上调"
    ],
    invalidBoundary: "未接受形态改变时，不显示形态切分重组。"
  },
  {
    id: "shape_grinding_refinement",
    label: "形态研磨细化",
    categoryId: "reshape_structure",
    directInputs: ["acceptShapeChange_yes"],
    functionalSupportInputs: ["hardTexture", "fiberGroup", "starchGroup"],
    directWeightRules: [
      "接受形态改变选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "坚硬、纤维类、淀粉类成立时上调"
    ],
    invalidBoundary: "未接受形态改变时，不显示形态研磨细化。"
  },
  {
    id: "shape_press_setting",
    label: "形态压制定型",
    categoryId: "reshape_structure",
    directInputs: ["acceptShapeChange_yes"],
    functionalSupportInputs: ["coagulableProtein", "strongGel", "starchGroup", "viscousPolysaccharide"],
    directWeightRules: [
      "接受形态改变选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "可凝固蛋白、强凝胶、淀粉类、黏性多糖成立时上调"
    ],
    invalidBoundary: "未接受形态改变时，不显示形态压制定型。"
  },
  {
    id: "shape_binding_reorganization",
    label: "形态黏结重组",
    categoryId: "reshape_structure",
    directInputs: ["acceptShapeChange_yes"],
    functionalSupportInputs: ["muscleProtein", "coagulableProtein", "starchGroup", "viscousPolysaccharide", "gelGroup"],
    directWeightRules: [
      "接受形态改变选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "蛋白、淀粉、黏性多糖、凝胶类成立时上调"
    ],
    invalidBoundary: "未接受形态改变时，不显示形态黏结重组。"
  },
  {
    id: "shape_fill_wrap",
    label: "形态填充包裹",
    categoryId: "reshape_structure",
    directInputs: ["acceptShapeChange_yes", "fillableSpace_yes"],
    functionalSupportInputs: ["strongGel", "viscousPolysaccharide", "emulsifiedFat"],
    directWeightRules: [
      "接受形态改变与内部空间同时成立时给予更高基础值"
    ],
    functionalSupportWeightRules: [
      "强凝胶、黏性多糖、乳化油相成立时上调"
    ],
    invalidBoundary: "未接受形态改变时，不显示形态填充包裹。"
  },
  {
    id: "shape_coagulation_setting",
    label: "形态凝固定型",
    categoryId: "reshape_structure",
    directInputs: ["acceptShapeChange_yes"],
    functionalSupportInputs: ["coagulableProtein", "gelGroup", "strongGel", "starchGroup"],
    directWeightRules: [
      "接受形态改变选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "可凝固蛋白、凝胶类、强凝胶、淀粉类成立时上调"
    ],
    invalidBoundary: "未接受形态改变时，不显示形态凝固定型。"
  },
  {
    id: "raw_water_increase",
    label: "原料水分增加",
    categoryId: "reshape_structure",
    directInputs: ["water"],
    functionalSupportInputs: ["boundWater"],
    directWeightRules: [
      "水成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "结合水成立时轻度上调"
    ],
    invalidBoundary: "无水时，不显示原料水分增加。"
  },
  {
    id: "raw_water_reduction",
    label: "原料水分减少",
    categoryId: "reshape_structure",
    directInputs: ["water", "freeWater", "dehydratedState"],
    functionalSupportInputs: ["crispyTexture"],
    directWeightRules: [
      "水、游离水、脱水任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脆成立时轻度上调"
    ],
    invalidBoundary: "无水相相关基础时，不显示原料水分减少。"
  },
  {
    id: "osmosis_exchange",
    label: "渗透交换",
    categoryId: "reshape_structure",
    directInputs: ["water"],
    functionalSupportInputs: ["acidicSubstances", "sweetSugar", "nonSweetSugar", "freeWater"],
    directWeightRules: [
      "水成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "酸、糖、游离水成立时上调"
    ],
    invalidBoundary: "无水时，不显示渗透交换。"
  },
  {
  id: "emulsion_system_formation",
  label: "乳化体系形成",
  categoryId: "reshape_structure",
  directInputs: ["emulsifiedFat"],
  functionalSupportInputs: ["fat", "water", "protein", "solubleProtein", "lecithin", "otherPhospholipids", "caseinSurface", "soyProteinSurface", "lipoproteinComplex", "wheyProteinSurface"],
  directWeightRules: [
    "处于乳化系统内的脂肪成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与表面活性物质、水共同出现时上调"
  ],
  invalidBoundary: "无油相基础时，不成立乳化体系形成。"
},
  {
    id: "foam_structure_formation",
    label: "泡沫结构形成",
    categoryId: "reshape_structure",
    directInputs: [],
    functionalSupportInputs: ["eggWhiteProtein", "saponin", "legumeProtein", "grainProtein", "wheyProteinSurface", "water"],
    directWeightRules: [],
    functionalSupportWeightRules: [
      "起泡蛋白或皂苷成立时上调",
      "与水共同出现时继续上调"
    ],
    invalidBoundary: "无起泡支持成分时，不显示泡沫结构形成。"
  },
  {
    id: "emulsify_and_foam",
  label: "乳化与起泡",
  categoryId: "reshape_structure",
  directInputs: [],
  functionalSupportInputs: ["solubleProtein", "wheyProteinSurface", "eggWhiteProtein", "saponin", "lecithin", "otherPhospholipids", "fat", "water", "emulsifiedFat", "solidFat"],
  directWeightRules: [],
  functionalSupportWeightRules: [
    "双功能表面活性来源成立时上调",
    "油水或气液界面条件补充成立时继续上调"
  ],
  invalidBoundary: "无双功能表面活性来源时，不显示乳化与起泡。"
  },

  {
    id: "fat_separation",
    label: "脂肪分离",
    categoryId: "extract_components",
    directInputs: ["fat"],
    functionalSupportInputs: ["extractableLiquid_yes", "flavorFat"],
    directWeightRules: [
      "脂肪成立时给予基础值",
      "脂肪高明显上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "有可提取液体、风味脂肪成立时上调"
    ],
    invalidBoundary: "无脂肪时，不显示脂肪分离。"
  },
 {
  id: "oil_phase_flavor_extraction",
  label: "油相风味提取",
  categoryId: "extract_components",
  directInputs: ["liquidFat"],
  functionalSupportInputs: ["fat", "fatSolubleAroma", "flavorFat", "extractableLiquid_yes"],
  directWeightRules: [
    "液态脂肪成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "若同时有脂溶性香气、风味脂肪、是否有可以提取的液体则上调"
  ],
  invalidBoundary: "无液态脂肪时，不应高排油相风味提取。"
},
{
  id: "oil_phase_flavor_conduction",
  label: "油相风味传导",
  categoryId: "extract_components",
  directInputs: ["liquidFat"],
  functionalSupportInputs: ["fat", "fatSolubleAroma", "flavorFat", "lowMeltingFat"],
  directWeightRules: [
    "液态脂肪成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "若同时有脂溶性香气、风味脂肪则上调"
  ],
  invalidBoundary: "无液态脂肪时，不应高排油相风味传导。"
},
  {
  id: "aroma_component_extraction",
  label: "香气成分提取",
  categoryId: "extract_components",
  directInputs: ["aroma"],
  functionalSupportInputs: ["directAroma", "fatSolubleAroma", "waterSolubleAroma", "extractableLiquid_yes", "water", "fat"],
  directWeightRules: [
    "香气物质成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与脂肪、水、可提取液体共同出现时上调"
  ],
  invalidBoundary: "无香气物质时，不成立香气成分提取。"
},
  {
  id: "aroma_component_transfer",
  label: "香气成分转移",
  categoryId: "extract_components",
  directInputs: ["aroma"],
  functionalSupportInputs: ["directAroma", "fatSolubleAroma", "waterSolubleAroma", "water", "fat", "extractableLiquid_yes"],
  directWeightRules: [
    "香气物质成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与脂肪、水、可提取液体共同出现时上调"
  ],
  invalidBoundary: "无香气物质时，不成立香气成分转移。"
},
  {
    id: "oil_phase_aroma_extraction",
    label: "油相香气提取",
    categoryId: "extract_components",
    directInputs: ["fatSolubleAroma"],
    functionalSupportInputs: ["fat", "liquidFat", "flavorFat"],
    directWeightRules: [
      "脂溶性香气成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脂肪、液态脂肪、风味脂肪成立时上调"
    ],
    invalidBoundary: "无脂溶性香气时，不显示油相香气提取。"
  },
  {
    id: "water_phase_aroma_extraction",
    label: "水相香气提取",
    categoryId: "extract_components",
    directInputs: ["waterSolubleAroma"],
    functionalSupportInputs: ["water", "freeWater", "extractableLiquid_yes"],
    directWeightRules: [
      "水溶性香气成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、游离水、有可提取液体成立时上调"
    ],
    invalidBoundary: "无水溶性香气时，不显示水相香气提取。"
  },
  {
    id: "water_separation",
    label: "水分分离",
    categoryId: "extract_components",
    directInputs: ["water", "freeWater"],
    functionalSupportInputs: ["extractableLiquid_yes"],
    directWeightRules: [
      "水或游离水成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "有可提取液体成立时上调"
    ],
    invalidBoundary: "无水和游离水时，不显示水分分离。"
  },
  {
    id: "raw_water_concentration",
    label: "原料水分浓缩",
    categoryId: "extract_components",
    directInputs: ["water"],
    functionalSupportInputs: ["freeWater", "obviousTaste_yes"],
    directWeightRules: [
      "水成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "游离水、明显味道成立时上调"
    ],
    invalidBoundary: "无水时，不显示原料水分浓缩。"
  },
  {
    id: "water_phase_taste_injection",
    label: "水相味道注入",
    categoryId: "extract_components",
    directInputs: ["water"],
    functionalSupportInputs: ["obviousTaste_yes", "waterSolubleAroma"],
    directWeightRules: [
      "水成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "明显味道、水溶性香气成立时上调"
    ],
    invalidBoundary: "无水时，不显示水相味道注入。"
  },
  {
    id: "extractable_liquid_separation",
    label: "可提取液体分离",
    categoryId: "extract_components",
    directInputs: ["extractableLiquid_yes"],
    functionalSupportInputs: ["water", "fat", "freeWater"],
    directWeightRules: [
      "有可以提取的液体选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、脂肪、游离水成立时上调"
    ],
    invalidBoundary: "无可提取液体时，不显示可提取液体分离。"
  },
  {
    id: "liquid_component_clarification",
    label: "液体成分澄清",
    categoryId: "extract_components",
    directInputs: ["extractableLiquid_yes"],
    functionalSupportInputs: ["water", "fat", "solubleProtein"],
    directWeightRules: [
      "有可以提取的液体选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、脂肪、可溶性蛋白成立时上调"
    ],
    invalidBoundary: "无可提取液体时，不显示液体成分澄清。"
  },
  {
    id: "taste_component_extraction",
    label: "味道成分提取",
    categoryId: "extract_components",
    directInputs: ["obviousTaste_yes"],
    functionalSupportInputs: ["water", "freeWater", "extractableLiquid_yes", "waterSolubleAroma"],
    directWeightRules: [
      "有明显味道选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、游离水、可提取液体、水溶性香气成立时上调"
    ],
    invalidBoundary: "无明显味道时，不显示味道成分提取。"
  },
  {
    id: "taste_component_transfer",
    label: "味道成分转移",
    categoryId: "extract_components",
    directInputs: ["obviousTaste_yes"],
    functionalSupportInputs: ["water", "fat", "sulfides", "capsaicin"],
    directWeightRules: [
      "有明显味道选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、脂肪、硫化物、辣椒素类物质成立时上调"
    ],
    invalidBoundary: "无明显味道时，不显示味道成分转移。"
  },
  {
    id: "taste_component_concentration",
    label: "味道成分浓缩",
    categoryId: "extract_components",
    directInputs: ["obviousTaste_yes"],
    functionalSupportInputs: ["water", "extractableLiquid_yes", "dehydratedState"],
    directWeightRules: [
      "有明显味道选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、可提取液体、脱水成立时上调"
    ],
    invalidBoundary: "无明显味道时，不显示味道成分浓缩。"
  },
  {
    id: "taste_component_reduction",
    label: "味道成分减淡",
    categoryId: "extract_components",
    directInputs: ["obviousTaste_yes"],
    functionalSupportInputs: ["water", "freeWater"],
    directWeightRules: [
      "有明显味道选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、游离水成立时上调"
    ],
    invalidBoundary: "无明显味道时，不显示味道成分减淡。"
  },
  {
    id: "structure_break_water_release",
    label: "结构破坏释水",
    categoryId: "extract_components",
    directInputs: ["boundWater"],
    functionalSupportInputs: ["hardTexture", "fiberGroup"],
    directWeightRules: [
      "结合水成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "坚硬、纤维类成立时上调"
    ],
    invalidBoundary: "无结合水时，不显示结构破坏释水。"
  },
 {
  id: "color_exchange",
  label: "色彩交换",
  categoryId: "extract_components",
  directInputs: ["pigment", "heatStablePigment", "waterSolublePigment", "fatSolublePigment"],
  functionalSupportInputs: ["heatSensitivePigment", "phSensitivePigment", "labilePigment", "water", "fat", "extractableLiquid_yes", "acidicSubstances"],
  directWeightRules: [
    "色素、热稳定色素、水溶性色素、脂溶性色素任一成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与可提取液体、酸性物质、热敏色素或pH敏感色素共同出现时上调"
  ],
  invalidBoundary: "无色素时，不成立色彩交换。"
},
  {
    id: "water_phase_pigment_extraction",
    label: "水相色素提取",
    categoryId: "extract_components",
    directInputs: ["waterSolublePigment"],
    functionalSupportInputs: ["water", "freeWater", "extractableLiquid_yes"],
    directWeightRules: [
      "水溶性色素成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、游离水、可提取液体成立时上调"
    ],
    invalidBoundary: "无水溶性色素时，不显示水相色素提取。"
  },
  {
    id: "oil_phase_pigment_extraction",
    label: "油相色素提取",
    categoryId: "extract_components",
    directInputs: ["fatSolublePigment"],
    functionalSupportInputs: ["fat", "liquidFat", "extractableLiquid_yes"],
    directWeightRules: [
      "脂溶性色素成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脂肪、液态脂肪、可提取液体成立时上调"
    ],
    invalidBoundary: "无脂溶性色素时，不显示油相色素提取。"
  },

  {
  id: "fat_soluble_flavor_infusion",
  label: "脂溶性风味注入",
  categoryId: "build_flavor",
  directInputs: ["fat", "liquidFat", "lowMeltingFat", "flavorFat"],
  functionalSupportInputs: ["fatSolubleAroma", "obviousTaste_yes", "capsaicin"],
  directWeightRules: [
    "脂肪、液态脂肪、低熔点脂肪、风味脂肪任一成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "脂溶性香气、明显味道成立时上调；辣椒素类物质与脂肪共同出现时功能支持上调"
  ],
  invalidBoundary: "无脂肪基础时，不成立脂溶性风味注入。"
},
  {
    id: "sweetness_adjustment",
    label: "甜味调节",
    categoryId: "build_flavor",
    directInputs: ["sweetSugar"],
    functionalSupportInputs: [],
    directWeightRules: [
      "有甜味的糖成立时给予基础值"
    ],
    functionalSupportWeightRules: [],
    invalidBoundary: "无有甜味的糖时，不显示甜味调节。"
  },
  {
    id: "simple_sugar_fermentation_substrate",
    label: "发酵底物-简单糖",
    categoryId: "build_flavor",
    directInputs: ["sweetSugar"],
    functionalSupportInputs: ["nonSweetSugar"],
    directWeightRules: [
      "有甜味的糖成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "无甜味的糖成立时轻度上调"
    ],
    invalidBoundary: "无有甜味的糖时，不显示发酵底物-简单糖。"
  },
  {
    id: "sugar_concentration",
    label: "糖分浓缩",
    categoryId: "build_flavor",
    directInputs: ["sweetSugar"],
    functionalSupportInputs: ["water", "dehydratedState"],
    directWeightRules: [
      "有甜味的糖成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、脱水成立时上调"
    ],
    invalidBoundary: "无有甜味的糖时，不显示糖分浓缩。"
  },
  {
    id: "caramelization_reaction",
    label: "焦糖化反应",
    categoryId: "build_flavor",
    directInputs: ["sweetSugar", "reducingSugar"],
    functionalSupportInputs: ["heatSensitivePigment"],
    directWeightRules: [
      "糖类基础成立时给予基础值",
      "还原糖同时成立时上调"
    ],
    functionalSupportWeightRules: [
      "热敏色素仅作附带支持"
    ],
    invalidBoundary: "无糖类基础时，不显示焦糖化反应。"
  },
  {
    id: "maillard_reaction",
    label: "美拉德反应",
    categoryId: "build_flavor",
    directInputs: ["reducingSugar", "freeAminoAcid", "smallPeptide"],
    functionalSupportInputs: ["protein", "sweetSugar"],
    directWeightRules: [
      "还原糖与氨基侧前体成立时给予基础值",
      "两侧前体同时成立时明显上调"
    ],
    functionalSupportWeightRules: [
      "蛋白质、有甜味的糖成立时轻度上调"
    ],
    invalidBoundary: "无还原糖或无氨基侧前体时，不显示美拉德反应。"
  },
  {
    id: "direct_aroma_release",
    label: "直接释香",
    categoryId: "build_flavor",
    directInputs: ["directAroma"],
    functionalSupportInputs: ["aroma", "fat", "water"],
    directWeightRules: [
      "直接香气物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "香气物质、水、脂肪成立时上调"
    ],
    invalidBoundary: "无直接香气物质时，不显示直接释香。"
  },
  {
    id: "structure_break_aroma_release",
    label: "结构破坏释香",
    categoryId: "build_flavor",
    directInputs: ["enzymaticAroma"],
    functionalSupportInputs: ["enzyme", "aromaPrecursor"],
    directWeightRules: [
      "酶促反应生成香气成立时给予基础值",
      "高上调，中上调，低下调"
    ],
    functionalSupportWeightRules: [
      "与酶、前体共同出现时上调"
    ],
    invalidBoundary: "无该类香气来源时，不应高排结构破坏释香。"
  },
  {
    id: "reaction_condition_aroma_release",
    label: "反应条件释香",
    categoryId: "build_flavor",
    directInputs: ["aromaPrecursor"],
    functionalSupportInputs: ["glycosidicAroma", "boundAromaPrecursor", "fattyAcidEsterPrecursor", "proteinHydrolysisPrecursor", "acidicSubstances"],
    directWeightRules: [
      "香气前体成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "各类前体与酸性物质成立时上调"
    ],
    invalidBoundary: "无香气前体时，不显示反应条件释香。"
  },
  {
    id: "fat_oxidation_reaction",
    label: "脂肪氧化反应",
    categoryId: "build_flavor",
    directInputs: ["oxidizableFat", "flavorFat", "lipase"],
    functionalSupportInputs: ["fat"],
    directWeightRules: [
      "易氧化脂肪、风味脂肪、脂肪酶任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脂肪成立时轻度上调"
    ],
    invalidBoundary: "无易氧化脂肪相关基础时，不显示脂肪氧化反应。"
  },
  {
    id: "heat_triggered_flavor_generation",
    label: "加热触发风味生成",
    categoryId: "build_flavor",
    directInputs: ["reducingSugar", "freeAminoAcid", "nucleotide", "smallPeptide"],
    functionalSupportInputs: ["protein", "sweetSugar"],
    directWeightRules: [
      "任一加热反应前体成立时给予基础值",
      "还原糖与氨基侧前体同时成立时上调"
    ],
    functionalSupportWeightRules: [
      "蛋白质、有甜味的糖成立时轻度上调"
    ],
    invalidBoundary: "无加热反应前体时，不显示加热触发风味生成。"
  },
  {
    id: "oxidation_triggered_flavor_generation",
    label: "氧化触发风味生成",
    categoryId: "build_flavor",
    directInputs: ["polyphenolMonomer", "catechin", "catecholSubstrate"],
    functionalSupportInputs: ["polyphenolOxidase"],
    directWeightRules: [
      "氧化型前体成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "多酚氧化酶成立时上调"
    ],
    invalidBoundary: "无氧化型前体时，不显示氧化触发风味生成。"
  },
  {
    id: "enzymatic_release_flavor",
    label: "酶解释放风味",
    categoryId: "build_flavor",
    directInputs: ["glycosidicAroma", "boundAromaPrecursor", "fattyAcidEsterPrecursor", "proteinHydrolysisPrecursor"],
    functionalSupportInputs: ["protease", "amylase", "lipase", "otherEnzyme"],
    directWeightRules: [
      "发酵/酶解释放型前体成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "相关酶成立时上调"
    ],
    invalidBoundary: "无释放型前体时，不显示酶解释放风味。"
  },
  {
    id: "enzymatic_browning",
    label: "酶促褐变",
    categoryId: "build_flavor",
    directInputs: ["polyphenolOxidase"],
    functionalSupportInputs: ["polyphenolMonomer", "catechin", "catecholSubstrate"],
    directWeightRules: [
      "多酚氧化酶成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "多酚类底物成立时上调"
    ],
    invalidBoundary: "无多酚氧化酶时，不显示酶促褐变。"
  },
  {
    id: "enzymatic_transformation",
    label: "酶促转化",
    categoryId: "build_flavor",
    directInputs: ["otherEnzyme", "enzyme"],
    functionalSupportInputs: ["aromaPrecursor", "proteinHydrolysisPrecursor", "fattyAcidEsterPrecursor"],
    directWeightRules: [
      "酶或其他酶成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "前体成立时上调"
    ],
    invalidBoundary: "无酶基础时，不显示酶促转化。"
  },
  {
    id: "sourness_injection",
    label: "酸味注入",
    categoryId: "build_flavor",
    directInputs: ["acidicSubstances"],
    functionalSupportInputs: ["obviousTaste_yes", "heatSensitiveAcid", "volatileAcid", "nonVolatileAcid", "water"],
    directWeightRules: [
      "酸性物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "明显味道、热敏酸、挥发酸、不挥发酸、水成立时上调"
    ],
    invalidBoundary: "无酸性物质时，不显示酸味注入。"
  },
  {
    id: "pungent_stimulus_formation",
    label: "辛辣刺激形成",
    categoryId: "build_flavor",
    directInputs: ["capsaicin", "mustardCompounds", "sulfides", "gingerol"],
    functionalSupportInputs: ["fat", "obviousTaste_yes"],
    directWeightRules: [
      "刺激类物质任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脂肪、明显味道成立时上调"
    ],
    invalidBoundary: "无刺激类物质时，不显示辛辣刺激形成。"
  },
  {
    id: "tingling_sensation_formation",
    label: "麻感形成",
    categoryId: "build_flavor",
    directInputs: ["sanshool"],
    functionalSupportInputs: [],
    directWeightRules: [
      "山椒酰胺类物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [],
    invalidBoundary: "无山椒酰胺类物质时，不显示麻感形成。"
  },
  {
    id: "cooling_sensation_formation",
    label: "清凉感形成",
    categoryId: "build_flavor",
    directInputs: ["menthol"],
    functionalSupportInputs: [],
    directWeightRules: [
      "薄荷醇类物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [],
    invalidBoundary: "无薄荷醇类物质时，不显示清凉感形成。"
  },
  {
    id: "astringency_formation",
    label: "收敛感形成",
    categoryId: "build_flavor",
    directInputs: ["polyphenolMonomer", "tannin"],
    functionalSupportInputs: [],
    directWeightRules: [
      "多酚类单体或单宁类物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [],
    invalidBoundary: "无多酚类单体和单宁类物质时，不显示收敛感形成。"
  },
  {
    id: "bitterness_formation",
    label: "苦味形成",
    categoryId: "build_flavor",
    directInputs: ["bitterGlycoside", "terpeneBitter", "alkaloidBitter"],
    functionalSupportInputs: [],
    directWeightRules: [
      "任一苦味来源成立时给予基础值"
    ],
    functionalSupportWeightRules: [],
    invalidBoundary: "无苦味来源时，不显示苦味形成。"
  },
  {
    id: "fermentation_substrate",
    label: "发酵底物",
    categoryId: "build_flavor",
    directInputs: ["nonSweetSugar", "starchGroup"],
    functionalSupportInputs: ["sweetSugar", "amylase", "fermentationNutrientSupport"],
    directWeightRules: [
      "无甜味的糖或淀粉类成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "有甜味的糖、淀粉酶、发酵养分支持组成立时上调"
    ],
    invalidBoundary: "无发酵底物来源时，不显示发酵底物。"
  },
  {
    id: "acidic_fermentation_regulation",
    label: "酸性发酵调控",
    categoryId: "build_flavor",
    directInputs: ["acidicSubstances"],
    functionalSupportInputs: ["sweetSugar", "nonSweetSugar", "starchGroup", "heatStableAcid", "nonVolatileAcid"],
    directWeightRules: [
      "酸性物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "糖类、淀粉类、热稳定酸、不挥发酸成立时上调"
    ],
    invalidBoundary: "无酸性物质时，不显示酸性发酵调控。"
  },
  {
    id: "traditional_fermentation_process",
    label: "传统发酵处理",
    categoryId: "build_flavor",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["sweetSugar", "nonSweetSugar", "starchGroup", "acidicSubstances"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "糖类、淀粉类、酸性物质成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示传统发酵处理。"
  },
  {
    id: "curing_and_maturation",
    label: "腌渍熟成",
    categoryId: "build_flavor",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["saltingSupport", "acidicSubstances", "sweetSugar", "obviousTaste_yes"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "盐渍支持、酸、糖、明显味道成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示腌渍熟成。"
  },

  {
    id: "high_sugar_preservation",
    label: "高糖保存",
    categoryId: "preservation",
    directInputs: ["sweetSugar"],
    functionalSupportInputs: ["water", "dehydratedState"],
    directWeightRules: [
      "有甜味的糖成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、脱水成立时上调"
    ],
    invalidBoundary: "无有甜味的糖时，不显示高糖保存。"
  },
  {
    id: "acidity_preservation",
    label: "酸度保存",
    categoryId: "preservation",
    directInputs: ["acidicSubstances", "heatStableAcid", "nonVolatileAcid"],
    functionalSupportInputs: [],
    directWeightRules: [
      "酸性物质、热稳定酸、不挥发酸任一成立时给予基础值"
    ],
    functionalSupportWeightRules: [],
    invalidBoundary: "无酸性物质时，不显示酸度保存。"
  },
  {
    id: "fat_isolation_layer_formation",
    label: "脂肪隔绝层形成",
    categoryId: "preservation",
    directInputs: ["fat", "solidFat", "flavorFat"],
    functionalSupportInputs: [],
    directWeightRules: [
      "脂肪相关来源成立时给予基础值"
    ],
    functionalSupportWeightRules: [],
    invalidBoundary: "无脂肪时，不显示脂肪隔绝层形成。"
  },
  {
    id: "color_protection_treatment",
    label: "护色处理",
    categoryId: "preservation",
    directInputs: ["labilePigment"],
    functionalSupportInputs: ["heatSensitivePigment", "phSensitivePigment", "polyphenolOxidase"],
    directWeightRules: [
      "易劣变色素成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "热敏色素、pH敏感色素、多酚氧化酶成立时上调"
    ],
    invalidBoundary: "无易劣变色素时，不显示护色处理。"
  },
  {
    id: "break_triggered_antibacterial_action",
    label: "破碎触发抑菌作用",
    categoryId: "preservation",
    directInputs: ["alliin", "glucosinolate"],
    functionalSupportInputs: ["hardTexture"],
    directWeightRules: [
      "蒜氨酸类或芥子油苷类成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "坚硬成立时上调"
    ],
    invalidBoundary: "无蒜氨酸类且无芥子油苷类时，不显示破碎触发抑菌作用。"
  },
  {
    id: "water_removal",
    label: "水分脱除",
    categoryId: "preservation",
    directInputs: ["freeWater", "dehydratedState"],
    functionalSupportInputs: ["water"],
    directWeightRules: [
      "游离水或脱水成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水成立时轻度上调"
    ],
    invalidBoundary: "无游离水且无脱水状态时，不显示水分脱除。"
  },
  {
    id: "temperature_control_for_acid_protection",
    label: "温度控制来保护酸性成分",
    categoryId: "build_flavor",
    directInputs: ["heatSensitiveAcid"],
    functionalSupportInputs: ["acidicSubstances"],
    directWeightRules: [
      "热敏性酸性物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "酸性物质成立时轻度上调"
    ],
    invalidBoundary: "无热敏性酸性物质时，不显示温度控制来保护酸性成分。"
  },
  {
    id: "stable_acid_long_cooking",
    label: "稳定的酸性物质参与长时间烹饪",
    categoryId: "build_flavor",
    directInputs: ["heatStableAcid"],
    functionalSupportInputs: ["nonVolatileAcid", "acidicSubstances"],
    directWeightRules: [
      "热稳定性酸性物质成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "不挥发酸、酸性物质成立时上调"
    ],
    invalidBoundary: "无热稳定性酸性物质时，不显示稳定的酸性物质参与长时间烹饪。"
  },
  {
    id: "temperature_control_color_protection",
    label: "控温护色",
    categoryId: "preservation",
    directInputs: ["heatSensitivePigment"],
    functionalSupportInputs: ["labilePigment"],
    directWeightRules: [
      "热敏色素成立时给予基础值"
    ],
    functionalSupportWeightRules: [
      "易劣变色素成立时上调"
    ],
    invalidBoundary: "无热敏色素时，不显示控温护色。"
  },

  {
    id: "salting_process",
    label: "盐渍处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["water", "freeWater", "extractableLiquid_yes"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、游离水、可提取液体成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示盐渍处理。"
  },
  {
    id: "acid_pickling_process",
    label: "酸渍处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["acidicSubstances", "water"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "酸性物质、水成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示酸渍处理。"
  },
  {
    id: "sugar_pickling_process",
    label: "糖渍处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["sweetSugar", "water"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "有甜味的糖、水成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示糖渍处理。"
  },
  {
    id: "smoking_process",
    label: "烟熏处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["fat", "directAroma", "obviousTaste_yes"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脂肪、直接香气、明显味道成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示烟熏处理。"
  },
  {
    id: "oil_confit_process",
    label: "油封处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["fat", "solidFat", "flavorFat"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "脂肪、固态脂肪、风味脂肪成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示油封处理。"
  },
  {
    id: "alkaline_process",
    label: "碱处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["konjacGlucomannan", "gelGroup", "phSensitivePigment"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "魔芋葡甘聚糖、凝胶类、pH敏感色素成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示碱处理。"
  },
  {
    id: "wrapped_cooking_process",
    label: "包裹烹饪",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["acceptShapeChange_yes", "fillableSpace_yes"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "接受形态改变、内部空间成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示包裹烹饪。"
  },
  {
    id: "sun_drying_process",
    label: "日晒处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["water", "freeWater", "dehydratedState"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、游离水、脱水成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示日晒处理。"
  },
  {
    id: "freeze_thaw_process",
    label: "冻融处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["water", "freeWater", "boundWater"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、游离水、结合水成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示冻融处理。"
  },
  {
    id: "ember_heating_process",
    label: "余烬加热",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["hardTexture", "obviousTaste_yes", "fat"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "坚硬、明显味道、脂肪成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示余烬加热。"
  },
  {
    id: "alcohol_immersion_process",
    label: "酒液浸渍",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["directAroma", "obviousTaste_yes", "fat"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "直接香气、明显味道、脂肪成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示酒液浸渍。"
  },
  {
    id: "brine_stew_process",
    label: "卤渍处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["water", "acidicSubstances", "sweetSugar", "obviousTaste_yes"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "水、酸、糖、明显味道成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示卤渍处理。"
  },
  {
    id: "calcium_setting_process",
    label: "钙化定型",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["pectinGel", "alginate", "strongGel"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "果胶、海藻酸盐、强凝胶成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示钙化定型。"
  },
  {
    id: "soaking_deastringency_process",
    label: "浸泡脱涩处理",
    categoryId: "tecnica_ancestral",
    directInputs: ["considerTraditionalTechniques_yes"],
    functionalSupportInputs: ["astringencySupport", "bitternessSupport", "water"],
    directWeightRules: [
      "考虑祖传技术选择是时给予基础值"
    ],
    functionalSupportWeightRules: [
      "收敛感来源、苦味来源、水成立时上调"
    ],
    invalidBoundary: "未考虑祖传技术时，不显示浸泡脱涩处理。"
  },
  {
  id: "acid_base_color_adjustment",
  label: "酸碱调色",
  categoryId: "extract_components",
  directInputs: ["phSensitivePigment"],
  functionalSupportInputs: ["acidicSubstances", "alkalineProcessSupport", "labilePigment"],
  directWeightRules: [
    "pH敏感色素成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与酸性物质共同出现时上调"
  ],
  invalidBoundary: "无pH敏感色素时, 不应高排酸碱调色。"
},
{
  id: "enzyme_action",
  label: "酶作用",
  categoryId: "build_flavor",
  directInputs: ["enzyme"],
  functionalSupportInputs: ["protease", "amylase", "lipase", "polyphenolOxidase", "cellulase", "pectinase", "otherEnzyme"],
  directWeightRules: [
    "酶成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与对应底物同时出现时上调"
  ],
  invalidBoundary: "无酶时，不成立酶作用。"
},
{
  id: "starch_hydrolysis",
  label: "淀粉分解",
  categoryId: "build_flavor",
  directInputs: ["starchGroup"],
  functionalSupportInputs: ["amylase", "nonSweetSugar", "fermentationSubstrateSupport"],
  directWeightRules: [
    "淀粉类成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与淀粉酶、发酵条件共同出现时上调"
  ],
  invalidBoundary: "无淀粉类时，不成立淀粉分解。"
},
{
  id: "amylase_hydrolysis",
  label: "淀粉酶解",
  categoryId: "build_flavor",
  directInputs: ["amylase"],
  functionalSupportInputs: ["starchGroup", "easyGelatinizingStarch"],
  directWeightRules: [
    "淀粉酶成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与淀粉类共同出现时上调"
  ],
  invalidBoundary: "无淀粉酶时，不成立淀粉酶解。"
},
{
  id: "lipase_hydrolysis",
  label: "脂肪酶解",
  categoryId: "build_flavor",
  directInputs: ["lipase"],
  functionalSupportInputs: ["fat", "oxidizableFat", "flavorFat"],
  directWeightRules: [
    "脂肪酶成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与脂肪、易氧化脂肪共同出现时上调"
  ],
  invalidBoundary: "无脂肪酶时，不成立脂肪酶解。"
},
{
  id: "break_triggered_flavor_generation",
  label: "破碎触发风味生成",
  categoryId: "build_flavor",
  directInputs: ["alliin", "glucosinolate"],
  functionalSupportInputs: ["hardTexture", "enzyme"],
  directWeightRules: [
    "蒜氨酸类或芥子油苷类成立时给予基础值",
    "高上调，中上调，低下调"
  ],
  functionalSupportWeightRules: [
    "与坚硬共同出现时上调"
  ],
  invalidBoundary: "无蒜氨酸类且无芥子油苷类时，不成立破碎触发风味生成。"
}
  
];