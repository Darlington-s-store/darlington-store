
import { useState, useEffect } from "react";
import { Save, Upload, Mail, Globe, Shield, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppSettings, AppSettings } from "@/hooks/useAppSettings";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSettings = () => {
  const { settings, isLoading, isError, updateSettings, isUpdating } = useAppSettings();
  const [localSettings, setLocalSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = () => {
    if (localSettings) {
      updateSettings(localSettings);
    }
  };

  const handleInputChange = (field: keyof AppSettings, value: string | boolean) => {
    if (localSettings) {
        setLocalSettings(prev => ({
            ...prev!,
            [field]: value
        }));
    }
  };
  
  if (isLoading) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <Button disabled className="bg-red-700 hover:bg-red-800">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Save Changes
                    </Button>
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-[450px] w-full" />
            </div>
        </AdminLayout>
    );
  }

  if (isError || !localSettings) {
      return (
          <AdminLayout>
              <div className="p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded">
                  <p className="font-bold">Error</p>
                  <p>Failed to load settings. Please check your connection or permissions and try again later.</p>
              </div>
          </AdminLayout>
      );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <Button onClick={handleSave} disabled={isUpdating} className="bg-red-700 hover:bg-red-800">
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Site Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={localSettings.site_name}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={localSettings.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={localSettings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={localSettings.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={localSettings.support_email}
                      onChange={(e) => handleInputChange('support_email', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={localSettings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={localSettings.email_notifications}
                    onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={localSettings.sms_notifications}
                    onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-gray-500">Send order status updates to customers</p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={localSettings.order_updates}
                    onCheckedChange={(checked) => handleInputChange('order_updates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotionalEmails">Promotional Emails</Label>
                    <p className="text-sm text-gray-500">Send promotional emails to subscribers</p>
                  </div>
                  <Switch
                    id="promotionalEmails"
                    checked={localSettings.promotional_emails}
                    onCheckedChange={(checked) => handleInputChange('promotional_emails', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={localSettings.maintenance_mode}
                    onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowGuestCheckout">Allow Guest Checkout</Label>
                    <p className="text-sm text-gray-500">Allow users to checkout without creating an account</p>
                  </div>
                  <Switch
                    id="allowGuestCheckout"
                    checked={localSettings.allow_guest_checkout}
                    onCheckedChange={(checked) => handleInputChange('allow_guest_checkout', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <p className="text-sm text-gray-500">Require users to verify their email address</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={localSettings.require_email_verification}
                    onCheckedChange={(checked) => handleInputChange('require_email_verification', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoApproveReviews">Auto-approve Reviews</Label>
                    <p className="text-sm text-gray-500">Automatically approve product reviews</p>
                  </div>
                  <Switch
                    id="autoApproveReviews"
                    checked={localSettings.auto_approve_reviews}
                    onCheckedChange={(checked) => handleInputChange('auto_approve_reviews', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Logo Upload</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-red-700">D</span>
                    </div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Favicon Upload</Label>
                  <div className="mt-2">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Favicon
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Color Scheme</Label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    <div className="w-12 h-12 bg-red-700 rounded-lg border-2 border-gray-300"></div>
                    <div className="w-12 h-12 bg-blue-700 rounded-lg"></div>
                    <div className="w-12 h-12 bg-green-700 rounded-lg"></div>
                    <div className="w-12 h-12 bg-purple-700 rounded-lg"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
