import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { MapPin, User, Navigation, Car } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const DriverDashboard = () => {
    const { token, user, updateUser } = useAuth();
    const [currentTrip, setCurrentTrip] = useState<any | null>(null);
    const [pastTrips, setPastTrips] = useState<any[]>([]);
    const [assignedVehicle, setAssignedVehicle] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchAllData = async () => {
        if (!token) return;
        try {
            const headers = { Authorization: `Bearer ${token}` };
            
            // 1. Fetch Trips
            const tripRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, { headers });
            const tripData = await tripRes.json();
            
            if (tripData.success) {
                const myTrips = tripData.data;
                const active = myTrips.find((t: any) => t.status === 'ongoing' || t.status === 'pending');
                const history = myTrips.filter((t: any) => t.status === 'completed' || t.status === 'cancelled');
                
                setCurrentTrip(active);
                setPastTrips(history);
            }

            // 2. Fetch Assigned Vehicle
            const headerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, { headers });
            const vehicleData = await headerRes.json();
            if (vehicleData.success && vehicleData.data.length > 0) {
                 // API now returns vehicles where driverId == me for drivers
                 setAssignedVehicle(vehicleData.data[0]);
            } else {
                 setAssignedVehicle(null);
            }

        } catch (error) {
            console.error("Failed to fetch driver data", error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [token, user]);

    const handleUpdateStatus = async (tripId: string, status: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                fetchAllData();
            } else {
                alert(data.error || 'Failed to update trip');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Driver Console</h1>

            {/* Current Assignment Card */}
            <Card className="border-l-4 border-l-blue-600 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Navigation className="text-blue-600" />
                        Current Assignment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {currentTrip ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><MapPin className="text-green-500 w-6 h-6" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Pickup From</p>
                                            <p className="font-medium text-xl mt-1">{currentTrip.startLocation}</p>
                                        </div>
                                    </div>
                                    <div className="relative pl-3 border-l-2 border-dashed border-slate-300 h-8 -my-4 ml-[11px]"></div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><MapPin className="text-red-500 w-6 h-6" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Dropoff To</p>
                                            <p className="font-medium text-xl mt-1">{currentTrip.endLocation}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-zinc-800 p-6 rounded-xl space-y-4">
                                    <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Passenger</p>
                                            <p className="font-bold text-lg">{currentTrip.customerId?.name || 'Customer'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {currentTrip.status === 'pending' && (
                                            <Button 
                                                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                                                onClick={() => handleUpdateStatus(currentTrip._id, 'ongoing')}
                                                isLoading={loading}
                                            >
                                                Start Trip
                                            </Button>
                                        )}
                                        {currentTrip.status === 'ongoing' && (
                                            <Button 
                                                className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                                                onClick={() => handleUpdateStatus(currentTrip._id, 'completed')}
                                                isLoading={loading}
                                            >
                                                Complete Trip
                                            </Button>
                                        )}
                                        <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">Cancel Request</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-4">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                                <Car className="h-8 w-8 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-slate-900">No Active Assignments</h3>
                                <p>You are available for new bookings.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assigned Vehicle Card */}
            <Card className="border-l-4 border-l-indigo-600 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Car className="text-indigo-600" />
                        My Assigned Vehicle
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {assignedVehicle ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">{assignedVehicle.model}</h3>
                                <p className="text-sm text-slate-500 font-mono mt-1">{assignedVehicle.registrationNumber}</p>
                                <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-slate-100 dark:bg-zinc-800 uppercase font-semibold">
                                    {assignedVehicle.type}
                                </span>
                            </div>
                             <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase">Per Km Rate</p>
                                <p className="text-lg font-bold text-green-600">₹{assignedVehicle.costPerKm}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500">You are not currently assigned to any vehicle. Update your vehicle preferences below so owners can find you.</p>
                    )}
                </CardContent>
            </Card>

            {/* Available Vehicles to Join (REMOVED - Replaced by Preferences) */}
            
            {/* Driver Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Class Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">Select the vehicle types you are qualified and willing to drive. Owners will see you in their list when assigning drivers to these vehicle types.</p>
                        <div className="flex gap-4">
                            {['sedan', 'suv', 'van', 'motorcycle'].map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={type}
                                        checked={user?.vehicleClasses?.includes(type) || false}
                                        onChange={async (e) => {
                                            const newClasses = e.target.checked
                                                ? [...(user?.vehicleClasses || []), type]
                                                : (user?.vehicleClasses || []).filter((t: string) => t !== type);
                                            
                                            // Optimistic Update (UI)
                                            // user.vehicleClasses = newClasses; // Cannot mutate context directly ideally, but for now we rely on API update + refresh if needed or context refresh.
                                            // Better to just call API and then maybe trigger context reload if possible, or just local state if not critical. 
                                            // For simplicity, we'll just call API and assume success for this demo, or would need a setUser from context.
                                            
                                            try {
                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/preferences`, {
                                                    method: 'PUT',
                                                    headers: { 
                                                        'Content-Type': 'application/json',
                                                        Authorization: `Bearer ${token}` 
                                                    },
                                                    body: JSON.stringify({ vehicleClasses: newClasses })
                                                });
                                                if (res.ok) {
                                                     updateUser({ vehicleClasses: newClasses });
                                                }
                                            } catch(err) {
                                                console.error(err);
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={type} className="text-sm font-medium leading-none capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Trip History */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Trip History</h2>
                <div className="space-y-4">
                    {pastTrips.map((trip) => (
                        <Card key={trip._id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-full">
                                        <MapPin size={20} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{trip.startLocation} ➔ {trip.endLocation}</p>
                                        <p className="text-xs text-slate-500">{new Date(trip.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs rounded-full font-medium capitalize
                                    ${trip.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {trip.status}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                    {pastTrips.length === 0 && (
                        <p className="text-slate-500 text-center py-4">No past trips found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
