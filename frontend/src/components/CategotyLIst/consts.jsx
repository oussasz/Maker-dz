import dress from "../../assets/dress.svg?react"
import handicraft from "../../assets/handicraft.svg?react"
import laundry from "../../assets/laundry.svg?react"
import necklace from "../../assets/necklace.svg?react"
import surprise from "../../assets/surprise.svg?react"
import watches from "../../assets/watches.svg?react"

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

export const subCategories = {
  Men: ["Shirts", "Pants", "Winter Clothes"],
  Women: ["Shirts", "Dresses", "Hijab", "Sportswear"],
  Gifts: ["For Him", "For Her", "For Kids"],
  Home: ["Decor", "Mats", "Curtains"],
  Accessories: ["Bags", "Purses", "Jewelry"],
  Kids: ["Clothing", "Toys"],
  Beauty: ["Makeup", "Perfumes", "Self Care"],
  Art: ["Painting", "Sculpture", "Wood Art"],
};

export const categories = [
  { name: "Men", icon: laundry },
  { name: "Women", icon: dress },
  { name: "Gifts", icon: surprise },
  { name: "Accessories", icon: watches },
  { name: "Beauty", icon: necklace },
  { name: "Art", icon: handicraft },
];


