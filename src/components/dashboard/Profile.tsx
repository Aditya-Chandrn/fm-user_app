'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, Camera, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
    const { user, token, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        profileImage: user?.profileImage || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We need an endpoint to update user details. 
            // Assuming PUT /api/users/profile or similar. 
            // If not exists, I might need to add it to backend userController.
            // Let's assume PUT /api/users/me maps to updateMe
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, { // Need to verify/add this route
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Profile updated successfully');
                updateUser(data.data); // Update context
            } else {
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image URL Input (Simplest for now) */}
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200 flex items-center justify-center relative group">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Profile Image URL</label>
                                <Input 
                                    name="profileImage"
                                    value={formData.profileImage}
                                    onChange={handleChange}
                                    placeholder="https://example.com/my-photo.jpg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User size={16} /> Name
                                </label>
                                <Input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail size={16} /> Email
                                </label>
                                <Input 
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-slate-50 dark:bg-zinc-800 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Phone size={16} /> Phone
                                </label>
                                <Input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin size={16} /> Address
                                </label>
                                <Input 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="flex items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
