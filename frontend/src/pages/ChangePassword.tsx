import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Pages.css";
import { ChangePasswordRequest, ErrorResponse } from "./../types";
import { fetchVoid } from "utils/http";

interface Props {
  onLogout: () => void;
}
export default function ChangePassword({ onLogout }:Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [elozoJelszo, setElozoJelszo] = useState<string>("");
  const [ujJelszo, setUjJelszo] = useState<string>("");
  const [ujJelszo2, setUjJelszo2] = useState<string>("");
  const [error, setError] = useState<string|null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const req:ChangePasswordRequest={ elozoJelszo, ujJelszo, ujJelszo2 };
      await fetchVoid( "/api/auth/changepassword",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) });
      setError(null);
      navigate("/menu");
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.message);
      if( error.error==="UNAUTHORIZED" )
        onLogout();
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
      <h2 className="page-title">Jelszó változtatás</h2>
      {error && <p className="page-error">{error}</p>}
      <form className="page-form" onSubmit={handleSubmit}>
        <input type="password" placeholder="Előző jelszó"
          value={elozoJelszo} onChange={(e) => setElozoJelszo(e.target.value)} required
        />
        <input type="password" placeholder="Új jelszó"
          value={ujJelszo} onChange={(e) => setUjJelszo(e.target.value)} required
        />
        <input type="password" placeholder="Új jelszó ismét"
          value={ujJelszo2} onChange={(e) => setUjJelszo2(e.target.value)} required
        />
        <button type="submit">Mentés</button>
        <button className="blue-button" onClick={() => navigate("/menu")}>Menü</button>
      </form>
    </div>
  );
}