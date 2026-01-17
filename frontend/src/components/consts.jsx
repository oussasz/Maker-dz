import dress from "../assets/dress.svg?react"
import handicraft from "../assets/handicraft.svg?react"
import laundry from "../assets/laundry.svg?react"
import necklace from "../assets/necklace.svg?react"
import surprise from "../assets/surprise.svg?react"
import watches from "../assets/watches.svg?react"


export const predefinedColors = [
  { name: "red", value: "#dc2626" },
  { name: "orange", value: "#ea580c" },
  { name: "yellow", value: "#ca8a04" },
  { name: "green", value: "#16a34a" },
  { name: "blue", value: "#2563eb" },
  { name: "indigo", value: "#4f46e5" },
  { name: "violet", value: "#7c3aed" },
  { name: "purple", value: "#9333ea" },
  { name: "black", value: "#000000" },
  { name: "white", value: "#ffffff" },
  { name: "gray", value: "#6b7280" },
  { name: "silver", value: "#c0c0c0" },
  { name: "maroon", value: "#800000" },
  { name: "navy", value: "#000080" },
  { name: "teal", value: "#0d9488" },
  { name: "olive", value: "#808000" },
  { name: "lime", value: "#84cc16" },
  { name: "fuchsia", value: "#d946ef" },
  { name: "aqua", value: "#22d3ee" },
  { name: "magenta", value: "#db2777" },
  { name: "crimson", value: "#991b1b" },
  { name: "sienna", value: "#a0522d" },
  { name: "coral", value: "#f97316" },
  { name: "turquoise", value: "#06b6d4" },
  { name: "darkred", value: "#7f1d1d" },
  { name: "darkorange", value: "#9a3412" },
  { name: "darkyellow", value: "#854d0e" },
  { name: "darkgreen", value: "#166534" },
  { name: "darkblue", value: "#1e3a8a" },
  { name: "darkindigo", value: "#3730a3" },
  { name: "darkviolet", value: "#5b21b6" },
  { name: "darkpurple", value: "#6b21a8" },
  { name: "darkgray", value: "#4b5563" },
  { name: "lightslategray", value: "#64748b" },
  { name: "lightsteelblue", value: "#b0c4de" },
  { name: "lavender", value: "#e2e8f0" },
  { name: "pink", value: "#f9a8d4" },
  { name: "lightpink", value: "#fbcfe8" },
  { name: "hotpink", value: "#ec4899" },
  { name: "lightcoral", value: "#f87171" },
  { name: "lightsalmon", value: "#fdba74" },
  { name: "lightgoldenrodyellow", value: "#fef9c3" },
  { name: "palegoldenrod", value: "#fef08a" },
  { name: "lightyellow", value: "#fefce8" },
  { name: "beige", value: "#f5f5dc" },
  { name: "whitesmoke", value: "#f8fafc" },
  { name: "mintcream", value: "#f0fff0" },
  { name: "ivory", value: "#fffff0" },
  { name: "seashell", value: "#fff5ee" },
  { name: "floralwhite", value: "#fffaf0" },
  { name: "oldlace", value: "#fdf5e6" },
  { name: "linen", value: "#faf0e6" },
  { name: "antiquewhite", value: "#faebd7" },
  { name: "papayawhip", value: "#ffefd5" },
  { name: "blanchedalmond", value: "#ffebcd" },
  { name: "mistyrose", value: "#ffe4e1" },
  { name: "gainsboro", value: "#dcdcdc" },
  { name: "lightcyan", value: "#e0f2fe" },
  { name: "lightblue", value: "#bae6fd" },
  { name: "skyblue", value: "#7dd3fc" },
  { name: "lightskyblue", value: "#a5f3fc" },
  { name: "steelblue", value: "#3b82f6" },
  { name: "aliceblue", value: "#f0f8ff" },
  { name: "powderblue", value: "#bfdbfe" },
  { name: "azure", value: "#f0ffff" },
  { name: "darkturquoise", value: "#115e59" },
  { name: "cadetblue", value: "#5f9ea0" },
  { name: "cornflowerblue", value: "#6796e6" },
  { name: "royalblue", value: "#4169e1" },
  { name: "mediumblue", value: "#1d4ed8" },
  { name: "midnightblue", value: "#1e3a8a" },
  { name: "navyblue", value: "#000080" },
  { name: "darkmagenta", value: "#8b008b" },
  { name: "darkorchid", value: "#9932cc" },
  { name: "brown", value: "#a52a2a" },
  { name: "firebrick", value: "#b22222" },
  { name: "indianred", value: "#cd5c5c" },
  { name: "salmon", value: "#fa8072" },
  { name: "darksalmon", value: "#e9967a" },
  { name: "tomato", value: "#ff6347" },
  { name: "orangered", value: "#ff4500" },
  { name: "gold", value: "#ffd700" },
  { name: "chartreuse", value: "#7fff00" },
  { name: "palegreen", value: "#98fb98" },
  { name: "greenyellow", value: "#adff2f" },
  { name: "lawngreen", value: "#7cfc00" },
  { name: "limegreen", value: "#32cd32" },
  { name: "forestgreen", value: "#228b22" },
];

