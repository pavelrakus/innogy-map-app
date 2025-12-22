import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BRANCHES } from '../data/branches';
import { Branch, RouteStats } from '../types';
import { fetchRoute } from '../lib/routing';

// Fix for default Leaflet icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// Start Point: Plynární 2748/6, 70200 Ostrava
const START_POINT = { lat: 49.8436, lng: 18.2778 };

interface Props {
    onBranchSelect: (branch: Branch) => void;
    selectedBranch: Branch | null;
    routingEnabled: boolean;
    onRouteFound: (stats: RouteStats) => void;
}

const RouteLayer = ({
    start,
    end,
    onRouteFound
}: {
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    onRouteFound: (s: RouteStats) => void
}) => {
    const map = useMap();
    const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
    const fetchedRef = useRef<string>('');

    useEffect(() => {
        const routeKey = `${start.lat}-${start.lng}-${end.lat}-${end.lng}`;

        // Prevent refetching if same route
        if (fetchedRef.current === routeKey) return;

        fetchRoute(start, end).then(result => {
            if (result) {
                fetchedRef.current = routeKey;
                setRoutePositions(result.coordinates);
                onRouteFound(result.stats);

                const bounds = L.latLngBounds(result.coordinates);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        });

    }, [start.lat, start.lng, end.lat, end.lng, map, onRouteFound]);

    if (routePositions.length === 0) return null;

    return (
        <Polyline
            positions={routePositions}
            pathOptions={{ color: '#2563EB', weight: 6, opacity: 0.8 }}
        />
    );
};

const MapController = ({ selectedBranch }: { selectedBranch: Branch | null }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedBranch) {
            map.setView([selectedBranch.lat, selectedBranch.lng], 13, {
                animate: true,
                duration: 1.5
            });
        }
    }, [selectedBranch, map]);

    return null;
};

export const MapComponent: React.FC<Props> = ({ onBranchSelect, selectedBranch, routingEnabled, onRouteFound }) => {
    const defaultCenter: [number, number] = [49.8, 15.5];
    const defaultZoom = 8;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            className="w-full h-full z-0"
            zoomControl={true} // Enabled Zoom Control
            scrollWheelZoom={true} // Enabled Scroll
            doubleClickZoom={true} // Enabled Double Click
            dragging={true} // Enabled Dragging
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {BRANCHES.map((branch) => (
                <Marker
                    key={branch.id}
                    position={[branch.lat, branch.lng]}
                    eventHandlers={{
                        click: () => onBranchSelect(branch),
                    }}
                />
            ))}

            <Marker
                position={[START_POINT.lat, START_POINT.lng]}
                icon={L.divIcon({
                    className: 'bg-transparent',
                    html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })}
                title="Start: Plynární 2748/6"
            />

            <MapController selectedBranch={selectedBranch} />

            {routingEnabled && selectedBranch && (
                <RouteLayer
                    start={START_POINT}
                    end={{ lat: selectedBranch.lat, lng: selectedBranch.lng }}
                    onRouteFound={onRouteFound}
                />
            )}
        </MapContainer>
    );
};
