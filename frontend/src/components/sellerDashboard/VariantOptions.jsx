// src/components/VariantOptions.jsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function VariantOptions({
  variantOptions,
  setVariantOptions,
  setVariants,
  variantVariables,
  setVariantVariables,
}) {
  const [variableInput, setVariableInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const { t } = useTranslation("seller_addproduct");

  // --- Add variable (like tag) ---
  const addVariable = (e) => {
    e.preventDefault();
    const name = variableInput.trim();
    if (name && !variantVariables.includes(name)) {
      setVariantVariables([...variantVariables, name]);
      setVariantOptions({ ...variantOptions, [name]: [] });
      setVariableInput("");
    }
  };

  // --- Add value for selected variable ---
  const addValue = (e) => {
    e.preventDefault();
    if (!selectedVariable) return;
    const val = valueInput.trim();
    if (val && !variantOptions[selectedVariable]?.includes(val)) {
      const updated = {
        ...variantOptions,
        [selectedVariable]: [...(variantOptions[selectedVariable] || []), val],
      };
      setVariantOptions(updated);
      setValueInput("");
      generateVariants(updated);
    }
  };

  // --- Generate combinations ---
  const generateVariants = (options) => {
    const keys = Object.keys(options).filter((k) => options[k].length > 0);
    if (keys.length === 0) return setVariants([]);

    const combinations = keys.reduce((acc, key) => {
      const vals = options[key];
      if (acc.length === 0) return vals.map((v) => ({ [key]: v }));
      return acc.flatMap((a) => vals.map((v) => ({ ...a, [key]: v })));
    }, []);

    setVariants(
      combinations.map((c) => ({
        attributes: {...c},
        price: "",
        quantity: "",
        images: [],
      }))
    );
  };

  return (
    <div className="space-y-6 bg-white p-4 rounded-xl shadow">
      <Label>{t("variants")}</Label>

      {/* Step 1: Add Variables */}
      <div className="space-y-2">
        <p className="font-semibold">{t("add_variant_variables")}</p>
        <div className="flex gap-2">
          <Input
            placeholder={t("enter_variable_placeholder")}
            value={variableInput}
            onChange={(e) => setVariableInput(e.target.value)}
          />
          <Button onClick={addVariable}>{t("add")}</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {variantVariables.map((v, i) => (
            <span
              key={i}
              onClick={() => setSelectedVariable(v)}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                selectedVariable === v
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}>
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Step 2: Add Values for Selected Variable */}
      {variantVariables.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold">
            {t("add_values_for_selected_variable")}
          </p>
          {selectedVariable ? (
            <>
              <div className="flex gap-2">
                <Input
                  placeholder={t("add_variable_value_placeholder", {
                    variable: selectedVariable,
                  })}
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                />
                <Button onClick={addValue}>{t("add")}</Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              {t("select_variable_to_add_values")}
            </p>
          )}
        </div>
      )}

      {/* Preview all options */}
      {Object.keys(variantOptions).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(variantOptions).map(
            ([key, vals]) =>
              vals.length > 0 && (
                <div key={key}>
                  <p className="font-medium">{key}</p>
                  <div className="flex flex-wrap gap-2">
                    {vals.map((v, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
