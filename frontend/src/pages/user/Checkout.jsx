import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import useCartStore from "../../store/cartStore.js";
import axios from "../../api/axios.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    postalCode: "",
  });

  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);

  const [wilayaOpen, setWilayaOpen] = useState(false);
  const [communeOpen, setCommuneOpen] = useState(false);

  const cartItems = cart.items || [];
  const subtotal = cart.totalAmount || 0;
  const total = subtotal;

  const getWilayas = async () => {
    const res = await axios.get("/wilayas");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("submitting");
      const items = cartItems.map((item) => {
        return {
          productId: item.productId._id,
          sellerId: item.productId.sellerId,
          variantId: item.variantId,
          personalization: item.personalization,
          quantity: item.quantity,
          name: item.productId.name,
          price: item.price,
          subtotal: item.price * item.quantity,
        };
      });

      const orderData = {
        items: items,
        shippingAddress: {
          ...formData,
          city: selectedCommune,
          state: selectedWilaya,
        },
        subtotal: cart.totalAmount,
        total: cart.totalAmount,
        cartId: cart._id,
      };

      console.log("order data: ", orderData);

      const response = await axiosPrivate.post("/orders", orderData);

      if (response.status === 201) {
        toast.success("Your order is placed");
        if (response.data.cart) {
          clearCart()
        }
        navigate("/cart")
      } else {
        toast.error("There was an error placing your order. Please try again");
      }
    } catch (err) {
      toast.error("There was an error placing your order. Please try again");
      console.error("Error placing order:", err);
    }
  };

  useEffect(() => {
    console.log("Component re-rendered");
  });

  return (
    <div className="w-full bg-background min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="font-bold text-4xl tracking-tight">Checkout</h1>
          <p className="text-muted-foreground text-lg mt-2">
            Complete your purchase
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Form */}
          <div className="flex-1 lg:flex-[2]">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>
                  Enter your delivery details below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+213 555 123 456"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="fullName">First Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Popover open={wilayaOpen} onOpenChange={setWilayaOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between">
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
                                      }}>
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedWilaya?.wilaya_code ===
                                            w.wilaya_code
                                            ? "opacity-100"
                                            : "opacity-0"
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
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Popover
                          open={communeOpen}
                          onOpenChange={setCommuneOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={!selectedWilaya}
                              className="w-full justify-between">
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
                                      }}>
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedCommune?.id === c.id
                                            ? "opacity-100"
                                            : "opacity-0"
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
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Main St, Apt 4"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Order Summary & Payment */}
          <div className="flex-1 lg:flex-[1]">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <img
                        src={item.productId.mainImages[0]}
                        alt={item.productId.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.productId.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          DZD {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>DZD {subtotal.toFixed(2)}</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>DZD {total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Place Order Button */}
                <Button className="w-full" size="lg" onClick={handleSubmit}>
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
