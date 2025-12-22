import { RouteStats } from '../types';

interface OSRMResponse {
    routes: Array<{
        geometry: {
            coordinates: number[][]; // [lng, lat]
        };
        duration: number; // seconds
        distance: number; // meters
    }>;
}

export interface RouteResult {
    coordinates: [number, number][]; // [lat, lng] for Leaflet
    stats: RouteStats;
}

export async function fetchRoute(
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
): Promise<RouteResult | null> {
    try {
        // OSRM expects "lng,lat"
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch route');

        const data: OSRMResponse = await response.json();

        if (!data.routes || data.routes.length === 0) return null;

        const route = data.routes[0];

        // Convert [lng, lat] to [lat, lng] for Leaflet
        const coordinates = route.geometry.coordinates.map(
            (coord) => [coord[1], coord[0]] as [number, number]
        );

        return {
            coordinates,
            stats: {
                distanceKm: Number((route.distance / 1000).toFixed(1)),
                timeMinutes: Math.round(route.duration / 60)
            }
        };
    } catch (error) {
        console.error('Routing error:', error);
        return null;
    }
}
