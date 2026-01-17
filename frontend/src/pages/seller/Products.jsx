import { Link } from "react-router-dom";
import axios from "../../api/axios.js";
import ProductCard from "../../components/product/ProductCard";
import GridContainer from "../../components/ui/grid-container.jsx";
import { Input } from "../../components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Button } from "../../components/ui/button.tsx";
import LoadingSpinner from "../../components/ui/loading-spinner";
import AddProductModal from "../../components/sellerDashboard/AddProductModal.jsx";
import { PlusCircle } from "lucide-react";
import useAuth from "../../store/authStore.js";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { user } = useAuth();
  const { t } = useTranslation("seller_products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const sellerId = user.id;

      const response = await axios.get(`/sellers/${sellerId}/products`);
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [key, direction] = sortBy.split("-");

    filtered.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (key === "basePrice") {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }

      if (key === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) {
        return direction === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, searchTerm, sortBy]);

  console.log("Filtered and Sorted Products:", filteredAndSortedProducts);

  if (loading) {
    return <LoadingSpinner text={t("loading_products")} />;
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-2 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{t("product_management")}</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder={t("search_products_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("sort_by_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">{t("name_asc")}</SelectItem>
            <SelectItem value="name-desc">{t("name_desc")}</SelectItem>
            <SelectItem value="basePrice-asc">{t("price_asc")}</SelectItem>
            <SelectItem value="basePrice-desc">{t("price_desc")}</SelectItem>
            <SelectItem value="createdAt-desc">{t("newest")}</SelectItem>
            <SelectItem value="createdAt-asc">{t("oldest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <GridContainer cols={4} gap={6}>
          {filteredAndSortedProducts.map((product) => (
            <ProductCard product={product} seller={true} key={product._id} />
          ))}
        </GridContainer>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{t("no_products_found")}</p>
        </div>
      )}
    </div>
  );
};

export default Products;
