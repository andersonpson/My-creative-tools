const aiOutputSchemaDescription = `
The output JSON must use the following overall structure:
{
  "objectDefinition": {
    "ingredientName": "",
    "scientificName": "",
    "hasSeparablePart": "",
    "separableParts": "",
    "studyObject": ""
  },
  // objectDefinition values must only echo user input and must not be inferred or completed.
  // For composition, texture, and judgement, the model should make grounded positive inferences whenever the research target is sufficiently recognizable.
  // The model must evaluate the hierarchy comprehensively, including distinctive components, secondary options, and third-level options whenever they are inferable.
  // All false values, empty strings, and unselected states below are placeholders for structure only. They must not be copied as default answers.
  // If a main category is selected, its amount must be filled. If a child node is selected, its relativeAmount must be filled.
  "composition": {
    "protein": {
      "selected": false,
      "amount": "",
      "children": {
        "collagen": { "selected": false, "relativeAmount": "" },
        "heatSensitiveProtein": { "selected": false, "relativeAmount": "" },
        "solubleProtein": { "selected": false, "relativeAmount": "" },
        "muscleProtein": { "selected": false, "relativeAmount": "" },
        "coagulableProtein": { "selected": false, "relativeAmount": "" }
      }
    },
    "fat": {
      "selected": false,
      "amount": "",
      "children": {
        "solidFat": { "selected": false, "relativeAmount": "" },
        "liquidFat": { "selected": false, "relativeAmount": "" },
        "lowMeltingFat": { "selected": false, "relativeAmount": "" },
        "highMeltingFat": { "selected": false, "relativeAmount": "" },
        "oxidizableFat": { "selected": false, "relativeAmount": "" },
        "flavorFat": { "selected": false, "relativeAmount": "" },
        "emulsifiedFat": { "selected": false, "relativeAmount": "" }
      }
    },
    "sugar": {
      "selected": false,
      "amount": "",
      "children": {
        "sweetSugar": { "selected": false, "relativeAmount": "" },
        "nonSweetSugar": {
          "selected": false,
          "relativeAmount": "",
          "children": {
            "starchGroup": {
              "selected": false,
              "relativeAmount": "",
              "children": {
                "easyGelatinizingStarch": { "selected": false, "relativeAmount": "" },
                "elasticStarch": { "selected": false, "relativeAmount": "" }
              }
            },
            "gelGroup": {
              "selected": false,
              "relativeAmount": "",
              "children": {
                "pectinInSugar": { "selected": false, "relativeAmount": "" },
                "strongGel": { "selected": false, "relativeAmount": "" }
              }
            },
            "fiberGroup": { "selected": false, "relativeAmount": "" },
            "viscousPolysaccharide": { "selected": false, "relativeAmount": "" }
          }
        }
      }
    },
    "water": {
      "selected": false,
      "amount": "",
      "children": {
        "boundWater": { "selected": false, "relativeAmount": "" },
        "freeWater": { "selected": false, "relativeAmount": "" },
        "dehydrated": { "selected": false, "relativeAmount": "" }
      }
    },
    "pigment": {
      "selected": false,
      "amount": "",
      "children": {
        "heatStablePigment": { "selected": false, "relativeAmount": "" },
        "heatSensitivePigment": { "selected": false, "relativeAmount": "" },
        "phSensitivePigment": { "selected": false, "relativeAmount": "" },
        "waterSolublePigment": { "selected": false, "relativeAmount": "" },
        "fatSolublePigment": { "selected": false, "relativeAmount": "" }
      }
    },
    "enzyme": {
      "selected": false,
      "amount": "",
      "children": {
        "protease": { "selected": false, "relativeAmount": "" },
        "amylase": { "selected": false, "relativeAmount": "" },
        "lipase": { "selected": false, "relativeAmount": "" },
        "polyphenolOxidase": { "selected": false, "relativeAmount": "" },
        "cellulase": { "selected": false, "relativeAmount": "" },
        "pectinase": { "selected": false, "relativeAmount": "" },
        "otherEnzyme": { "selected": false, "relativeAmount": "" }
      }
    },
    "aroma": {
      "selected": false,
      "amount": "",
      "children": {
        "directAroma": { "selected": false, "relativeAmount": "" },
        "enzymaticAroma": { "selected": false, "relativeAmount": "" },
        "aromaPrecursor": { "selected": false, "relativeAmount": "" },
        "fatSolubleAroma": { "selected": false, "relativeAmount": "" },
        "waterSolubleAroma": { "selected": false, "relativeAmount": "" }
      }
    },
    "acid": {
      "selected": false,
      "amount": "",
      "children": {
        "heatSensitiveAcid": { "selected": false, "relativeAmount": "" },
        "heatStableAcid": { "selected": false, "relativeAmount": "" },
        "volatileAcid": { "selected": false, "relativeAmount": "" },
        "nonVolatileAcid": { "selected": false, "relativeAmount": "" }
      }
    },
    "specialComponents": {
      "selected": false,
      "amount": "",
      "children": {
        "lecithin": { "selected": false, "relativeAmount": "" },
        "otherPhospholipids": { "selected": false, "relativeAmount": "" },
        "casein": { "selected": false, "relativeAmount": "" },
        "soyProtein": { "selected": false, "relativeAmount": "" },
        "lipoproteinComplex": { "selected": false, "relativeAmount": "" },
        "eggWhiteProtein": { "selected": false, "relativeAmount": "" },
        "saponin": { "selected": false, "relativeAmount": "" },
        "legumeProtein": { "selected": false, "relativeAmount": "" },
        "grainProtein": { "selected": false, "relativeAmount": "" },
        "wheyProtein": { "selected": false, "relativeAmount": "" },
        "pectinSpecial": { "selected": false, "relativeAmount": "" },
        "ovalbumin": { "selected": false, "relativeAmount": "" },
        "gelatin": { "selected": false, "relativeAmount": "" },
        "agar": { "selected": false, "relativeAmount": "" },
        "carrageenan": { "selected": false, "relativeAmount": "" },
        "alginate": { "selected": false, "relativeAmount": "" },
        "konjacGlucomannan": { "selected": false, "relativeAmount": "" },
        "collagenSpecial": { "selected": false, "relativeAmount": "" },
        "starchSpecial": { "selected": false, "relativeAmount": "" },
        "guarGum": { "selected": false, "relativeAmount": "" },
        "locustBeanGum": { "selected": false, "relativeAmount": "" },
        "seaweedPolysaccharide": { "selected": false, "relativeAmount": "" },
        "gumArabic": { "selected": false, "relativeAmount": "" },
        "glucomannan": { "selected": false, "relativeAmount": "" },
        "capsaicin": { "selected": false, "relativeAmount": "" },
        "mustardCompounds": { "selected": false, "relativeAmount": "" },
        "sulfides": { "selected": false, "relativeAmount": "" },
        "sanshool": { "selected": false, "relativeAmount": "" },
        "gingerol": { "selected": false, "relativeAmount": "" },
        "menthol": { "selected": false, "relativeAmount": "" },
        "polyphenolMonomer": { "selected": false, "relativeAmount": "" },
        "tannin": { "selected": false, "relativeAmount": "" },
        "bitterGlycoside": { "selected": false, "relativeAmount": "" },
        "terpeneBitter": { "selected": false, "relativeAmount": "" },
        "alkaloidBitter": { "selected": false, "relativeAmount": "" },
        "alliin": { "selected": false, "relativeAmount": "" },
        "glucosinolate": { "selected": false, "relativeAmount": "" },
        "reducingSugar": { "selected": false, "relativeAmount": "" },
        "freeAminoAcid": { "selected": false, "relativeAmount": "" },
        "nucleotide": { "selected": false, "relativeAmount": "" },
        "smallPeptide": { "selected": false, "relativeAmount": "" },
        "catechin": { "selected": false, "relativeAmount": "" },
        "catecholSubstrate": { "selected": false, "relativeAmount": "" },
        "glycosidicAroma": { "selected": false, "relativeAmount": "" },
        "boundAromaPrecursor": { "selected": false, "relativeAmount": "" },
        "fattyAcidEsterPrecursor": { "selected": false, "relativeAmount": "" },
        "proteinHydrolysisPrecursor": { "selected": false, "relativeAmount": "" }
      }
    }
  },
  "texture": {
    "坚硬": false,
    "柔软易碎": false,
    "柔软有韧性": false,
    "脆": false
  },
  "judgement": {
    "是否有明显味道": "",
    "内部是否有可以填充和灌注的空间": "",
    "是否有可以提取的液体（汁液/脂肪）": "",
    "是否接受形态改变": "",
    "是否考虑传统技术的新应用": ""
  }
}
`;

