import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { fetchWeather, getWeatherDescription } from '../lib/weather';
import { WeatherData } from '../types';

interface Props {
    lat: number;
    lng: number;
}

export const WeatherWidget: React.FC<Props> = ({ lat, lng }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchWeather(lat, lng)
            .then(setWeather)
            .catch(() => setWeather(null))
            .finally(() => setLoading(false));
    }, [lat, lng]);

    if (loading) return <div className="text-gray-500 text-sm">Načítání počasí...</div>;
    if (!weather) return <div className="text-red-500 text-sm">Počasí nedostupné</div>;

    const description = getWeatherDescription(weather.weatherCode);

    return (
        <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 mt-4">
            <div className="text-blue-600">
                {weather.weatherCode <= 1 ? <Sun /> :
                    weather.weatherCode <= 3 ? <Cloud /> :
                        weather.weatherCode >= 71 ? <CloudSnow /> : <CloudRain />}
            </div>
            <div>
                <div className="font-bold text-gray-800">{weather.temperature}°C</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <span>{description}</span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="flex items-center gap-1"><Wind size={12} /> {weather.windSpeed} km/h</span>
                </div>
            </div>
        </div>
    );
};
