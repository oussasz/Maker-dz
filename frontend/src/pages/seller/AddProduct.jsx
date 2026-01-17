import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import ProductForm from "../../components/sellerDashboard/ProductForm";
import VariantOptions from "../../components/sellerDashboard/VariantOptions";
import VariantsTable from "../../components/sellerDashboard/VariantsTable";
import ProductAttributes from "../../components/sellerDashboard/ProductAttributes";
import { useTranslation } from "react-i18next";
import { useProductSubmission } from "../../hooks/useProductSubmission";
import { toast } from "sonner";

const initialProductState = {
  name: "",
  description: "",
  basePrice: "",
  images: [],
};

const initialProductAttributes = {
  specifications: new Map(),
  tags: [],
  categories: [],
};

export default function AddProduct() {
  const { addProduct } = useProductSubmission();
  const { t } = useTranslation("seller_addproduct");

  console.log("re rendered hhhhhh")

  const [productData, setProductData] = useState(initialProductState);
  const [productAttributes, setProductAttributes] = useState(
    initialProductAttributes
  );
  const [variantOptions, setVariantOptions] = useState({});
  const [variantVariables, setVariantVariables] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState("1");

  const next = () => setStep((prev) => `${Number(prev) + 1}`);
  const back = () => setStep((prev) => `${Number(prev) - 1}`);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Adding product...");

    try {
      const result = await addProduct(
        productData,
        productAttributes,
        variantOptions,
        variantVariables,
        variants
      );

      if (result.success) {
        toast.success("Product added successfully!", { id: toastId });
        console.log("Product added successfully:", result.data);
      } else {
        toast.error("Failed to add product", { id: toastId });
        console.error("Failed to add product");
      }
    } catch (error) {
      toast.error("An error occurred while adding the product", {
        id: toastId,
      });
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-2 lg:p-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8">
        {t("add_new_product")}
      </h1>

      <Tabs value={step} onValueChange={setStep} className="space-y-8">
        {/* Step Indicators */}
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="1">{`1.  ${t("basic_info")}`}</TabsTrigger>
          <TabsTrigger value="2">{`2.  ${t("specifications")}`}</TabsTrigger>
          <TabsTrigger value="3">{`3.  ${t("variants")}`}</TabsTrigger>
        </TabsList>

        {/* STEP 1 — Product Form */}
        <TabsContent value="1" className="space-y-8">
          <ProductForm data={productData} setData={setProductData} />
          <div className="flex justify-end">
            <Button onClick={next}>{t("next")}</Button>
          </div>
        </TabsContent>

        {/* STEP 2 — Specifications */}
        <TabsContent value="2" className="space-y-8">
          <ProductAttributes
            data={productAttributes}
            setData={setProductAttributes}
          />
          <div className="flex justify-between">
            <Button variant="outline" onClick={back}>
              {t("back")}
            </Button>
            <Button onClick={next}>{t("next")}</Button>
          </div>
        </TabsContent>

        {/* STEP 3 — Variants */}
        <TabsContent value="3" className="space-y-8">
          <VariantOptions
            variantOptions={variantOptions}
            setVariantOptions={setVariantOptions}
            setVariants={setVariants}
            variantVariables={variantVariables}
            setVariantVariables={setVariantVariables}
          />

          {variants.length > 0 && (
            <VariantsTable
              variants={variants}
              setVariants={setVariants}
              variantVariables={variantVariables}
            />
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={back}>
              {t("previous")}
            </Button>
            <Button
              className="w-40"
              onClick={handleSubmit}
              disabled={isSubmitting}>
              {isSubmitting ? t("adding_product") : t("save_product")}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
