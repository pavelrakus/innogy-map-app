import { WeatherData } from '../types';

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m`
        );
        const data = await response.json();

        return {
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weather_code,
            windSpeed: data.current.wind_speed_10m
        };
    } catch (error) {
        console.error("Failed to fetch weather", error);
        throw error;
    }
}

export function getWeatherDescription(code: number): string {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    if (code === 0) return 'Jasno';
    if (code === 1) return 'Hlavně jasno';
    if (code === 2) return 'Polojasno';
    if (code === 3) return 'Zataženo';
    if (code >= 45 && code <= 48) return 'Mlha';
    if (code >= 51 && code <= 55) return 'Mrholení';
    if (code >= 61 && code <= 65) return 'Déšť';
    if (code >= 71 && code <= 75) return 'Sněžení';
    if (code >= 80 && code <= 82) return 'Přeháňky';
    if (code >= 95) return 'Bouřka';
    return 'Neznámé';
}
