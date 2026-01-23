import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "./ui/command";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "../api/axios";

export default function BuyNowModal({ open, onClose, onSubmit }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);

  const [wilayaOpen, setWilayaOpen] = useState(false);
  const [communeOpen, setCommuneOpen] = useState(false);

  const getWilayas = async () => {
    const res = await axios.get("/cities");
    setWilayas(res.data);
  };

  const getCommunes = async () => {
    const res = await axios.get(`/communes/${selectedWilaya.wilaya_code}`);
    setCommunes(res.data);
  };
  // Load wilayas on mount
  useEffect(() => {
    getWilayas();
  }, []);

  // Load communes when wilaya changes
  useEffect(() => {
    if (!selectedWilaya) return;

    getCommunes();
  }, [selectedWilaya]);

  const handlePlaceOrder = () => {
    if (!fullName || !phone || !selectedWilaya || !selectedCommune || !address)
      return alert("Please fill all fields.");

    onSubmit({
      fullName,
      phone,
      state: selectedWilaya,
      city: selectedCommune,
      country: "Algeria",
      address,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Enter your delivery details to place the order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              placeholder="0770 12 34 56"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Wilaya */}
          <div>
            <label className="text-sm font-medium">Wilaya</label>

            <Popover open={wilayaOpen} onOpenChange={setWilayaOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedWilaya
                    ? selectedWilaya.wilaya_name_ascii
                    : "Select Wilaya"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full">
                <Command>
                  <CommandInput placeholder="Search wilaya..." />
                  <CommandList>
                    <CommandEmpty>No wilaya found.</CommandEmpty>
                    <CommandGroup>
                      {wilayas.map((w) => (
                        <CommandItem
                          key={w.wilaya_code}
                          onSelect={() => {
                            setSelectedWilaya(w);
                            setSelectedCommune(null);
                            setWilayaOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedWilaya?.wilaya_code === w.wilaya_code
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {w.wilaya_name_ascii}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Commune */}
          <div>
            <label className="text-sm font-medium">Commune</label>

            <Popover open={communeOpen} onOpenChange={setCommuneOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={!selectedWilaya}
                  className="w-full justify-between"
                >
                  {selectedCommune
                    ? selectedCommune.commune_name_ascii
                    : "Select Commune"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-full">
                <Command>
                  <CommandInput placeholder="Search commune..." />
                  <CommandList>
                    <CommandEmpty>No commune found.</CommandEmpty>
                    <CommandGroup>
                      {communes.map((c) => (
                        <CommandItem
                          key={c.id}
                          onSelect={() => {
                            setSelectedCommune(c);
                            setCommuneOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCommune?.id === c.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {c.commune_name_ascii}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input
              placeholder="House number, street, etc."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePlaceOrder}>Place Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
