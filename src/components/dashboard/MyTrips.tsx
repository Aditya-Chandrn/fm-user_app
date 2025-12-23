'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'sonner';

const MyTrips = () => {
    const { token } = useAuth();
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    // Filter for past trips (completed/cancelled)
                    setTrips(data.data.filter((t: any) => t.status === 'completed' || t.status === 'cancelled'));
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch trips");
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [token]);

    if (loading) return <div>Loading trips...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Trip History</h1>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-zinc-800 border-b">
                                <tr>
                                    <th className="p-4 font-medium text-slate-500">Date</th>
                                    <th className="p-4 font-medium text-slate-500">Route</th>
                                    <th className="p-4 font-medium text-slate-500">Vehicle</th>
                                    <th className="p-4 font-medium text-slate-500">Fare</th>
                                    <th className="p-4 font-medium text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-700">
                                {trips.map((trip) => (
                                    <tr key={trip._id} className="hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                                        <td className="p-4 text-slate-600 dark:text-slate-300">
                                            {new Date(trip.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-slate-400">{new Date(trip.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-800 dark:text-slate-200">{trip.startLocation}</div>
                                            <div className="text-xs text-slate-400">to</div>
                                            <div className="font-medium text-slate-800 dark:text-slate-200">{trip.endLocation}</div>
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400">
                                            {trip.vehicleId ? (
                                                <>
                                                    {trip.vehicleId.model}
                                                    <div className="text-xs opacity-75">{trip.vehicleId.registrationNumber}</div>
                                                </>
                                            ) : 'Unknown Vehicle'}
                                        </td>
                                        <td className="p-4 font-mono font-medium">
                                            ₹{trip.fare}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                                                ${trip.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {trip.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {trips.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">
                                            No trip history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyTrips;
