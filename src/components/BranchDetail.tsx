import React from 'react';
import { X, MapPin, Clock, Phone, Navigation, Car } from 'lucide-react';
import { Branch, RouteStats } from '../types';
import { WeatherWidget } from './WeatherWidget';

interface Props {
    branch: Branch | null;
    onClose: () => void;
    onRouteClick: () => void;
    routeActive: boolean;
    routeStats: RouteStats | null;
}

export const BranchDetail: React.FC<Props> = ({
    branch,
    onClose,
    onRouteClick,
    routeActive,
    routeStats
}) => {
    if (!branch) return null;

    return (
        <div className="fixed left-4 top-4 bottom-4 w-96 bg-white shadow-2xl rounded-xl z-[1000] p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-innogy-blue mb-1">{branch.city}</h2>
            <h3 className="text-lg text-gray-600 mb-6">{branch.name}</h3>

            <div className="space-y-6">
                <div className="flex items-start gap-3">
                    <MapPin className="text-green-600 mt-1 shrink-0" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-800">Adresa</h4>
                        <p className="text-gray-600 leading-relaxed">{branch.address}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Clock className="text-green-600 mt-1 shrink-0" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-800">Otevírací doba</h4>
                        <ul className="text-gray-600 space-y-1">
                            {branch.openingHours.map((hours, index) => (
                                <li key={index}>{hours}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Phone className="text-green-600 mt-1 shrink-0" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-800">Kontakt</h4>
                        <p className="text-gray-600">{branch.phone}</p>
                        <a href={`mailto:${branch.email}`} className="text-blue-600 hover:underline">{branch.email}</a>
                    </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Počasí v lokalitě</h4>
                    <WeatherWidget lat={branch.lat} lng={branch.lng} />
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onRouteClick}
                        className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${routeActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                    >
                        <Navigation size={20} />
                        {routeActive ? 'Zrušit trasu' : 'Naplánovat trasu z Ostravy'}
                    </button>

                    {routeActive && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 animate-fade-in">
                            {!routeStats ? (
                                <div className="flex items-center gap-2 text-blue-600">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                    <span>Výpočet trasy...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                            <Car size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Doba jízdy</div>
                                            <div className="font-bold text-gray-800 text-lg">{routeStats.timeMinutes} min</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Vzdálenost</div>
                                        <div className="font-bold text-gray-800 text-lg">{routeStats.distanceKm} km</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
