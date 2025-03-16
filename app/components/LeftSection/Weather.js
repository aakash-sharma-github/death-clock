'use client';
import { useState, useEffect } from 'react';
import { FiMapPin, FiLoader } from 'react-icons/fi';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiDust, WiNightClear, WiNightCloudy } from 'react-icons/wi';
import { RiMistFill } from 'react-icons/ri';

export default function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [position, setPosition] = useState(null);
    const [usedProxy, setUsedProxy] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Get user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setPosition({
                            lat: pos.coords.latitude,
                            lon: pos.coords.longitude
                        });
                    },
                    (err) => {
                        console.error("Error getting location:", err);
                        setError("Unable to get your location. Please enable location services.");
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (position) {
            fetchWeatherData();
        }
    }, [position]);

    const fetchWeatherData = async () => {
        try {
            // Using OpenWeatherMap API if available
            const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
            const API_ENDPOINT = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_ENDPOINT;
            const API_UNIT = process.env.NEXT_PUBLIC_OPENWEATHERMAP_UNITS;

            if (!API_KEY && !API_ENDPOINT && !API_UNIT) {
                setError("OpenWeatherMap API key or endpoint are not available.");
                setLoading(false);
                return;
            } else if (API_KEY) {
                try {
                    const directUrl = `${API_ENDPOINT}?lat=${position.lat}&lon=${position.lon}&units=${API_UNIT}&appid=${API_KEY}`;
                    let response;

                    // First try direct API call
                    if (!usedProxy) {
                        try {
                            response = await fetch(directUrl);
                            if (response.ok) {
                                const data = await response.json();
                                setWeatherData(data);
                                setLoading(false);
                                return;
                            }
                        } catch (corsError) {
                            console.error("Direct API call failed, trying proxy:", corsError);
                            setUsedProxy(true);
                        }
                    }

                    // If direct call fails, try using our proxy
                    const encodedUrl = encodeURIComponent(directUrl);
                    response = await fetch(`/api/proxy?url=${encodedUrl}`);

                    if (response.ok) {
                        const data = await response.json();
                        setWeatherData(data);
                        setLoading(false);
                        return;
                    }
                } catch (err) {
                    console.error("OpenWeatherMap API failed:", err);
                    // Continue to fallback API
                }
            }

            // Fallback to free API if OpenWeather API key is not available or request fails
            try {
                const api_key = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
                const api_endpoint = process.env.NEXT_PUBLIC_OPENWEATHER_API_ENDPOINT;
                const fallbackUrl = `${api_endpoint}?key=${api_key}&q=${position.lat},${position.lon}&aqi=no`;
                let response;

                // First try direct API call
                if (!usedProxy) {
                    try {
                        response = await fetch(fallbackUrl);
                        if (response.ok) {
                            const data = await response.json();
                            processWeatherAPIData(data);
                            return;
                        }
                    } catch (corsError) {
                        console.error("Direct fallback API call failed, trying proxy:", corsError);
                        setUsedProxy(true);
                    }
                }

                // If direct call fails, try using our proxy
                const encodedUrl = encodeURIComponent(fallbackUrl);
                response = await fetch(`/api/proxy?url=${encodedUrl}`);

                if (response.ok) {
                    const data = await response.json();
                    processWeatherAPIData(data);
                    return;
                }

                throw new Error(`Weather API error: ${response.status}`);
            } catch (err) {
                throw err; // Re-throw to be caught by the outer catch block
            }
        } catch (err) {
            console.error("Error fetching weather data:", err);
            setError("Unable to fetch weather data. Please try again later.");
            setLoading(false);
        }
    };

    const processWeatherAPIData = (data) => {
        // Transform WeatherAPI data to match OpenWeatherMap format for compatibility
        const transformedData = {
            name: data.location.name,
            sys: {
                country: data.location.country,
                sunrise: new Date(data.location.localtime_epoch * 1000).setHours(6, 0, 0) / 1000,
                sunset: new Date(data.location.localtime_epoch * 1000).setHours(18, 0, 0) / 1000
            },
            main: {
                temp: data.current.temp_c,
                feels_like: data.current.feelslike_c,
                humidity: data.current.humidity
            },
            weather: [
                {
                    id: mapConditionCodeToOpenWeatherCode(data.current.condition.code),
                    description: data.current.condition.text.toLowerCase()
                }
            ],
            wind: {
                speed: data.current.wind_kph / 3.6, // Convert km/h to m/s
            }
        };

        setWeatherData(transformedData);
        setLoading(false);
    };

    // Map WeatherAPI condition codes to OpenWeatherMap codes for icon compatibility
    const mapConditionCodeToOpenWeatherCode = (code) => {
        // Map common weather conditions to OpenWeatherMap codes
        const conditionMap = {
            1000: 800, // Clear -> Clear
            1003: 801, // Partly cloudy -> Few clouds
            1006: 802, // Cloudy -> Scattered clouds
            1009: 803, // Overcast -> Broken clouds
            1030: 741, // Mist -> Mist
            1063: 500, // Patchy rain -> Light rain
            1066: 600, // Patchy snow -> Light snow
            1069: 511, // Patchy sleet -> Freezing rain
            1087: 200, // Thundery outbreaks -> Thunderstorm with light rain
            1114: 601, // Blowing snow -> Snow
            1117: 602, // Blizzard -> Heavy snow
            1135: 701, // Fog -> Mist
            1147: 741, // Freezing fog -> Mist
            1150: 300, // Patchy light drizzle -> Light intensity drizzle
            1153: 301, // Light drizzle -> Drizzle
            1168: 511, // Freezing drizzle -> Freezing rain
            1171: 511, // Heavy freezing drizzle -> Freezing rain
            1180: 500, // Patchy light rain -> Light rain
            1183: 500, // Light rain -> Light rain
            1186: 501, // Moderate rain -> Moderate rain
            1189: 501, // Moderate rain -> Moderate rain
            1192: 502, // Heavy rain -> Heavy rain
            1195: 502, // Heavy rain -> Heavy rain
            1198: 511, // Light freezing rain -> Freezing rain
            1201: 511, // Moderate/heavy freezing rain -> Freezing rain
            1204: 611, // Light sleet -> Sleet
            1207: 611, // Moderate/heavy sleet -> Sleet
            1210: 600, // Patchy light snow -> Light snow
            1213: 600, // Light snow -> Light snow
            1216: 601, // Patchy moderate snow -> Snow
            1219: 601, // Moderate snow -> Snow
            1222: 602, // Patchy heavy snow -> Heavy snow
            1225: 602, // Heavy snow -> Heavy snow
            1237: 511, // Ice pellets -> Freezing rain
            1240: 500, // Light rain shower -> Light rain
            1243: 501, // Moderate/heavy rain shower -> Moderate rain
            1246: 502, // Torrential rain shower -> Heavy rain
            1249: 511, // Light sleet showers -> Freezing rain
            1252: 511, // Moderate/heavy sleet showers -> Freezing rain
            1255: 600, // Light snow showers -> Light snow
            1258: 601, // Moderate/heavy snow showers -> Snow
            1261: 511, // Light showers of ice pellets -> Freezing rain
            1264: 511, // Moderate/heavy showers of ice pellets -> Freezing rain
            1273: 200, // Patchy light rain with thunder -> Thunderstorm with light rain
            1276: 201, // Moderate/heavy rain with thunder -> Thunderstorm with rain
            1279: 600, // Patchy light snow with thunder -> Light snow
            1282: 602, // Moderate/heavy snow with thunder -> Heavy snow
        };

        return conditionMap[code] || 800; // Default to clear if code not found
    };

    const getWeatherIcon = (weatherCode, isNight) => {
        // Weather code reference: https://openweathermap.org/weather-conditions
        if (weatherCode >= 200 && weatherCode < 300) {
            return <WiThunderstorm className="weather-icon" />;
        } else if (weatherCode >= 300 && weatherCode < 400) {
            return <WiRain className="weather-icon" />;
        } else if (weatherCode >= 500 && weatherCode < 600) {
            return <WiRain className="weather-icon" />;
        } else if (weatherCode >= 600 && weatherCode < 700) {
            return <WiSnow className="weather-icon" />;
        } else if (weatherCode >= 700 && weatherCode < 800) {
            return weatherCode === 741 ? <RiMistFill className="weather-icon" /> : <WiDust className="weather-icon" />;
        } else if (weatherCode === 800) {
            return isNight ? <WiNightClear className="weather-icon" /> : <WiDaySunny className="weather-icon" />;
        } else if (weatherCode > 800) {
            return isNight ? <WiNightCloudy className="weather-icon" /> : <WiCloudy className="weather-icon" />;
        }
        return <WiDaySunny className="weather-icon" />;
    };

    const isNightTime = () => {
        if (!weatherData) return false;
        const now = Date.now() / 1000; // current time in seconds
        return now < weatherData.sys.sunrise || now > weatherData.sys.sunset;
    };

    if (loading) {
        return (
            <div className="weather-card loading">
                <FiLoader className="loading-icon" />
                <p>Loading weather data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="weather-card error">
                <p>{error}</p>
            </div>
        );
    }

    if (!weatherData) {
        return null;
    }

    return (
        <div className="weather-card">
            <div className="weather-main">
                {getWeatherIcon(weatherData.weather[0].id, isNightTime())}
                <div className="weather-info">
                    <div className="weather-temp">
                        {Math.round(weatherData.main.temp)}°C
                    </div>
                    <div className="weather-description">
                        {weatherData.weather[0].description}
                    </div>
                </div>
            </div>
            <div className="weather-location">
                <FiMapPin className="location-icon" />
                <span>{weatherData.name}, {weatherData.sys.country}</span>
            </div>
            <div className="weather-details">
                <div className="weather-detail">
                    <span className="detail-label">Feels like</span>
                    <span className="detail-value">{Math.round(weatherData.main.feels_like)}°C</span>
                </div>
                <div className="weather-detail">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{weatherData.main.humidity}%</span>
                </div>
                <div className="weather-detail">
                    <span className="detail-label">Wind</span>
                    <span className="detail-value">{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
                </div>
            </div>
        </div>
    );
} 