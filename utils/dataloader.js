import communes from "./algeria_cities.json" with { type: "json" };

const wilayas = Object.values(
  communes.reduce((acc, item) => {
    acc[item.wilaya_code] = {
      wilaya_code: item.wilaya_code,
      wilaya_name_ascii: item.wilaya_name_ascii,
      wilaya_name: item.wilaya_name,
    };
    return acc;
  }, {})
);

const communesByWilaya = communes.reduce((acc, item) => {
  if (!acc[item.wilaya_code]) acc[item.wilaya_code] = [];
  acc[item.wilaya_code].push({
    id: item.id,
    commune_name_ascii: item.commune_name_ascii,
    commune_name: item.commune_name
  });
  return acc;
}, {});

export default { wilayas, communesByWilaya };
