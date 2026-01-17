import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import { Calendar, Package, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const getStatusBadgeVariant = (state) => {
  const variants = {
    pending: "default",
    shipped: "secondary",
    completed: "outline",
    cancelled: "destructive",
  };
  return variants[state] || "default";
};

const OrdersTable = ({ tableData, updateOrderStatus, deleteOrder, t }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="hidden lg:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-muted/50">
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("date")}
              </div>
            </TableHead>
            <TableHead
              className={`font-semibold ${isRTL ? "text-right" : "text-left"}`}>
              {t("id")}
            </TableHead>
            <TableHead className={`font-semibold ${isRTL ? "text-right" : "text-left"}`}>
                {t("product")}
            </TableHead>
            <TableHead className={`font-semibold ${isRTL ? "text-right" : "text-left"}`}>{t("state")}</TableHead>
            <TableHead className="font-semibold text-center">
              {t("quantity")}
            </TableHead>
            <TableHead className={`font-semibold ${isRTL ? "text-right" : "text-left"}`}>
              {t("price")}
            </TableHead>
            <TableHead className={`font-semibold ${isRTL ? "text-right" : "text-left"}`}>
              {t("total")}
            </TableHead>
            <TableHead className="font-semibold text-center">
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData.map((row, index) => (
            <TableRow
              key={row.id || index}
              className="hover:bg-muted/50 transition-colors">
              <TableCell className="text-muted-foreground">
                {row.date}
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {row.id}
                </code>
              </TableCell>
              <TableCell className="font-medium">{row.product}</TableCell>

              <TableCell>
                <Select
                  dir={isRTL ? "rtl" : "ltr"}
                  value={row.state}
                  onValueChange={(value) => updateOrderStatus(row.id, value)}>
                  <SelectTrigger className="w-[140px] h-9">
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
              </TableCell>

              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {row.quantity}
                </span>
              </TableCell>
              <TableCell className={`text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}>
                {row.price}
              </TableCell>
              <TableCell className={`font-semibold ${isRTL ? "text-right" : "text-left"}`}>
                {row.total}
              </TableCell>

              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteOrder(row.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
