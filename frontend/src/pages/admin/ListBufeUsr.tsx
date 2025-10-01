import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../../styles/Pages.css";
import { TrashIcon,  CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { ErrorResponse, BufeUsr, ListUsrResponse, Usr } from "../../types";
import { fetchJson, fetchVoid } from "utils/http";

interface Props {
  onLogout: () => void;
}
export default function ListBufeUsr({ onLogout }:Props) {
  const { bufeId } = useParams<{ bufeId: string }>();
  const [showActive, setShowActive] = useState<boolean>(false);
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
              await fetchJson<ListUsrResponse>( `/api/bufe/${bufeId}/usrs/${showActive ? 1 : 0}`, { method: "POST", credentials: "include" } );
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

  const saveBufeUsr = async (bufeUsr: BufeUsr) => {
    try {
      setLoading(true);
      await fetchVoid( "/api/bufeusr/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify( bufeUsr ) } );
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
          &nbsp;Büfé kapcsolat aktív
        </label>
      </div>}
      {!error &&<ul className="page-list">
        <li key={-1}>
          <button className="page-list-new-button" onClick={() => navigate("/admin/bufe/-1" )}>Új büfé</button>
        </li>
        {usrs.usrs.map((usr) => (
          <li key={usr.id} className="page-list-complex-item">
            <button className="page-list-complex-button" disabled={true}>{usr.nev}</button>
            {showActive&&usr.bufeUsr&&usr.bufeUsr.aktiv&&<button className="page-list-complex-iconbutton"
                    onClick={() => {usr.bufeUsr.aktiv=false;saveBufeUsr(usr.bufeUsr);}}>
              <TrashIcon className="red-icon" />
            </button>}
            {!showActive&&usr.bufeUsr&&usr.bufeUsr.id&&<button className="page-list-complex-iconbutton"
                    onClick={() => {usr.bufeUsr.aktiv=true;saveBufeUsr(usr.bufeUsr);}}>
              <CheckIcon className="green-icon" />
            </button>}
            {!showActive&&usr.bufeUsr&&usr.bufeUsr.id&&<button className="page-list-complex-iconbutton"
                    onClick={() => {usr.bufeUsr.aktiv=true;saveBufeUsr(usr.bufeUsr);}}>
              <CheckIcon className="green-icon" />
            </button>}
          </li>          
        ))}
      </ul>}
    </div>
  );
}