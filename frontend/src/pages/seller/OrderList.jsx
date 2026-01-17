import React from "react";
import LoadingSpinner from "../../components/ui/loading-spinner";
import useAuth from "../../store/authStore";
import { useTranslation } from "react-i18next";
import { useOrders } from "../../hooks/useOrders";
import OrdersTable from "../../components/sellerDashboard/OrdersTable";
import OrderCard from "../../components/sellerDashboard/OrderCard";


function OrderList() {
  const { user } = useAuth();
  const { t } = useTranslation("seller_orderlist");
  const sellerId = user.id;

  const {
    loading,
    sellerOrders,
    deleteOrder,
    updateOrderStatus,
    formatTableData,
  } = useOrders(sellerId);

  const tableData = formatTableData(t);

  if (loading) {
    return <LoadingSpinner text={t("loading_orders")} />;
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-2 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          {t("your_orders")}
        </h1>
      </div>

      <div className="lg:bg-white lg:rounded-xl lg:shadow-md lg:border lg:border-gray-200">
        {sellerOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-base sm:text-lg">
              {t("no_orders_yet")}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <OrdersTable
              tableData={tableData}
              updateOrderStatus={updateOrderStatus}
              deleteOrder={deleteOrder}
              t={t}
            />

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {tableData.map((order, index) => (
                <OrderCard
                  key={order.id || index}
                  order={order}
                  updateOrderStatus={updateOrderStatus}
                  deleteOrder={deleteOrder}
                  t={t}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderList;