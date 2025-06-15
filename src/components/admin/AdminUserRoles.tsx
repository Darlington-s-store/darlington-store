
import { useState, useEffect } from "react";
import { Users, Shield, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

type UserRole = {
  user_id: string;
  role: 'admin';
};

type UserWithRole = Profile & {
  role: 'admin' | null;
};

const AdminUserRolesComponent = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;
      
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        if (rolesError.message.includes("permission denied")) {
           toast({
              title: "Permission Denied",
              description: "You do not have permission to view user roles. Please contact an administrator.",
              variant: "destructive",
           });
        }
        throw rolesError;
      }

      const usersWithRoles: UserWithRole[] = profiles?.map(profile => {
        const userRole = (userRoles || []).find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || null
        };
      }) || [];
      
      setUsers(usersWithRoles);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch user data. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    if (currentUser?.id === userId) {
        toast({ title: "Operation Forbidden", description: "You cannot change your own role.", variant: "destructive" });
        return;
    }

    setIsUpdatingRole(userId);
    try {
        const { error: deleteError } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', userId);

        if (deleteError && deleteError.code !== 'PGRST204') {
            throw deleteError;
        }

        if (newRole === 'admin') {
            const { error: insertError } = await supabase
                .from('user_roles')
                .insert({ user_id: userId, role: 'admin' });
            
            if (insertError) {
                throw insertError;
            }
        }
        
        setUsers(currentUsers =>
            currentUsers.map(u => 
                u.id === userId ? { ...u, role: newRole === 'admin' ? 'admin' : null } : u
            )
        );

        toast({
            title: "Success",
            description: `User role has been updated successfully.`,
        });

    } catch (error: any) {
        console.error('Error updating role:', error);
        toast({
            title: "Error",
            description: error.message || "Failed to update user role.",
            variant: "destructive",
        });
        fetchUsers();
    } finally {
        setIsUpdatingRole(null);
    }
  };


  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Users className="w-6 h-6 mr-2" />
                    Manage User Roles
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </CardContent>
        </Card>
    );
  }
  
  if (error) {
    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    Error
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Manage User Roles
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead className="text-right">Change Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.first_name} {user.last_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                    {user.role === 'admin' ? <Shield className="w-4 h-4 mr-1" /> : null}
                                    {user.role || 'user'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {isUpdatingRole === user.id ? (
                                    <div className="flex justify-end items-center pr-4">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                ) : (
                                    <Select
                                        value={user.role === 'admin' ? 'admin' : 'user'}
                                        onValueChange={(value) => handleRoleChange(user.id, value as 'admin' | 'user')}
                                        disabled={currentUser?.id === user.id}
                                    >
                                        <SelectTrigger className="w-[120px] ml-auto">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}

export default AdminUserRolesComponent;
