import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/Pages.css";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { ListTermekResponse, ErrorResponse, Termek } from "../../types";
import { fetchJson, fetchVoid } from "utils/http";

interface Props {
  onLogout: () => void;
}
export default function ListTermek({ onLogout }:Props) {
  const [showActive, setShowActive] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [termekek, setTermekek] = useState<ListTermekResponse>({termekek:[]});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTermekek = async () => {
      try {
        setLoading(true);
        const data: ListTermekResponse = 
              await fetchJson<ListTermekResponse>( `/api/termek/all/${showActive ? 1 : 0}`, { method: "POST", credentials: "include" } );
        setError(null);
        setTermekek(data);
        setLoading(false);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchTermekek();
  }, [showActive, forceRefresh, onLogout]);

  const saveTermek = async (termek: Termek) => {
    try {
      setLoading(true);
      await fetchVoid( "/api/termek/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify( termek ) } );
      setForceRefresh( forceRefresh+1 );
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
      {error &&<p className="page-error">{error}</p>}
      {!error &&<div className="page-header page-center">
        <label>
          <input type="checkbox" checked={showActive} onChange={(e) => setShowActive(e.target.checked)}/>
          &nbsp;Aktív termékek
        </label>
      </div>}
      {!error &&<ul className="page-list">
        <li key={-1}>
          <button className="page-list-new-button" onClick={() => navigate("/admin/termek/-1" )}>Új termék</button>
        </li>
        {termekek.termekek.map((termek) => (
          <li key={termek.id} className="page-list-complex-item">
            <button className="page-list-complex-button" disabled={!showActive}
                    onClick={() => navigate("/admin/termek/"+termek.id)}>{termek.nev}</button>
            {showActive&&<button className="page-list-complex-iconbutton"
                    onClick={() => {termek.aktiv=false;saveTermek(termek);}}>
              <TrashIcon className="red-icon" />
            </button>}
            {!showActive&&<button className="page-list-complex-iconbutton"
                    onClick={() => {termek.aktiv=true;saveTermek(termek);}}>
              <ArrowPathIcon className="green-icon" />
            </button>}
          </li>          
        ))}
      </ul>}
    </div>
  );
}