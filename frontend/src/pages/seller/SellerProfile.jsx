import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../store/authStore";
import LoadingSpinner from "../../components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SellerProfile = () => {
  const { t } = useTranslation("seller_profile");
  const axiosPrivate = useAxiosPrivate();
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState(false);
  const [savingShop, setSavingShop] = useState(false);

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [shopForm, setShopForm] = useState({
    shopName: "",
    shopDescription: "",
    shopLogo: "",
    shopBanner: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = user?.id;
        if (!userId) {
          setLoading(false);
          return;
        }

        const [userRes, profileRes] = await Promise.all([
          axiosPrivate.get(`/users/${userId}`),
          axiosPrivate.get(`/sellers/${userId}/profile`).catch((err) => {
            if (err?.response?.status === 404) {
              return { data: { profile: null } };
            }
            throw err;
          }),
        ]);

        const userData = userRes.data;
        const profile = profileRes.data?.profile;

        setUserForm({
          username: userData.username || "",
          email: userData.email || "",
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          phone: userData.phone || "",
        });

        setShopForm({
          shopName: profile?.shop_name || "",
          shopDescription: profile?.shop_description || "",
          shopLogo: profile?.shop_logo || "",
          shopBanner: profile?.shop_banner || "",
        });
      } catch (error) {
        console.error("Error loading seller profile:", error);
        toast.error(t("load_error"));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [axiosPrivate, user?.id, t]);

  const handleUserChange = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleShopChange = (field, value) => {
    setShopForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveUserProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingUser(true);
      const userId = user?.id;

      const payload = {
        username: userForm.username,
        email: userForm.email,
        profile: {
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          phone: userForm.phone,
        },
      };

      const response = await axiosPrivate.put(`/users/${userId}`, payload);
      const updatedUser = response.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
      }

      toast.success(t("user_update_success"));
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error(t("user_update_error"));
    } finally {
      setSavingUser(false);
    }
  };

  const saveShopProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingShop(true);
      const payload = {
        shopName: shopForm.shopName,
        shopDescription: shopForm.shopDescription,
        shopLogo: shopForm.shopLogo,
        shopBanner: shopForm.shopBanner,
      };

      const response = await axiosPrivate.put(`/sellers/profile`, payload);
      const profile = response.data?.profile;

      setShopForm({
        shopName: profile?.shop_name || shopForm.shopName,
        shopDescription: profile?.shop_description || shopForm.shopDescription,
        shopLogo: profile?.shop_logo || shopForm.shopLogo,
        shopBanner: profile?.shop_banner || shopForm.shopBanner,
      });

      toast.success(t("shop_update_success"));
    } catch (error) {
      console.error("Error updating shop profile:", error);
      toast.error(t("shop_update_error"));
    } finally {
      setSavingShop(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t("loading")} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {t("title")}
        </h1>
        <p className="text-gray-500">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("personal_info_title")}</CardTitle>
            <CardDescription>{t("personal_info_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveUserProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("first_name")}</Label>
                  <Input
                    id="firstName"
                    value={userForm.firstName}
                    onChange={(e) =>
                      handleUserChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("last_name")}</Label>
                  <Input
                    id="lastName"
                    value={userForm.lastName}
                    onChange={(e) =>
                      handleUserChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t("username")}</Label>
                  <Input
                    id="username"
                    value={userForm.username}
                    onChange={(e) =>
                      handleUserChange("username", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => handleUserChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  value={userForm.phone}
                  onChange={(e) => handleUserChange("phone", e.target.value)}
                />
              </div>

              <Button type="submit" disabled={savingUser}>
                {savingUser ? t("saving") : t("save_changes")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("shop_info_title")}</CardTitle>
            <CardDescription>{t("shop_info_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveShopProfile} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="shopName">{t("shop_name")}</Label>
                <Input
                  id="shopName"
                  value={shopForm.shopName}
                  onChange={(e) => handleShopChange("shopName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopDescription">{t("shop_description")}</Label>
                <Textarea
                  id="shopDescription"
                  value={shopForm.shopDescription}
                  onChange={(e) =>
                    handleShopChange("shopDescription", e.target.value)
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopLogo">{t("shop_logo")}</Label>
                <Input
                  id="shopLogo"
                  value={shopForm.shopLogo}
                  onChange={(e) => handleShopChange("shopLogo", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopBanner">{t("shop_banner")}</Label>
                <Input
                  id="shopBanner"
                  value={shopForm.shopBanner}
                  onChange={(e) =>
                    handleShopChange("shopBanner", e.target.value)
                  }
                  placeholder="https://..."
                />
              </div>

              <Button type="submit" disabled={savingShop}>
                {savingShop ? t("saving") : t("save_changes")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerProfile;
