import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import useCartStore from "../../store/cartStore.js";
import { ShoppingCart } from "lucide-react";
import useCart from "../../hooks/cart/useCart.js";
import useCartActions from "../../hooks/cart/useCartActions.js";
import Divider from "../../components/ui/divider.jsx";
import CartItem from "../../components/CartItem.jsx";
import { toast } from "sonner";

const Cart = () => {
  const { cart } = useCartStore();
  
  const navigate = useNavigate();
  useCart();
  const { handleDecrement, handleIncrement, handleVariantChange, handleItemRemove, handlePersonalizationChange  } = useCartActions();



  const cartItems = cart.items || [];

  console.log("cart Items: ", cartItems);

  return cartItems.length > 0 ? (
    <div className="w-full bg-background min-h-screen p-6">
      <div className="my-12 text-center space-y-3">
        <h1 className="font-bold text-4xl tracking-tight">Your Cart</h1>
        <p className="text-muted-foreground text-lg">
          {cartItems.length} item
          {cartItems.length !== 1 ? "s" : ""} saved for later
        </p>
      </div>

      <div className="flex justify-start gap-6 w-full">
        <div className="border rounded-lg overflow-hidden flex-3 h-fit">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                item={item}
                actions={{
                  handleDecrement,
                  handleIncrement,
                  handleItemRemove,
                  handleVariantChange,
                  handlePersonalizationChange
                }}
                key={item._id}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg h-fit flex-1">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Subtotal:</span>
              <span>DZD {cart.totalAmount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Discount:</span>
              <span>0%</span>
            </div>
            <Divider className="my-4" />
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total:</span>
              <span>DZD {cart.totalAmount?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            size="lg"
            onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col items-center justify-center gap-6 h-[90vh] text-center animate-fadeIn">
      <div className="relative">
        <ShoppingCart size={180} color="#d9d9d9" fill="#f5f5f5" />
      </div>

      <h1 className="text-3xl font-semibold">Your Cart is Empty</h1>
      <p className="text-muted-foreground max-w-md">
        Start exploring and add products you love. They'll show up here!
      </p>

      <Link to="/">
        <Button size="lg" className="mt-2 rounded-xl">
          Browse Products
        </Button>
      </Link>
    </div>
  );
};

export default Cart;
