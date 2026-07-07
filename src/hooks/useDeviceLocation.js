import { useState, useEffect, useCallback } from "react";

export const useDeviceLocation = (autoFetch = true) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  // Monitor permission state
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          setPermissionStatus(status.state);
          status.onchange = () => {
            setPermissionStatus(status.state);
          };
        })
        .catch((err) => {
          console.warn("Could not query geolocation permission:", err);
        });
    }
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let errMsg = "Unable to retrieve location";
        if (err.code === err.PERMISSION_DENIED) {
          errMsg = "Location permission denied";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errMsg = "Location information is unavailable";
        } else if (err.code === err.TIMEOUT) {
          errMsg = "Location request timed out";
        }
        setError(errMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute cache
      }
    );
  }, []);

  useEffect(() => {
    if (autoFetch) {
      getLocation();
    }
  }, [autoFetch, getLocation]);

  return {
    location,
    loading,
    error,
    permissionStatus,
    getLocation,
  };
};
