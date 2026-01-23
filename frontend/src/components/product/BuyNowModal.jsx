import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import useAlgeriaData from "../../hooks/UseAlgeriaData.jsx";

const BuyNowModal = ({
  open,
  handleClose,
  productDetails,
  handleBuyNow,
  userId,
}) => {
  const [wilayaOpen, setWilayaOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [next, setNext] = useState(false);
  const [currentWilaya, setCurrentWilaya] = useState("");
  const { algeriaData, isLoading, error } = useAlgeriaData();
  const [sortedAlgeriaData, setSortedAlgeriaData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    quantity: 1,
    userId: userId,
    wilaya: "",
    commune: "",
  });

  const filterDairas = (wilayaName) => {
    if (!wilayaName) return [];
    const selectedWilaya = sortedAlgeriaData.find(
      (wilaya) => wilaya.name === wilayaName,
    );
    return selectedWilaya ? selectedWilaya.dairas : [];
  };

  useEffect(() => {
    if (algeriaData.length > 0) {
      setSortedAlgeriaData(algeriaData);
    }
  }, [algeriaData]);

  const handleQuantityChange = (e) => {
    setSelectedOptions({
      ...selectedOptions,
      quantity: parseInt(e.target.value),
    });
  };

  const handleWilayaChange = (value) => {
    const wilayaName = value === currentWilaya ? "" : value;
    setCurrentWilaya(wilayaName);
    setSelectedOptions({ ...selectedOptions, wilaya: wilayaName, commune: "" });
  };

  const handleCityChange = (value) => {
    const cityName = value === selectedOptions.commune ? "" : value;
    setSelectedOptions({ ...selectedOptions, commune: cityName });
  };

  const handleInBuyNowClick = () => {
    handleBuyNow(selectedOptions);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-center">
            {!next ? "Enter Your Information" : "Select Options"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Provide your delivery information and confirm order details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* First Form - Personal Information */}
          <div className={!next ? "block" : "hidden"}>
            {isLoading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center">
                Error loading Algeria data: {error}
              </p>
            ) : (
              <div className="space-y-4">
                {/* Searchable Wilaya Select */}
                <div className="space-y-2">
                  <Label htmlFor="wilaya">Wilaya</Label>
                  <Popover open={wilayaOpen} onOpenChange={setWilayaOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={wilayaOpen}
                        className="w-full justify-between"
                      >
                        {currentWilaya || "Select Wilaya..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search wilaya..." />
                        <CommandList>
                          <CommandEmpty>No wilaya found.</CommandEmpty>
                          <CommandGroup>
                            {sortedAlgeriaData.map((wilaya, index) => (
                              <CommandItem
                                key={index}
                                value={wilaya.name}
                                onSelect={(currentValue) => {
                                  handleWilayaChange(currentValue);
                                  setWilayaOpen(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    currentWilaya === wilaya.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {wilaya.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Searchable City Select */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityOpen}
                        className="w-full justify-between"
                        disabled={!currentWilaya}
                      >
                        {selectedOptions.commune || "Select Town..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search town..." />
                        <CommandList>
                          <CommandEmpty>No town found.</CommandEmpty>
                          <CommandGroup>
                            {filterDairas(currentWilaya).map((daira) => (
                              <CommandItem
                                key={daira.name}
                                value={daira.name}
                                onSelect={(currentValue) => {
                                  handleCityChange(currentValue);
                                  setCityOpen(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    selectedOptions.commune === daira.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {daira.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="Enter your phone number"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setNext(!next)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Second Form - Product Options */}
          <div className={next ? "block" : "hidden"}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={selectedOptions.quantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom">Additional Notes</Label>
                <Textarea
                  id="custom"
                  type="text"
                  placeholder="Add something specific the seller should know"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNext(!next)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleInBuyNowClick}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNowModal;
