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
        <div className="fixed 
            md:left-4 md:top-4 md:bottom-4 md:w-96 md:rounded-xl
            bottom-0 left-0 right-0 max-h-[75vh] rounded-t-3xl md:rounded-b-xl
            bg-white shadow-2xl z-[1000] 
            md:p-6 p-4 pb-safe
            overflow-y-auto transform transition-transform duration-300 ease-in-out animate-slide-up">

            {/* Mobile drag handle */}
            <div className="md:hidden flex justify-center mb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
                <X size={24} />
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-innogy-blue mb-1 pr-8">{branch.city}</h2>
            <h3 className="text-base md:text-lg text-gray-600 mb-4 md:mb-6">{branch.name}</h3>

            <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3">
                    <MapPin className="text-green-600 mt-1 shrink-0" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base">Adresa</h4>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">{branch.address}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Clock className="text-green-600 mt-1 shrink-0" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base">Otevírací doba</h4>
                        <ul className="text-gray-600 space-y-0.5 text-sm md:text-base">
                            {branch.openingHours.map((hours, index) => (
                                <li key={index}>{hours}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Phone className="text-green-600 mt-1 shrink-0" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base">Kontakt</h4>
                        <p className="text-gray-600 text-sm md:text-base">{branch.phone}</p>
                        <a href={`mailto:${branch.email}`} className="text-blue-600 hover:underline text-sm md:text-base break-all">{branch.email}</a>
                    </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Počasí v lokalitě</h4>
                    <WeatherWidget lat={branch.lat} lng={branch.lng} />
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onRouteClick}
                        className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm md:text-base ${routeActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                    >
                        <Navigation size={20} />
                        <span className="hidden md:inline">{routeActive ? 'Zrušit trasu' : 'Naplánovat trasu z Ostravy'}</span>
                        <span className="md:hidden">{routeActive ? 'Zrušit' : 'Naplánovat trasu'}</span>
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
