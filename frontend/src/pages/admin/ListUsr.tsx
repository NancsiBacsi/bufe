import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/Pages.css";
import { TrashIcon, ArrowPathIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import { ErrorResponse, ListUsrResponse, Usr } from "../../types";
import { fetchJson, fetchVoid } from "utils/http";

interface Props {
  onLogout: () => void;
}
export default function ListUsr({ onLogout }:Props) {
  const [showActive, setShowActive] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [usrs, setUsrs] = useState<ListUsrResponse>({usrs:[]});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsrs = async () => {
      try {
        setLoading(true);
        const data: ListUsrResponse = 
              await fetchJson<ListUsrResponse>( `/api/usr/all/${showActive ? 1 : 0}`, { method: "POST", credentials: "include" } );
        setError(null);
        setUsrs(data);
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
    fetchUsrs();
  }, [showActive, forceRefresh, onLogout]);

  const saveUsr = async (usr: Usr) => {
    try {
      setLoading(true);
      await fetchVoid( "/api/usr/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify( usr ) } );
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
          &nbsp;Aktív felhasználók
        </label>
      </div>}
      {!error &&<ul className="page-list">
        <li key={-1}>
          <button className="page-list-button blue-button" onClick={() => navigate("/menu")}>Menü</button>
        </li>
        <li key={-2}>
          <button className="page-list-button green-button" onClick={() => navigate("/admin/bufe/-1" )}>Új felhasználó</button>
        </li>
        {usrs.usrs.map((usr) => (
          <li key={usr.id} className="page-list-complex-item">
            <button className="page-list-complex-button" disabled={!showActive}
                    onClick={() => navigate("/admin/usr/"+usr.id)}>{usr.nev}</button>
            {showActive&&<button className="page-list-complex-iconbutton"
                    onClick={() => {usr.aktiv=false;saveUsr(usr);}}>
              <TrashIcon className="red-icon" />
            </button>}
            {showActive&&<button className="page-list-complex-iconbutton"
                    onClick={() => {navigate(`/admin/usr/${usr.id}/bufe`);}}>
              <BuildingStorefrontIcon className="blue-icon" />
            </button>}
            {!showActive&&<button className="page-list-complex-iconbutton"
                    onClick={() => {usr.aktiv=true;saveUsr(usr);}}>
              <ArrowPathIcon className="green-icon" />
            </button>}
          </li>          
        ))}
      </ul>}
    </div>
  );
}