export const categoryList = [
  "Men",
  "Women",
  "Gifts",
  "Decore",
  "Accessories",
  "Mats",
  "embroidery",
  "Aprons",
  "Kids",
  "Health & Beauty",
  "Bags & Purses",
  "Toys",
  "Craft Supplies & Tools",
  "Occasions Clothing",
  "Art",
];

export const initialCategoryList = categoryList.map((name) => ({
  name,
  selected: false,
}));

export const initialSubCategories = {
  Men: ["Men Shirts", "Men Pants", "Winter Clothes"].map((name) => ({
    name,
    selected: false,
  })),
  Women: [
    "Women Shirts",
    "Women Pants",
    "Hijab",
    "Dresses",
    "Pijamas",
    "Sports",
    "Prayer Sets & Rugs",
  ].map((name) => ({ name, selected: false })),
  Gifts: ["For Him", "For Her", "For kids", "Official"].map((name) => ({
    name,
    selected: false,
  })),
  Decore: ["House", "Office", "Other"].map((name) => ({
    name,
    selected: false,
  })),
  Accessories: ["Phone & PC", "Keys", "Cars", "Other"].map((name) => ({
    name,
    selected: false,
  })),
  Mats: ["Mats", "Curtains", "Carpets"].map((name) => ({
    name,
    selected: false,
  })),
  Aprons: ["For Kitchen", "For work", "For school"].map((name) => ({
    name,
    selected: false,
  })),
  embroidery: [].map((name) => ({ name, selected: false })),
  Kids: [].map((name) => ({ name, selected: false })),
  "Health & Beauty": [
    "Makeup",
    "Self Care",
    "Perfumes",
    "Oils",
    "Natural blends",
    "Care",
  ].map((name) => ({ name, selected: false })),
  "Bags & Purses": ["Bags", "Purses"].map((name) => ({
    name,
    selected: false,
  })),
  Toys: [].map((name) => ({ name, selected: false })),
  "Craft Supplies & Tools": ["House", "Office", "Other"].map((name) => ({
    name,
    selected: false,
  })),
  "Occasions Clothing": ["For Women", "Circumcision", "Other Occasions"].map(
    (name) => ({ name, selected: false })
  ),
  Art: ["Paint", "Sculpture", "Glass Art", "Ceramic Art", "Wood Art"].map(
    (name) => ({ name, selected: false })
  ),
};

export const predefinedLetters = ["XS", "S", "M", "L", "XL", "XXL"].map(
  (name, index) => ({
    name,
    id: index,
  })
);
export const predefinedNumbers = [
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
].map((name, index) => ({ name, id: index }));

export const categories = [
  { name: "Men", icon: laundry },
  { name: "Women", icon: dress },
  { name: "Gifts", icon: surprise },
  { name: "Accessories", icon: watches },
  { name: "Beauty", icon: necklace },
  { name: "Art", icon: handicraft },
];
