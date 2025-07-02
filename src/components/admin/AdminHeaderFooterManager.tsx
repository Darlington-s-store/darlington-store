
import { useState } from "react";
import { Save, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAppSettings } from "@/hooks/useAppSettings";
import SiteAssetUpload from "./SiteAssetUpload";

const AdminHeaderFooterManager = () => {
  const { settings, updateSettings, isUpdating } = useAppSettings();
  const [headerSettings, setHeaderSettings] = useState({
    site_name: settings?.site_name || "",
    logo_url: settings?.logo_url || "",
    navigation_links: ""
  });

  const [footerSettings, setFooterSettings] = useState({
    company_description: "Your trusted electronics store in Ghana. We provide high-quality products with excellent customer service and competitive prices.",
    social_links: {
      facebook: "",
      twitter: "",
      instagram: ""
    },
    contact_info: {
      phone: settings?.phone || "",
      email: settings?.contact_email || "",
      address: settings?.address || ""
    }
  });

  const handleSaveHeader = () => {
    if (settings) {
      updateSettings({
        ...settings,
        site_name: headerSettings.site_name,
        logo_url: headerSettings.logo_url
      });
    }
  };

  const handleSaveFooter = () => {
    if (settings) {
      updateSettings({
        ...settings,
        phone: footerSettings.contact_info.phone,
        contact_email: footerSettings.contact_info.email,
        address: footerSettings.contact_info.address
      });
    }
  };

  const handleLogoUpload = (url: string) => {
    setHeaderSettings(prev => ({ ...prev, logo_url: url }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Header & Footer Management</h2>
      </div>

      <Tabs defaultValue="header" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="header">Header Settings</TabsTrigger>
          <TabsTrigger value="footer">Footer Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Header Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={headerSettings.site_name}
                    onChange={(e) => setHeaderSettings(prev => ({ ...prev, site_name: e.target.value }))}
                    placeholder="Enter site name"
                  />
                </div>
              </div>

              <SiteAssetUpload
                label="Logo Upload"
                currentUrl={headerSettings.logo_url}
                onUploadSuccess={handleLogoUpload}
                bucket="site-assets"
              />

              <div>
                <Label htmlFor="navigationLinks">Navigation Links (JSON format)</Label>
                <Textarea
                  id="navigationLinks"
                  value={headerSettings.navigation_links}
                  onChange={(e) => setHeaderSettings(prev => ({ ...prev, navigation_links: e.target.value }))}
                  placeholder='[{"label": "Products", "url": "/products"}, {"label": "About", "url": "/about"}]'
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveHeader} disabled={isUpdating} className="bg-red-700 hover:bg-red-800">
                {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Header Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={footerSettings.company_description}
                  onChange={(e) => setFooterSettings(prev => ({ ...prev, company_description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="footerPhone">Phone</Label>
                  <Input
                    id="footerPhone"
                    value={footerSettings.contact_info.phone}
                    onChange={(e) => setFooterSettings(prev => ({ 
                      ...prev, 
                      contact_info: { ...prev.contact_info, phone: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="footerEmail">Email</Label>
                  <Input
                    id="footerEmail"
                    type="email"
                    value={footerSettings.contact_info.email}
                    onChange={(e) => setFooterSettings(prev => ({ 
                      ...prev, 
                      contact_info: { ...prev.contact_info, email: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="footerAddress">Address</Label>
                  <Input
                    id="footerAddress"
                    value={footerSettings.contact_info.address}
                    onChange={(e) => setFooterSettings(prev => ({ 
                      ...prev, 
                      contact_info: { ...prev.contact_info, address: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input
                      id="facebook"
                      value={footerSettings.social_links.facebook}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        social_links: { ...prev.social_links, facebook: e.target.value }
                      }))}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input
                      id="twitter"
                      value={footerSettings.social_links.twitter}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        social_links: { ...prev.social_links, twitter: e.target.value }
                      }))}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input
                      id="instagram"
                      value={footerSettings.social_links.instagram}
                      onChange={(e) => setFooterSettings(prev => ({ 
                        ...prev, 
                        social_links: { ...prev.social_links, instagram: e.target.value }
                      }))}
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveFooter} disabled={isUpdating} className="bg-red-700 hover:bg-red-800">
                {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Footer Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHeaderFooterManager;
