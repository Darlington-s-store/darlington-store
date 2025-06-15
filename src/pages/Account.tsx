import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Save, MapPin, Calendar, Award } from "lucide-react";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  date_of_birth: string | null;
  gender: string | null;
}

interface UserStats {
  total_orders: number;
  total_spent: number;
  total_reviews: number;
  average_rating_given: number;
}

const Account = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhone(data.phone || '');
        setAddressLine1(data.address_line_1 || '');
        setAddressLine2(data.address_line_2 || '');
        setCity(data.city || '');
        setState(data.state || '');
        setPostalCode(data.postal_code || '');
        setCountry(data.country || 'Ghana');
        setDateOfBirth(data.date_of_birth || '');
        setGender(data.gender || '');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
        return;
      }

      if (data) {
        setUserStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          address_line_1: addressLine1,
          address_line_2: addressLine2,
          city: city,
          state: state,
          postal_code: postalCode,
          country: country,
          date_of_birth: dateOfBirth || null,
          gender: gender || null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        setError('Failed to update profile. Please try again.');
      } else {
        setSuccess('Profile updated successfully!');
        fetchProfile();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Header />
        <main className="flex items-center justify-center py-8 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="w-full px-4 pt-32 pb-12 md:pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-6">
            Account Settings
          </h1>

          {/* User Stats Cards */}
          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">{userStats.total_orders}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">₵{userStats.total_spent.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">{userStats.total_reviews}</div>
                  <div className="text-sm text-gray-600">Reviews Written</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">{userStats.average_rating_given.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Avg Rating Given</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="w-full shadow-sm">
                <CardHeader className="px-4 py-6 md:px-6">
                  <CardTitle className="text-xl md:text-2xl font-bold">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-6 md:px-6">
                  {error && (
                    <Alert className="border-red-200 bg-red-50 mb-4">
                      <AlertDescription className="text-red-700 text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert className="border-green-200 bg-green-50 mb-4">
                      <AlertDescription className="text-green-700 text-sm">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="space-y-4">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            value={user.email || ''}
                            className="pl-10 bg-gray-100 text-sm md:text-base"
                            disabled
                            placeholder="Email"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      {/* Name Fields */}
                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">First Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="First Name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="pl-10 text-sm md:text-base"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Last Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Last Name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="pl-10 text-sm md:text-base"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10 text-sm md:text-base"
                          />
                        </div>
                      </div>

                      {/* Additional Fields */}
                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="date"
                              value={dateOfBirth}
                              onChange={(e) => setDateOfBirth(e.target.value)}
                              className="pl-10 text-sm md:text-base"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Gender</label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none text-sm md:text-base"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-700 hover:bg-red-800 text-sm md:text-base py-3"
                      disabled={loading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address">
              <Card className="w-full shadow-sm">
                <CardHeader className="px-4 py-6 md:px-6">
                  <CardTitle className="text-xl md:text-2xl font-bold">
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-6 md:px-6">
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Street address"
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                            className="pl-10 text-sm md:text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                        <Input
                          type="text"
                          placeholder="Apartment, suite, etc."
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          className="text-sm md:text-base"
                        />
                      </div>

                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">City</label>
                          <Input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">State/Region</label>
                          <Input
                            type="text"
                            placeholder="State or Region"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="text-sm md:text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Postal Code</label>
                          <Input
                            type="text"
                            placeholder="Postal code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Country</label>
                          <Input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="text-sm md:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-700 hover:bg-red-800 text-sm md:text-base py-3"
                      disabled={loading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? 'Saving...' : 'Save Address'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
