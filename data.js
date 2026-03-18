const ingredientPrototypeData = {
  amountLevels: [
    { id: "low", i18nKey: "amount-low" },
    { id: "medium", i18nKey: "amount-medium" },
    { id: "high", i18nKey: "amount-high" }
  ],
  amountFieldLabels: {
    main: "label-amount",
    child: "label-relative-amount"
  },

  objectDefinition: {
    fields: [
      { id: "ingredientName", labelKey: "label-ingredient-name", type: "text" },
      { id: "scientificName", labelKey: "label-scientific-name", type: "text" },
      { id: "hasSeparablePart", labelKey: "label-separable-part", type: "radio", options: ["option-yes", "option-no"] },
      { id: "separableParts", labelKey: "label-separable-parts-detail", type: "textarea" },
      { id: "studyObject", labelKey: "label-study-object", type: "text" }
    ]
  },

  compositionCategories: [
      { id: "protein", i18nKey: "composition-protein", type: "standard", children: [
      { id: "collagen", i18nKey: "composition-collagen" },
      { id: "heatSensitiveProtein", i18nKey: "composition-heatSensitiveProtein" },
      { id: "solubleProtein", i18nKey: "composition-solubleProtein" },
      { id: "muscleProtein", i18nKey: "composition-muscleProtein" },
      { id: "coagulableProtein", i18nKey: "composition-coagulableProtein" }
      ] },
      { id: "fat", i18nKey: "composition-fat", type: "standard", children: [
      { id: "solidFat", i18nKey: "composition-solidFat" },
      { id: "liquidFat", i18nKey: "composition-liquidFat" },
      { id: "lowMeltingFat", i18nKey: "composition-lowMeltingFat" },
      { id: "highMeltingFat", i18nKey: "composition-highMeltingFat" },
      { id: "oxidizableFat", i18nKey: "composition-oxidizableFat" },
      { id: "flavorFat", i18nKey: "composition-flavorFat" },
      { id: "emulsifiedFat", i18nKey: "composition-emulsifiedFat" }
      ] },
      { id: "sugar", i18nKey: "composition-sugar", type: "mixed", children: [
      { id: "sweetSugar", i18nKey: "composition-sweetSugar" },
      { id: "nonSweetSugar", i18nKey: "composition-nonSweetSugar", children: [
      { id: "starchGroup", i18nKey: "composition-starchGroup", children: [
      { id: "easyGelatinizingStarch", i18nKey: "composition-easyGelatinizingStarch" },
      { id: "elasticStarch", i18nKey: "composition-elasticStarch" }
      ] },
      { id: "gelGroup", i18nKey: "composition-gelGroup", children: [
      { id: "pectinInSugar", i18nKey: "composition-pectinInSugar" },
      { id: "strongGel", i18nKey: "composition-strongGel" }
      ] },
      { id: "fiberGroup", i18nKey: "composition-fiberGroup" },
      { id: "viscousPolysaccharide", i18nKey: "composition-viscousPolysaccharide" }
      ] }
      ] },
      { id: "water", i18nKey: "composition-water", type: "standard", children: [
      { id: "boundWater", i18nKey: "composition-boundWater" },
      { id: "freeWater", i18nKey: "composition-freeWater" },
      { id: "dehydrated", i18nKey: "composition-dehydrated" }
      ] },
      { id: "pigment", i18nKey: "composition-pigment", type: "standard", children: [
      { id: "heatStablePigment", i18nKey: "composition-heatStablePigment" },
      { id: "heatSensitivePigment", i18nKey: "composition-heatSensitivePigment" },
      { id: "phSensitivePigment", i18nKey: "composition-phSensitivePigment" },
      { id: "waterSolublePigment", i18nKey: "composition-waterSolublePigment" },
      { id: "fatSolublePigment", i18nKey: "composition-fatSolublePigment" }
      ] },
      { id: "enzyme", i18nKey: "composition-enzyme", type: "standard", children: [
      { id: "protease", i18nKey: "composition-protease" },
      { id: "amylase", i18nKey: "composition-amylase" },
      { id: "lipase", i18nKey: "composition-lipase" },
      { id: "polyphenolOxidase", i18nKey: "composition-polyphenolOxidase" },
      { id: "cellulase", i18nKey: "composition-cellulase" },
      { id: "pectinase", i18nKey: "composition-pectinase" },
      { id: "otherEnzyme", i18nKey: "composition-otherEnzyme" }
      ] },
      { id: "aroma", i18nKey: "composition-aroma", type: "standard", children: [
      { id: "directAroma", i18nKey: "composition-directAroma" },
      { id: "enzymaticAroma", i18nKey: "composition-enzymaticAroma" },
      { id: "aromaPrecursor", i18nKey: "composition-aromaPrecursor" },
      { id: "fatSolubleAroma", i18nKey: "composition-fatSolubleAroma" },
      { id: "waterSolubleAroma", i18nKey: "composition-waterSolubleAroma" }
      ] },
      { id: "acid", i18nKey: "composition-acid", type: "standard", children: [
      { id: "heatSensitiveAcid", i18nKey: "composition-heatSensitiveAcid" },
      { id: "heatStableAcid", i18nKey: "composition-heatStableAcid" },
      { id: "volatileAcid", i18nKey: "composition-volatileAcid" },
      { id: "nonVolatileAcid", i18nKey: "composition-nonVolatileAcid" }
      ] },
      { id: "specialComponents", i18nKey: "composition-special", type: "flat", children: [
      { id: "lecithin", i18nKey: "composition-lecithin" },
      { id: "otherPhospholipids", i18nKey: "composition-otherPhospholipids" },
      { id: "casein", i18nKey: "composition-casein" },
      { id: "soyProtein", i18nKey: "composition-soyProtein" },
      { id: "lipoproteinComplex", i18nKey: "composition-lipoproteinComplex" },
      { id: "eggWhiteProtein", i18nKey: "composition-eggWhiteProtein" },
      { id: "saponin", i18nKey: "composition-saponin" },
      { id: "legumeProtein", i18nKey: "composition-legumeProtein" },
      { id: "grainProtein", i18nKey: "composition-grainProtein" },
      { id: "wheyProtein", i18nKey: "composition-wheyProtein" },
      { id: "pectinSpecial", i18nKey: "composition-pectinSpecial" },
      { id: "ovalbumin", i18nKey: "composition-ovalbumin" },
      { id: "gelatin", i18nKey: "composition-gelatin" },
      { id: "agar", i18nKey: "composition-agar" },
      { id: "carrageenan", i18nKey: "composition-carrageenan" },
      { id: "alginate", i18nKey: "composition-alginate" },
      { id: "konjacGlucomannan", i18nKey: "composition-konjacGlucomannan" },
      { id: "collagenSpecial", i18nKey: "composition-collagenSpecial" },
      { id: "starchSpecial", i18nKey: "composition-starchSpecial" },
      { id: "guarGum", i18nKey: "composition-guarGum" },
      { id: "locustBeanGum", i18nKey: "composition-locustBeanGum" },
      { id: "seaweedPolysaccharide", i18nKey: "composition-seaweedPolysaccharide" },
      { id: "gumArabic", i18nKey: "composition-gumArabic" },
      { id: "glucomannan", i18nKey: "composition-glucomannan" },
      { id: "capsaicin", i18nKey: "composition-capsaicin" },
      { id: "mustardCompounds", i18nKey: "composition-mustardCompounds" },
      { id: "sulfides", i18nKey: "composition-sulfides" },
      { id: "sanshool", i18nKey: "composition-sanshool" },
      { id: "gingerol", i18nKey: "composition-gingerol" },
      { id: "menthol", i18nKey: "composition-menthol" },
      { id: "polyphenolMonomer", i18nKey: "composition-polyphenolMonomer" },
      { id: "tannin", i18nKey: "composition-tannin" },
      { id: "bitterGlycoside", i18nKey: "composition-bitterGlycoside" },
      { id: "terpeneBitter", i18nKey: "composition-terpeneBitter" },
      { id: "alkaloidBitter", i18nKey: "composition-alkaloidBitter" },
      { id: "alliin", i18nKey: "composition-alliin" },
      { id: "glucosinolate", i18nKey: "composition-glucosinolate" },
      { id: "reducingSugar", i18nKey: "composition-reducingSugar" },
      { id: "freeAminoAcid", i18nKey: "composition-freeAminoAcid" },
      { id: "nucleotide", i18nKey: "composition-nucleotide" },
      { id: "smallPeptide", i18nKey: "composition-smallPeptide" },
      { id: "catechin", i18nKey: "composition-catechin" },
      { id: "catecholSubstrate", i18nKey: "composition-catecholSubstrate" },
      { id: "glycosidicAroma", i18nKey: "composition-glycosidicAroma" },
      { id: "boundAromaPrecursor", i18nKey: "composition-boundAromaPrecursor" },
      { id: "fattyAcidEsterPrecursor", i18nKey: "composition-fattyAcidEsterPrecursor" },
      { id: "proteinHydrolysisPrecursor", i18nKey: "composition-proteinHydrolysisPrecursor" }
      ] }
  ],

  textureOptions: [
    { id: "hardTexture", i18nKey: "texture-hard" },
    { id: "fragileTexture", i18nKey: "texture-fragile" },
    { id: "flexibleTexture", i18nKey: "texture-flexible" },
    { id: "crispyTexture", i18nKey: "texture-crispy" }
  ],

  judgementOptions: [
    { id: "obviousTaste", i18nKey: "judgement-taste" },
    { id: "fillableSpace", i18nKey: "judgement-fillable" },
    { id: "extractableLiquid", i18nKey: "judgement-liquid" },
    { id: "acceptShapeChange", i18nKey: "judgement-shape" },
    { id: "considerTraditionalTechniques", i18nKey: "judgement-tradition" }
  ]
};

window.ingredientPrototypeData = ingredientPrototypeData;
