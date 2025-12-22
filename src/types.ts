export interface Branch {
    id: string;
    city: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    email: string;
    phone: string;
    openingHours: string[];
    description?: string;
}

export interface WeatherData {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
}

export interface RouteStats {
    distanceKm: number;
    timeMinutes: number;
}
