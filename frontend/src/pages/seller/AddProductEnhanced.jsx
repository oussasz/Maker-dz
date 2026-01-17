import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
  Settings2,
  Layers,
  Sparkles,
  Info,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ProductFormEnhanced from "../../components/sellerDashboard/ProductFormEnhanced";
import ProductAttributesEnhanced from "../../components/sellerDashboard/ProductAttributesEnhanced";
import VariantOptions from "../../components/sellerDashboard/VariantOptions";
import VariantsTable from "../../components/sellerDashboard/VariantsTable";
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

// Step configuration
const steps = [
  {
    id: "1",
    title: "Basic Info",
    description: "Name, description & images",
    icon: Package,
  },
  {
    id: "2",
    title: "Specifications",
    description: "Categories, tags & details",
    icon: Settings2,
  },
  {
    id: "3",
    title: "Variants",
    description: "Sizes, colors & pricing",
    icon: Layers,
  },
];

// Step indicator component
const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="hidden lg:flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = parseInt(currentStep) > parseInt(step.id);

        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <div
                className={`transition-colors ${isActive ? "text-gray-900" : "text-gray-400"}`}
              >
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs">{step.description}</p>
              </div>
            </motion.div>

            {index < steps.length - 1 && (
              <div className="mx-6 flex items-center">
                <div
                  className={`w-16 h-0.5 transition-colors ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
                <ChevronRight
                  size={16}
                  className={isCompleted ? "text-green-500" : "text-gray-300"}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Mobile step indicator
const MobileStepIndicator = ({ currentStep, totalSteps }) => {
  const progress = (parseInt(currentStep) / totalSteps) * 100;

  return (
    <div className="lg:hidden mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default function AddProductEnhanced() {
  const { addProduct } = useProductSubmission();
  const { t } = useTranslation("seller_addproduct");

  const [productData, setProductData] = useState(initialProductState);
  const [productAttributes, setProductAttributes] = useState(
    initialProductAttributes
  );
  const [variantOptions, setVariantOptions] = useState({});
  const [variantVariables, setVariantVariables] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState("1");

  const next = () => setStep((prev) => `${Math.min(Number(prev) + 1, 3)}`);
  const back = () => setStep((prev) => `${Math.max(Number(prev) - 1, 1)}`);

  const canProceed = () => {
    if (step === "1") {
      return productData.name && productData.basePrice;
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Adding your product to the marketplace...");

    try {
      const result = await addProduct(
        productData,
        productAttributes,
        variantOptions,
        variantVariables,
        variants
      );

      if (result.success) {
        toast.success("Product added successfully! Your item is now live.", {
          id: toastId,
        });
        // Reset form
        setProductData(initialProductState);
        setProductAttributes(initialProductAttributes);
        setVariantOptions({});
        setVariantVariables([]);
        setVariants([]);
        setStep("1");
      } else {
        toast.error("Failed to add product. Please try again.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please check your connection.", {
        id: toastId,
      });
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
            {t("add_new_product")}
            <Sparkles className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-gray-500 mt-1 hidden lg:block">
            List your handcrafted item on the marketplace
          </p>
        </div>
      </motion.div>

      {/* Step Indicators */}
      <StepIndicator currentStep={step} steps={steps} />
      <MobileStepIndicator currentStep={step} totalSteps={3} />

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Basic Info */}
          {step === "1" && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <Info
                    size={20}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-blue-900">Getting Started</p>
                    <p className="text-sm text-blue-700">
                      Add your product's basic information. High-quality images
                      and detailed descriptions help sell your items faster.
                    </p>
                  </div>
                </div>

                <ProductFormEnhanced
                  data={productData}
                  setData={setProductData}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Specifications */}
          {step === "2" && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <AlertCircle
                    size={20}
                    className="text-amber-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-amber-900">Add Details</p>
                    <p className="text-sm text-amber-700">
                      Categories and specifications help customers find your
                      products. The more details, the better visibility.
                    </p>
                  </div>
                </div>

                <ProductAttributesEnhanced
                  data={productAttributes}
                  setData={setProductAttributes}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Variants */}
          {step === "3" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4 mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                    <Layers
                      size={20}
                      className="text-green-600 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-green-900">
                        Product Variants (Optional)
                      </p>
                      <p className="text-sm text-green-700">
                        If your product comes in different sizes, colors, or
                        styles, add them here. You can skip this step if your
                        product has no variants.
                      </p>
                    </div>
                  </div>

                  <VariantOptions
                    variantOptions={variantOptions}
                    setVariantOptions={setVariantOptions}
                    setVariants={setVariants}
                    variantVariables={variantVariables}
                    setVariantVariables={setVariantVariables}
                  />
                </CardContent>
              </Card>

              {variants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-6 lg:p-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Variant Pricing
                      </h3>
                      <VariantsTable
                        variants={variants}
                        setVariants={setVariants}
                        variantVariables={variantVariables}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
      >
        <Button
          variant="outline"
          onClick={back}
          disabled={step === "1"}
          className="w-full sm:w-auto gap-2"
        >
          <ChevronLeft size={18} />
          {t("back")}
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {step !== "3" ? (
            <Button
              onClick={next}
              disabled={!canProceed()}
              className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/25"
            >
              {t("next")}
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-48 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Package size={18} />
                  </motion.div>
                  {t("adding_product")}
                </>
              ) : (
                <>
                  <Check size={18} />
                  {t("save_product")}
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
