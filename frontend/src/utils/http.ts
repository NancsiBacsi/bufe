import { API_BASE_URL } from "./../constants";
import { ErrorResponse } from "./../types";

export async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const apiBaseUrl = API_BASE_URL || "";
  const res = await fetch(`${apiBaseUrl}${url}`, options);
  if (res.ok) {
    return (await res.json()) as T;
  } else if( res.status===401 || res.status===500 ) {
   const errData: ErrorResponse = await res.json().catch(() => ({
      success: false,
      error: "UNKNOWN_ERROR",
      message: "Hiba a szerver válaszában",
    }));
    throw errData;
  } else {
    const errData: ErrorResponse = {
      success: false,
      error: "HTTP_ERROR",
      message: "http hiba: " + res.status,
    };
    throw errData;
  }
}

export async function fetchVoid(url: string, options?: RequestInit): Promise<void> {
  const apiBaseUrl = API_BASE_URL || "";
  const res = await fetch(`${apiBaseUrl}${url}`, options);
  if (res.ok) {
    return;
  } else if( res.status===500 || res.status===401 ) {
    const errData: ErrorResponse = await res.json().catch(() => ({
      success: false,
      error: "UNKNOWN_ERROR",
      message: "Hiba a szerver válaszában",
    }));
    throw errData;
  } else {
    const errData: ErrorResponse = {
      success: false,
      error: "HTTP_ERROR",
      message: "http hiba: " + res.status,
    };
    throw errData;
  }
}