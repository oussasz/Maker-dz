import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export default function SpecificationsInput({ specifications, addSpec, removeSpec, keyVal, setKeyVal }) {
  const { t } = useTranslation("seller_addproduct");


  return (
    <div className="space-y-4 rounded-xl ">
      <Label>{t("specifications")}</Label>
      <div className="flex gap-2">
        <Input
          placeholder={t("key_placeholder")}
          value={keyVal.key}
          onChange={(e) => setKeyVal({ ...keyVal, key: e.target.value })}
        />
        <Input
          placeholder={t("value_placeholder")}
          value={keyVal.value}
          onChange={(e) => setKeyVal({ ...keyVal, value: e.target.value })}
        />
        <Button onClick={addSpec}>{t("add")}</Button>
      </div>

      <ul className="mt-3 space-y-2">
        {Array.from(specifications.entries()).map(([key, value], i) => (
          <li
            key={i}
            className="flex justify-between items-center border p-2 rounded-md">
            <span>
              {key}: {value}
            </span>
            <button className="text-red-500" onClick={() => removeSpec(key)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
