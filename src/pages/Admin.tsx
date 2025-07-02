
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminReviewManager from "@/components/admin/AdminReviewManager";
import AdminHomepageManager from "@/components/admin/AdminHomepageManager";
import AdminHeaderFooterManager from "@/components/admin/AdminHeaderFooterManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <AdminLayout>
      <Tabs defaultValue="dashboard" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="header-footer">Header & Footer</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>
        <TabsContent value="homepage">
          <AdminHomepageManager />
        </TabsContent>
        <TabsContent value="header-footer">
          <AdminHeaderFooterManager />
        </TabsContent>
        <TabsContent value="reviews">
          <AdminReviewManager />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Admin;
