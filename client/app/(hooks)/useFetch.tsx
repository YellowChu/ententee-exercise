import axios from "@/app/(axios)";
import React from "react";

export const useFetch = <T extends any>(url: string) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(url);
      setData(data);
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}