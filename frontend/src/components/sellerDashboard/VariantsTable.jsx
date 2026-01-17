"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


export default function VariantsTable({ variants, setVariants }) {
  const { t } = useTranslation("seller_addproduct");

  const dynamicKeys = Object.keys(variants[0].attributes || {}).filter(
    (k) => !["price", "quantity", "images", "_index"].includes(k)
  );

  const fileInputsRef = useRef([]);

  const updateField = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleVariantImageUpload = (index, files) => {
    if (!files || files.length === 0) return;

    const updated = [...variants];
    const incoming = Array.from(files);
    const combined = [...(updated[index].images || []), ...incoming];

    updated[index].images = combined.slice(-5);
    setVariants(updated);
  };

  const removeVariantImage = (variantIndex, imgIndex) => {
    const updated = [...variants];
    updated[variantIndex].images = updated[variantIndex].images.filter(
      (_, i) => i !== imgIndex
    );

    setVariants(updated);
  };

  return (
    <>
      {/* DESKTOP TABLE ─────────────────────────────── */}
      <Card className="p-4 shadow hidden md:block">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {dynamicKeys.map((k) => (
                  <TableHead key={k} className="capitalize">
                    {k}
                  </TableHead>
                ))}

                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("images_max_5")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {variants.map((v, i) => (
                <TableRow key={i}>
                  {dynamicKeys.map((k) => (
                    <TableCell key={k}>
                      <Input
                        type="text"
                        value={v.attributes[k]}
                        onChange={(e) => updateField(i, k, e.target.value)}
                      />
                    </TableCell>
                  ))}

                  <TableCell>
                    <Input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateField(i, "price", e.target.value)}
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      value={v.quantity}
                      onChange={(e) => updateField(i, "quantity", e.target.value)}
                    />
                  </TableCell>

                  <TableCell className="min-w-[260px]">
                    <MobileImageUploader
                      v={v}
                      i={i}
                      t={t}
                      fileInputsRef={fileInputsRef}
                      handleVariantImageUpload={handleVariantImageUpload}
                      removeVariantImage={removeVariantImage}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MOBILE CARD VIEW ─────────────────────────────── */}
      <div className="space-y-4 md:hidden">
        {variants.map((v, i) => (
          <Card key={i} className="p-4 shadow">
            <CardContent className="space-y-4">

              {/* Dynamic attributes */}
              {dynamicKeys.map((k) => (
                <div key={k} className="space-y-1">
                  <p className="text-sm capitalize opacity-70">{k}</p>
                  <Input
                    value={v.attributes[k]}
                    onChange={(e) => updateField(i, k, e.target.value)}
                  />
                </div>
              ))}

              {/* Price */}
              <div className="space-y-1">
                <p className="text-sm opacity-70">{t("price")}</p>
                <Input
                  type="number"
                  value={v.price}
                  onChange={(e) => updateField(i, "price", e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <p className="text-sm opacity-70">{t("quantity")}</p>
                <Input
                  type="number"
                  value={v.quantity}
                  onChange={(e) => updateField(i, "quantity", e.target.value)}
                />
              </div>

              {/* Image uploader */}
              <MobileImageUploader
                v={v}
                i={i}
                t={t}
                fileInputsRef={fileInputsRef}
                handleVariantImageUpload={handleVariantImageUpload}
                removeVariantImage={removeVariantImage}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/*───────────────────────────────────────────────
  REUSABLE IMAGE UPLOADER FOR BOTH DESKTOP + MOBILE 
────────────────────────────────────────────────*/
function MobileImageUploader({ v, i, t, fileInputsRef, handleVariantImageUpload, removeVariantImage }) {
  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={(el) => (fileInputsRef.current[i] = el)}
        onChange={(e) => handleVariantImageUpload(i, e.target.files)}
      />

      <Card
        className={`border-dashed cursor-pointer transition ${
          (v.images?.length || 0) >= 5
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-accent"
        }`}
        onClick={() =>
          (v.images?.length || 0) < 5 &&
          fileInputsRef.current[i].click()
        }
      >
        <CardContent className="p-3 text-center">
          <p className="text-xs">{t("click_to_upload")}</p>
          <p className="text-[10px] opacity-60">{t("upload_limit")}</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {v.images?.map((img, imgIndex) => {
          const previewUrl = typeof img === "string" ? img : URL.createObjectURL(img);
          return (
            <div key={imgIndex} className="relative">
              <img
                src={previewUrl}
                className="w-16 h-16 object-cover rounded-md border"
                alt=""
              />

              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] p-0"
                onClick={() => removeVariantImage(i, imgIndex)}
              >
                ×
              </Button>
            </div>
          );
        })}
      </div>

      {v.images?.length > 0 && (
        <Badge variant="secondary" className="text-[11px]">
          {t("images_selected", { count: v.images.length })}
        </Badge>
      )}
    </div>
  );
}
