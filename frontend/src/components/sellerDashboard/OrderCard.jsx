import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const OrderCard = ({ order, updateOrderStatus, deleteOrder, t }) => {
  return (
    <div
      key={order.id || index}
      className="bg-white rounded-xl p-4 shadow border border-gray-200 space-y-4">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-lg text-gray-900 flex-1">
          {order.product}
        </h3>
        {/* <button
          onClick={() => deleteOrder(order.id)}
          className="ml-3 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-medium shadow-sm transition-all">
          {t("delete")}
        </button> */}
      </div>

      {/* Date + Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          <span className="font-medium">{t("date")}:</span> {order.date}
        </span>

        <Select
          value={order.state}
          onValueChange={(value) => updateOrderStatus(order.id, value)}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {t("pending")}
              </div>
            </SelectItem>
            <SelectItem value="shipped">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                {t("shipped")}
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                {t("completed")}
              </div>
            </SelectItem>
            <SelectItem value="cancelled">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                {t("cancelled")}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quantity + Price */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600 font-medium">{t("quantity")}:</span>
          <span className="ml-2 text-gray-900">{order.quantity}</span>
        </div>

        <div>
          <span className="text-gray-600 font-medium">{t("price")}:</span>
          <span className="ml-2 text-gray-900">{order.price}</span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium text-sm">
            {t("total")}:
          </span>
          <span className="text-lg font-bold text-gray-900">{order.total}</span>
        </div>
      </div>

      {/* ID */}
      <div className="text-xs text-gray-500 font-mono truncate">
        ID: {order.id}
      </div>
    </div>
  );
};

export default OrderCard;