const aiSystemPrompt = `
You are a prefill assistant for a culinary ingredient information form.
Your task is to generate a structured JSON prefill based on the integrated interpretation of the user's research target.

### 1. Core Role & Formatting Rules
- You only provide prefill suggestions. You are not the final decision-maker.
- Output strictly valid JSON. Do not output explanations, introductions, notes, markdown code fences, or extra text.
- Use only existing fields, hierarchies, and enum values. Do not add or rename fields.
- Value Constraints: All level fields ("amount", "relativeAmount") must be exactly one of: "低", "中", "高". All yes/no fields must be exactly one of: "yes", "no", or "".

### 2. Analysis Unit Context
- The research target is the synthesis of ingredient name, scientific name, separable parts, and study object. Do not anchor solely on the scientific name.
- Determine the active analysis unit first:
  - Default to the whole ingredient unless separable-part mode is explicitly activated and a specific study object is provided.
  - If a local study object is the active unit, only apply structural/spatial properties that hold true for that specific local part.

### 3. Inference Confidence & Boundaries
- Active Judgement vs. Defaults: Do not mechanically copy false values, empty strings, or unselected states from the schema placeholder. Empty outputs are a last resort for truly ambiguous inputs.
- Macro-Properties: You must actively infer broad composition (protein, fat, water, etc.), texture, and judgement fields based on culinary science and product knowledge. 
- Texture Mandate: The "texture" section must NOT simply inherit the default false values. You must individually evaluate each texture tendency and actively assign true/false based on the research target.
- Micro-Properties & Hallucination Control: Deep chemical nodes (e.g., in specialComponents like "fattyAcidEsterPrecursor" or "glucosinolate") should only be selected if they are strongly, distinctively, and universally associated with the defined research target in food science. Do not invent trace components for generic inputs.
- Conditional vs. Inherent: Distinguish between inherent properties and conditional possibilities. If a state (e.g., shape change) strictly requires external processing (wrapping, restructuring), it constrains the inference and should not be treated as a default inherent property.

### 4. Hierarchy & Completeness Mandates
- Do not stop at main categories. If a main category is selected, you must evaluate its secondary and third-level options downwards.
- Selection dependency:
  - If a main category is selected -> its "amount" MUST be judged and filled.
  - If a child node is selected -> its "relativeAmount" MUST be judged and filled.
- The "specialComponents" section requires concrete item selection, not backend-only abstract classes.
- The "sugar" section must strictly adhere to its defined nested hierarchy.

### 5. Output Schema Definition
${aiOutputSchemaDescription}
`;

function buildUserPrompt(formData) {
  return `
Analyze the following input parameters and generate the JSON prefill according to the system rules and schema definition.

Current user input:
- Ingredient name: ${formData.ingredientName || ""}
- Scientific name: ${formData.scientificName || ""}
- Whether separable parts exist: ${formData.hasSeparablePart || ""}
- Separable parts: ${formData.separableParts || ""}
- Study object: ${formData.studyObject || ""}

Note: In the 'objectDefinition' section of your JSON output, strictly echo the input strings provided above without modification, inference, or normalization. All other sections must be actively inferred.
`;
}

window.aiPromptConfig = {
  systemPrompt: aiSystemPrompt,
  outputSchemaDescription: aiOutputSchemaDescription,
  buildUserPrompt
};
