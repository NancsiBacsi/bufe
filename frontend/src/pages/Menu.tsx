import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import "./../styles/Pages.css";
import NevEsEgyenleg from "../components/NevEsEgyenleg";
import { BufeInfo, ErrorResponse, LoginResponse } from "../types";
import { fetchVoid } from "utils/http";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  onLogout: () => void;
}
export default function Menu({ loginResponse, selectedBufe, onLogout }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const isPenztaros: boolean = selectedBufe.penztaros;
  const isAdmin: boolean = loginResponse.admin;
  const navigate: NavigateFunction = useNavigate();

  const doLogout = async () => {
    try {
      setLoading(true);
      await fetchVoid( "/api/auth/logout",
        { method: "POST", credentials: "include" } );
      setError(null);
      onLogout();
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
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
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} msgEnd="Jó vásárlást!" forceRefresh={0} />
      {error && <p className="page-error">{error}</p>}      
      <ul className="page-list">
        <li><button className="page-list-button" onClick={() => navigate("/vasarlas")}>Vásárlás</button></li>
        <li><button className="page-list-button" onClick={() => navigate("/vasarlasvonalkod")}>Vásárlás vonalkóddal</button></li>
        <li><button className="page-list-button" onClick={() => navigate("/vasarlasnaplo")}>Napló</button></li>
        {isPenztaros && (<li><button className="page-list-button" >Bolt feltöltés</button></li>)}
        {isPenztaros && (<li><button className="page-list-button" >Számla feltöltés</button></li>)}
        {isPenztaros && (<li><button className="page-list-button" >Leltár</button></li>)}
        {isPenztaros && (<li><button className="page-list-button" >Bevásárló lista</button></li>)}

        {isAdmin && (<li><button className="page-list-button" onClick={() => navigate("/admin/termek")}>Termékek</button></li>)}
        {isAdmin && (<li><button className="page-list-button" onClick={() => navigate("/admin/usr")}>Felhasználók</button></li>)}
        {isAdmin && (<li><button className="page-list-button" onClick={() => navigate("/admin/bufe")}>Büfék</button></li>)}

        <li><button className="page-list-button" onClick={() => navigate("/changepassword")}>Jelszó változtatás</button></li>
        <li><button className="page-list-button" onClick={() => doLogout()}>Kilépés</button></li>
      </ul>
    </div>
  );
}
