import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MapPin, Calendar, CreditCard, Car, Filter, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const CustomerDashboard = () => {
    const { token } = useAuth();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [myTrips, setMyTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    
    // Booking Modal State
    const [showBookModal, setShowBookModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [bookingData, setBookingData] = useState({ 
        startLocation: '', 
        endLocation: '',
        scheduledDate: '',
        scheduledTime: ''
    });

    const fetchData = async () => {
        if (!token) return;
        try {
            const headers = { Authorization: `Bearer ${token}` };
            
            // 1. Fetch Vehicles
            const vehiclesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles?status=active`, { headers });
            const vehiclesData = await vehiclesRes.json();
            
            // 2. Fetch Trips
            const tripsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, { headers });
            const tripsData = await tripsRes.json();
            
            if (vehiclesData.success) setVehicles(vehiclesData.data);
            if (tripsData.success) setMyTrips(tripsData.data);

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleBookClick = (vehicle: any) => {
        setSelectedVehicle(vehicle);
        setBookingData({ 
            startLocation: '', 
            endLocation: '',
            scheduledDate: new Date().toISOString().split('T')[0], // Today
            scheduledTime: new Date().toTimeString().split(' ')[0].slice(0, 5) // Now HH:MM
        });
        setShowBookModal(true);
    };

    const confirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    vehicleId: selectedVehicle._id,
                    startLocation: bookingData.startLocation,
                    endLocation: bookingData.endLocation,
                    scheduledDate: new Date(`${bookingData.scheduledDate}T${bookingData.scheduledTime}`).toISOString()
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success('Trip booked successfully! Check your email for details.');
                setShowBookModal(false);
                fetchData(); // Refresh to show new trip
            } else {
                toast.error(data.error || 'Booking failed');
            }
        } catch (err) {
            toast.error('An unexpected error occurred');
        }
    };

    const activeTrips = myTrips.filter(t => t.status === 'ongoing' || t.status === 'pending');
    const pastTrips = myTrips.filter(t => t.status === 'completed' || t.status === 'cancelled');

    const filteredVehicles = filterType === 'all' 
        ? vehicles 
        : vehicles.filter(v => v.type === filterType);

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="space-y-8 relative">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Dashboard</h1>

            {/* Active Trips Badge / Card */}
            {activeTrips.length > 0 && (
                <div className="grid gap-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="text-green-500" /> Active Trips
                    </h2>
                    {activeTrips.map(trip => (
                         <Card key={trip._id} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-semibold backdrop-blur-sm capitalize border border-white/30">
                                                {trip.status}
                                            </span>
                                            <span className="text-sm opacity-75">{new Date(trip.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 flex-shrink-0" />
                                            <div>
                                                <div className="font-semibold text-lg">{trip.startLocation}</div>
                                                <div className="text-blue-200 text-sm">to</div>
                                                <div className="font-semibold text-lg">{trip.endLocation}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold">₹{trip.fare || '---'}</div>
                                        <div className="text-sm opacity-80 mb-2">Estimated Fare</div>
                                        <div className="text-xs bg-white/20 px-2 py-1 rounded inline-block backdrop-blur-sm">
                                            {trip.distance} km • {trip.estimatedTime || 'N/A'}
                                        </div>
                                        {trip.vehicleId && (
                                            <div className="mt-2 flex items-center justify-end gap-2 text-sm bg-black/20 px-3 py-2 rounded-lg">
                                                <Car size={16} />
                                                <span>{trip.vehicleId.model} ({trip.vehicleId.registrationNumber})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Book a Ride Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Book a Ride</h2>
                    <div className="flex gap-2">
                        {['all', 'sedan', 'suv', 'luxury', 'van', 'motorcycle'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors
                                    ${filterType === type 
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-400'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredVehicles.map((vehicle) => (
                        <Card key={vehicle._id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200 dark:border-zinc-800">
                            <CardContent className="p-0 flex flex-col md:flex-row">
                                <div className="md:w-64 h-48 md:h-auto md:shrink-0 bg-slate-100 relative">
                                    {vehicle.image ? (
                                        <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                            <Car size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-bold uppercase shadow-sm">
                                        {vehicle.type}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                {vehicle.model}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-mono mt-1">{vehicle.registrationNumber}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-emerald-600">₹{vehicle.costPerKm}<span className="text-sm font-normal text-slate-500">/km</span></p>
                                            <p className="text-xs text-slate-400">Base Price: ₹{vehicle.basePrice}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button onClick={() => handleBookClick(vehicle)} className="bg-slate-900 hover:bg-blue-600 transition-colors px-6">
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredVehicles.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-500">No {filterType !== 'all' ? filterType : ''} vehicles available right now.</p>
                        </div>
                    )}
                </div>
            </div>



            {/* Booking Modal */}
            {showBookModal && selectedVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
                        <CardHeader className="border-b">
                            <CardTitle>Book {selectedVehicle.model}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={confirmBooking} className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-lg space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Base Price</span>
                                        <span className="font-medium">₹{selectedVehicle.basePrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Rate per km</span>
                                        <span className="font-medium">₹{selectedVehicle.costPerKm}</span>
                                    </div>
                                    <div className="h-px bg-slate-200 my-2"></div>
                                    <p className="text-xs text-slate-500 italic">Total fare will be calculated based on actual distance.</p>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pickup Location</label>
                                    <Input
                                        placeholder="Enter pickup address"
                                        value={bookingData.startLocation}
                                        onChange={(e) => setBookingData({ ...bookingData, startLocation: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Date</label>
                                            <Input
                                                type="date"
                                                value={bookingData.scheduledDate}
                                                onChange={(e) => setBookingData({ ...bookingData, scheduledDate: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Time</label>
                                            <Input
                                                type="time"
                                                value={bookingData.scheduledTime}
                                                onChange={(e) => setBookingData({ ...bookingData, scheduledTime: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Dropoff Location</label>
                                        <Input
                                            placeholder="Enter destination"
                                            value={bookingData.endLocation}
                                            onChange={(e) => setBookingData({ ...bookingData, endLocation: e.target.value })}
                                            required
                                        />
                                    </div>

                                <div className="flex gap-3 mt-6 pt-2">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowBookModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                                        Confirm Booking
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

export default CustomerDashboard;
