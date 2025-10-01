import { useState, FormEvent } from "react";
import "./../styles/Pages.css";
import "./../styles/Overlay.css";
import { LoginRequest, LoginResponse, ErrorResponse } from "./../types";
import { fetchJson, fetchVoid } from "utils/http";

interface Props {
  onLogin: (loginResponse: LoginResponse) => void;
}
export default function Login({ onLogin }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [nev, setNev] = useState<string>("");
  const [jelszo, setJelszo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const req: LoginRequest = { nev, jelszo };
      const loginResponse: LoginResponse = await fetchJson<LoginResponse>( "/api/auth/login",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) } );
      setError(null);
      if( loginResponse.bufeInfos.length===1 )
        selectFirstBufe( loginResponse );
      else
        onLogin(loginResponse);
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const selectFirstBufe = async ( loginResponse: LoginResponse ) => {
    try {
      setLoading(true);
      await fetchVoid( `/api/auth/selectbufe/${loginResponse.bufeInfos[0].bufeId}`,
        { method: "POST", credentials: "include" } );
      setError(null);
      onLogin( loginResponse );
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="page-container">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}      
      <h2 className="page-title">Bejelentkezés</h2>
      {error && <p className="page-error">{error}</p>}
      <form className="page-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Felhasználó név"
          value={nev} onChange={(e) => setNev(e.target.value)} required
        />
        <input
          type="password" placeholder="Jelszó"
          value={jelszo} onChange={(e) => setJelszo(e.target.value)} required
        />
        <button type="submit">Belépés</button>
      </form>
    </div>
  );
}