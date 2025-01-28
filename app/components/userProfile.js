import { useEffect, useState } from "react";

export function useUser() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch('/api/users')
      .then(response => {
        // Check if the response has valid JSON content
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        // Ensure the response is not empty before parsing
        return response.text().then(text => {
          if (text) {
            return JSON.parse(text); // Parse only if content is not empty
          } else {
            return {}; // Return an empty object or default value
          }
        });
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        setLoading(false); // Stop loading in case of an error
      });
  }, []);

  return { loading, data };
}
