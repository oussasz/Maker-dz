import React, { useState, useEffect, useRef } from "react";
import axios from "../../api/axios.js";
import { Link } from "react-router-dom";
import { Check, X, Upload, Plus } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { Label } from "../components/ui/label.tsx";
import { Checkbox } from "../components/ui/checkbox.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import { Badge } from "../components/ui/badge.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../components/ui/command.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover.tsx";
import {
  initialSubCategories,
  predefinedColors,
  predefinedLetters,
  predefinedNumbers,
  initialCategoryList,
} from "../components/AddProduct/consts.jsx";
import useAuth from "../../store/authStore.js";

// Reusable Input Component
const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="text-left">
    <Label htmlFor={name} className="font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>

    {type === "textarea" ? (
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="min-h-[100px] mt-2"
      />
    ) : (
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2"
      />
    )}
  </div>
);

// Reusable File Upload Component
const FileUpload = ({ onFileChange, previewImages, onImageDelete }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          name="photos"
          onChange={onFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Choose Files
        </Button>

        <span className="text-sm text-muted-foreground">
          {previewImages.length}/10 photos selected
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {previewImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onImageDelete(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reusable Multi Select Component
const MultiSelect = ({ options, value, onChange, placeholder, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between mt-2"
          disabled={disabled}
        >
          <span className="truncate">
            {value.length > 0 ? `${value.length} selected` : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => {
              const isSelected = value.includes(option.name);
              return (
                <CommandItem
                  key={option.name}
                  onSelect={() => {
                    const newValue = isSelected
                      ? value.filter((item) => item !== option.name)
                      : [...value, option.name];
                    onChange(newValue);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {option.value && (
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: option.value }}
                      />
                    )}
                    <span>{option.name}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 ml-2" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Reusable Category Selection Component
const CategorySelector = ({
  categoryList,
  subCategoriesToShow,
  onCategoryClick,
  onSubCategoryClick,
}) => (
  <div className="mt-2 grid grid-cols-2 gap-2">
    {categoryList.map((category) => (
      <div key={category.name} className="space-y-1">
        <div
          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
            category.selected
              ? "bg-primary/10 border-primary"
              : "bg-muted/50 hover:bg-muted"
          }`}
          onClick={() => onCategoryClick(category)}
        >
          <span className="font-medium">{category.name}</span>
        </div>
        {category.selected && (
          <div className="ml-6 space-y-1">
            {subCategoriesToShow[category.name]?.map((subCat) => (
              <div
                key={subCat.name}
                className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                  subCat.selected
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/30 hover:bg-muted"
                }`}
                onClick={() => onSubCategoryClick(subCat, category)}
              >
                <span>{subCat.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

// Main Component
const ProductAdd = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    colors: [],
    materials: "",
    sizes: [],
    photos: [],
    categories: [],
  });
  const [open, setOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [letters, setLetters] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [custom, setCustom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedCustom, setSelectedCustom] = useState("");
  const [selectedMaterials, setSeletedMaterials] = useState("");
  const [categoryList, setCategoryList] = useState(initialCategoryList);
  const [subCategoriesToShow, setSubCategoriesToShow] =
    useState(initialSubCategories);

  const {user} = useAuth()

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      10 - productData.photos.length
    );
    const newPhotos = [...productData.photos, ...files];
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setProductData((prev) => ({ ...prev, photos: newPhotos }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleImageDelete = (index) => {
    const newPhotos = productData.photos.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    setProductData((prev) => ({ ...prev, photos: newPhotos }));
    setPreviewImages(newPreviews);
  };

  const handleColorChange = (colors) => {
    setProductData((prev) => ({ ...prev, colors: colors }));
  };

  const handleSizeSelection = (sizes, type) => {
    if (type === "letters") setSelectedLetters(sizes);
    else if (type === "numbers") setSelectedNumbers(sizes);
  };

  const handleCustomSize = (e) => {
    setSelectedCustom(e.target.value);
  };

  const handleMaterialsChange = (e) => {
    setSeletedMaterials(e.target.value)
  }

  const handleCategoryClick = (clickedCategory) => {
    const updatedCategories = categoryList.map((category) =>
      category.name === clickedCategory.name
        ? { ...category, selected: !category.selected }
        : category
    );
    setCategoryList(updatedCategories);

    const updatedSubCategories = subCategoriesToShow[clickedCategory.name].map(
      (subCat) =>
        clickedCategory.selected ? { ...subCat, selected: false } : subCat
    );
    setSubCategoriesToShow((prev) => ({
      ...prev,
      [clickedCategory.name]: updatedSubCategories,
    }));
  };

  const handleSubCategoryClick = (subCategory, category) => {
    const updatedSubCategories = subCategoriesToShow[category.name].map(
      (subCat) =>
        subCat.name === subCategory.name
          ? { ...subCat, selected: !subCat.selected }
          : subCat
    );
    setSubCategoriesToShow((prev) => ({
      ...prev,
      [category.name]: updatedSubCategories,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (Array.isArray(value))
        value.forEach((item) => formData.append(key, item));
      else formData.append(key, value);
    });


    try {
      setIsSubmitting(true)
      formData.append("sellerId", user.id);

      await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSubmitting(false)
      handleOpen();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  useEffect(() => {
    const customSizes = selectedCustom
      .split(/[,\n;]/)
      .map((size) => size.trim())
      .filter(Boolean);
    const sizes = [
      ...selectedLetters,
      ...selectedNumbers,
      ...customSizes,
    ];
    setProductData((prev) => ({ ...prev, sizes }));
  }, [selectedLetters, selectedNumbers, selectedCustom]);


  useEffect(() => {
    const materials = selectedMaterials
      .split(/[,\n;]/)
      .map((size) => size.trim())
      .filter(Boolean);
    setProductData((prev) => ({ ...prev, materials }));
  }, [selectedMaterials]);

  useEffect(() => {
    const selectedCategories = categoryList
      .filter((category) => category.selected)
      .flatMap((category) => [
        category.name,
        ...(subCategoriesToShow[category.name]
          ?.filter((subCat) => subCat.selected)
          .map((subCat) => subCat.name) || []),
      ]);
    setProductData((prev) => ({ ...prev, categories: selectedCategories }));
  }, [categoryList, subCategoriesToShow]);

  useEffect(() => {
    console.log("product: ", productData);
  }, [productData]);

  return (
    <div className="min-h-screen w-full bg-background py-8">
      <div className="container w-full max-w-6xl mx-auto px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <InputField
                    label="Price"
                    type="text"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                  />

                  <InputField
                    label="Title"
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    placeholder="Product name"
                    required
                  />

                  <InputField
                    label="Description"
                    type="textarea"
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                  />

                  <div className="text-left">
                    <Label className="text-sm font-medium mb-2">
                      Categories <span className="text-red-500">*</span>
                    </Label>

                    <CategorySelector
                      categoryList={categoryList}
                      subCategoriesToShow={subCategoriesToShow}
                      onCategoryClick={handleCategoryClick}
                      onSubCategoryClick={handleSubCategoryClick}
                    />
                  </div>

                  <div className="space-y-3 text-left">
                    <Label className="text-sm font-medium">
                      Photos <span className="text-red-500">*</span>
                    </Label>
                    <FileUpload
                      onFileChange={handleFileChange}
                      previewImages={previewImages}
                      onImageDelete={handleImageDelete}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-3 text-left">
                    <Label className="text-sm font-medium">
                      Colors <span className="text-red-500">*</span>
                    </Label>
                    <MultiSelect
                      options={predefinedColors}
                      value={productData.colors}
                      onChange={handleColorChange}
                      placeholder="Select colors..."
                    />
                    {productData.colors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {productData.colors.map((color) => {
                          const colorObj = predefinedColors.find(
                            (c) => c.name === color
                          );
                          return (
                            <Badge
                              key={color}
                              variant="secondary"
                              className="gap-2"
                            >
                              {colorObj?.value && (
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: colorObj.value }}
                                />
                              )}
                              {color}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <InputField
                    label="Materials"
                    type="text"
                    name="materials"
                    value={selectedMaterials}
                    onChange={handleMaterialsChange}
                    placeholder="Enter materials (separated by comma, semicolon, or newline)..."
                    required
                  />

                  <div className="space-y-4">
                    <div className="space-y-2 text-left">
                      <Label className="text-sm font-medium">
                        Sizes <span className="text-red-500">*</span>
                      </Label>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2 text-left">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={letters}
                            onCheckedChange={setLetters}
                            id="letters-checkbox"
                          />
                          <Label htmlFor="letters-checkbox">Letters</Label>
                        </div>
                        <MultiSelect
                          options={predefinedLetters}
                          value={selectedLetters}
                          onChange={(value) =>
                            handleSizeSelection(value, "letters")
                          }
                          placeholder="Select letter sizes..."
                          disabled={!letters}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={numbers}
                            onCheckedChange={setNumbers}
                            id="numbers-checkbox"
                          />
                          <Label htmlFor="numbers-checkbox">Numbers</Label>
                        </div>
                        <MultiSelect
                          options={predefinedNumbers}
                          value={selectedNumbers}
                          onChange={(value) =>
                            handleSizeSelection(value, "numbers")
                          }
                          placeholder="Select number sizes..."
                          disabled={!numbers}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={custom}
                            onCheckedChange={setCustom}
                            id="custom-checkbox"
                          />
                          <Label htmlFor="custom-checkbox">Custom</Label>
                        </div>
                        <Textarea
                          disabled={!custom}
                          value={selectedCustom}
                          onChange={handleCustomSize}
                          placeholder="Enter sizes (separated by comma, semicolon, or newline)..."
                          className={!custom ? "opacity-50" : ""}
                        />
                      </div>
                    </div>

                    {(selectedLetters.length > 0 ||
                      selectedNumbers.length > 0 ||
                      selectedCustom) && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Selected Sizes:
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedLetters.map((size) => (
                            <Badge key={size} variant="outline">
                              {size}
                            </Badge>
                          ))}
                          {selectedNumbers.map((size) => (
                            <Badge key={size} variant="outline">
                              {size}
                            </Badge>
                          ))}
                          {selectedCustom.split(/[,\n;]/).map(
                            (size, index) =>
                              size.trim() && (
                                <Badge key={index} variant="outline">
                                  {size.trim()}
                                </Badge>
                              )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-48">
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Great!</DialogTitle>
            <DialogDescription className="text-center">
              Your Product has been created successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/">Go to the home page</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductAdd;
