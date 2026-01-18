import React from "react";
import { motion } from "framer-motion";
import { Construction, CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-gray-50/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full text-center space-y-8"
      >
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-full"
          />
          <div className="bg-white p-6 rounded-full shadow-lg ring-1 ring-black/5">
            <Construction className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Payment Gateway Under Construction
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            We are currently integrating secure payment processing to ensure the
            best experience for our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="bg-white/60 backdrop-blur border rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Secure Payment</p>
              <p className="text-xs text-gray-500">Coming soon</p>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur border rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Data Protection</p>
              <p className="text-xs text-gray-500">Standard compliant</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button size="lg" onClick={() => navigate("/cart")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Return to Cart
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
