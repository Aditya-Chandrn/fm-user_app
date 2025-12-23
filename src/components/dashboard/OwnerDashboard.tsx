import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Edit, Trash, Users, Activity, DollarSign, Calendar, Car, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const OwnerDashboard = () => {
    const { token, user } = useAuth();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [trips, setTrips] = useState<any[]>([]);
    const [stats, setStats] = useState({ revenue: 0, activeCount: 0, totalBookings: 0, cancellations: 0 });
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        model: '',
        registrationNumber: '',
        type: 'sedan',
        driverId: '',
        basePrice: 10,
        costPerKm: 10,
        image: ''
    });
    const [editId, setEditId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!token || !user) return;
        try {
            const headers = { Authorization: `Bearer ${token}` };
            
            // 1. Fetch Vehicles
            const vehRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, { headers });
            const vehData = await vehRes.json();
            let myVehicles: any[] = [];
            
            if (vehData.success) {
                myVehicles = vehData.data.filter((v: any) => v.ownerId === user._id || v.ownerId?._id === user._id);
                setVehicles(myVehicles);
            }

            // 2. Fetch Trips (Backend filters by owner if role is 'owner')
            const tripRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, { headers });
            const tripData = await tripRes.json();
            
            let myTrips: any[] = [];
            if (tripData.success) {
                myTrips = tripData.data;
                setTrips(myTrips);
            }

            // 3. Fetch Drivers
            const driverRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?role=driver`, { headers });
            const driverData = await driverRes.json();
            if (driverData.success) {
                setDrivers(driverData.data);
            }

            // 4. Calculate Stats
            const totalRevenue = myTrips
                .filter(t => t.status === 'completed')
                .reduce((acc, curr) => acc + (curr.fare || 0), 0);
            
            setStats({
                revenue: totalRevenue,
                activeCount: myVehicles.filter(v => v.status === 'active').length,
                totalBookings: myTrips.length,
                cancellations: myTrips.filter(t => t.status === 'cancelled').length
            });

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            toast.error("Failed to load dashboard data");
        }
    }, [token, user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle Edit Click
    const handleEdit = (vehicle: any) => {
        setFormData({
            model: vehicle.model,
            registrationNumber: vehicle.registrationNumber,
            type: vehicle.type,
            driverId: vehicle.driverId?._id || vehicle.driverId || '',
            basePrice: vehicle.basePrice || 10,
            costPerKm: vehicle.costPerKm || 10,
            image: vehicle.image || ''
        });
        setEditId(vehicle._id);
        setIsModalOpen(true);
    };

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                status: 'active',
                driverId: formData.driverId || null
            };

            const url = editId 
                ? `${process.env.NEXT_PUBLIC_API_URL}/vehicles/${editId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/vehicles`;
            
            const method = editId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(editId ? 'Vehicle updated successfully' : 'Vehicle created successfully');
                setIsModalOpen(false);
                fetchData(); // Re-fetch data to update the lists
            } else {
                toast.error(data.error || 'Failed to save vehicle');
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fleet Dashboard</h1>
                <Button onClick={() => {
                    setEditId(null);
                    setFormData({ 
                        registrationNumber: '', 
                        model: '', 
                        type: 'sedan', 
                        driverId: '',
                        basePrice: 10,
                        costPerKm: 10,
                        image: ''
                    });
                    setIsModalOpen(true);
                }} className="flex items-center gap-2">
                    <Plus size={16} /> Add Vehicle
                </Button>
            </div>

            {/* Stats Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold">${stats.revenue}</h3>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Total Bookings</p>
                            <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
                        </div>
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Activity size={24} />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Active Vehicles</p>
                            <h3 className="text-2xl font-bold">{stats.activeCount}</h3>
                        </div>
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Car size={24} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Cancellations</p>
                            <h3 className="text-2xl font-bold">{stats.cancellations}</h3>
                        </div>
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <X size={24} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Vehicle List (Card Layout) */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">My Vehicles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((v) => (
                        <Card key={v._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold">{v.model}</CardTitle>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${v.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {v.status}
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Registration</span>
                                        <span className="font-medium">{v.registrationNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Type</span>
                                        <span className="capitalize">{v.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Driver</span>
                                        <span className="font-medium max-w-[150px] truncate" title={v.driverId?.name || 'Unassigned'}>
                                            {v.driverId ? (v.driverId.name || 'Assigned') : 'Unassigned'}
                                        </span>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="w-full mt-4"
                                        onClick={() => handleEdit(v)}
                                    >
                                        Edit / Assign Driver
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {vehicles.length === 0 && (
                        <div className="col-span-full py-10 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p>No vehicles found. Add one to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Trip History */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Trip History</h2>
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-500">
                                    <tr>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Route</th>
                                        <th className="p-4 font-medium">Vehicle</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Fare</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-700">
                                    {trips.map((trip) => (
                                        <tr key={trip._id}>
                                            <td className="p-4">{new Date(trip.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{trip.startLocation}</span>
                                                    <span className="text-xs text-slate-400">to</span>
                                                    <span className="font-medium">{trip.endLocation}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {trip.vehicleId?.model || 'Unknown'} 
                                                <span className="text-xs text-slate-500 block">
                                                    {trip.vehicleId?.registrationNumber}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                                                    ${trip.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                                      trip.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {trip.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-medium">${trip.fare}</td>
                                        </tr>
                                    ))}
                                    {trips.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-500">
                                                No trip history available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                     <Card className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl animate-in fade-in zoom-in duration-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">
                                <X size={20} />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Registration Number</label>
                                    <Input
                                        value={formData.registrationNumber}
                                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                                        required
                                        placeholder="e.g. KA01AB1234"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Model</label>
                                    <Input
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        required
                                        placeholder="e.g. Toyota Camry"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                                    <Input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://example.com/car.jpg"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Base Price (₹)</label>
                                        <Input
                                            type="number"
                                            value={formData.basePrice}
                                            onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Cost Per Km (₹)</label>
                                        <Input
                                            type="number"
                                            value={formData.costPerKm}
                                            onChange={(e) => setFormData({ ...formData, costPerKm: parseInt(e.target.value) })}
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="sedan">Sedan</option>
                                        <option value="suv">SUV</option>
                                        <option value="luxury">Luxury</option>
                                        <option value="van">Van</option>
                                        <option value="motorcycle">Motorcycle</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Assign Driver (Optional)</label>
                                    <select
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                                        value={formData.driverId}
                                        onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                                    >
                                        <option value="">-- No Driver --</option>
                                        {drivers
                                            .filter(d => d.vehicleClasses?.includes(formData.type))
                                            .map((driver) => (
                                            <option key={driver._id} value={driver._id}>
                                                {driver.name} ({driver.email})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-500 mt-1">Only drivers who selected "{formData.type}" are shown.</p>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" isLoading={loading}>
                                        {editId ? 'Save Changes' : 'Add Vehicle'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
