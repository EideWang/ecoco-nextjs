import { useState, useEffect } from "react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface UseUserLocationState {
  location: UserLocation | null;
  loading: boolean;
  error: GeolocationPositionError | Error | null;
}

/**
 * A custom React hook to get the user's geolocation.
 *
 * @returns {UseUserLocationState} An object containing the location, loading state, and any errors.
 * - `location`: An object with `latitude` and `longitude`, or `null` if not available.
 * - `loading`: A boolean indicating if the location is being fetched.
 * - `error`: A `GeolocationPositionError` or `Error` object if something went wrong, otherwise `null`.
 */
export const useUserLocation = (): UseUserLocationState => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<GeolocationPositionError | Error | null>(
    null
  );

  useEffect(() => {
    // Check if the Geolocation API is supported by the browser.
    if (!navigator.geolocation) {
      setError(new Error("您的瀏覽器不支援地理位置功能"));
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log("成功取得位置:", userLocation);
      setLocation(userLocation);
      setLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(err);
      setLoading(false);
    };

    const options: PositionOptions = {
      enableHighAccuracy: true, // Request high accuracy
      timeout: 10000, // 10 seconds timeout
      maximumAge: 0, // Do not use a cached position
    };

    // Request the user's current position.
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    );
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts.

  return { location, loading, error };
};
