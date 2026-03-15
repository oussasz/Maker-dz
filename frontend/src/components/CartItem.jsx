import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useState } from "react";

const CartItem = ({ item, actions }) => {
  const [personalization, setPersonalization] = useState(
    item?.personalization || "",
  );

  const [isEditing, setIsEditing] = useState(false);

  const variant = item.productId.variants.find(
    (variant) => variant.id === item.variantId,
  );

  return (
    <div className="flex gap-5 p-5 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-[28%] aspect-square">
        <img
          src={item.productId.mainImages[0]}
          alt={item.productId.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Product Title + Remove */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg leading-tight text-gray-900">
            {item.productId.name}
          </h3>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => actions.handleItemRemove(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Variant Selectors */}
        <div className="flex flex-wrap gap-4 mb-4">
          {Object.entries(variant.attributes).map(([key, value]) => {
            const options = [
              ...new Set(item.productId.variants.map((v) => v.attributes[key])),
            ];

            return (
              <div key={key} className="flex flex-col w-[140px]">
                <label className="text-xs text-gray-500 capitalize mb-1">
                  {key}
                </label>

                <Select
                  defaultValue={value}
                  onValueChange={(newValue) =>
                    actions.handleVariantChange(item, key, newValue)
                  }
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={value} />
                  </SelectTrigger>

                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        {/* Personalization */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1 block">
            Personalization
          </label>

          {isEditing ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={personalization}
                onChange={(e) => setPersonalization(e.target.value)}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={() => {
                  actions.handlePersonalizationChange(item, personalization);
                  setIsEditing(false);
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Input
                value={personalization}
                disabled
                className="text-sm bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>

        {/* Price */}
        <p className="text-lg font-semibold text-gray-900 mb-4">
          DZD {item.price.toFixed(2)}
        </p>

        {/* Quantity + Subtotal */}
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Quantity:</span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => actions.handleDecrement(item)}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="w-8 text-center font-medium text-gray-800">
                {item.quantity}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => actions.handleIncrement(item)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="text-lg font-semibold text-gray-900">
              DZD {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
