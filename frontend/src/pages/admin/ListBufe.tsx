import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/Pages.css";
import { TrashIcon, ArrowPathIcon, UsersIcon } from "@heroicons/react/24/solid";
import { ListBufeResponse, ErrorResponse, Bufe } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";

interface Props {
  clearSession: () => void;
}
export default function ListBufe({ clearSession: onLogout }:Props) {
  const [showActive, setShowActive] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [bufek, setBufek] = useState<ListBufeResponse>({bufek:[]});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBufe = async () => {
      try {
        setLoading(true);
        const data: ListBufeResponse = 
              await fetchJson<ListBufeResponse>( `/api/bufe/all/${showActive ? 1 : 0}`, { method: "POST", credentials: "include" } );
        setError(null);
        setBufek(data);
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
    fetchBufe();
  }, [showActive, forceRefresh, onLogout]);

  const saveBufe = async (bufe: Bufe) => {
    try {
      setLoading(true);
      await fetchVoid( "/api/bufe/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify( bufe ) } );
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
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      {error &&<p className="page-error">{error}</p>}
      {!error &&<div className="page-header page-center">
        <label>
          <input type="checkbox" checked={showActive} onChange={(e) => setShowActive(e.target.checked)}/>
          &nbsp;Aktív büfék
        </label>
      </div>}
      {!error &&<ul className="page-list">
        <li key={-1}>
          <button className="page-list-button green-button" onClick={() => navigate("/admin/bufe/-1" )}>Új büfé</button>
        </li>
        {bufek.bufek.map((bufe) => (
          <li key={bufe.id} className="page-list-complex-item">
            <button className="page-list-complex-button" disabled={!showActive}
                    onClick={() => navigate("/admin/bufe/"+bufe.id)}>{bufe.nev}</button>
            {showActive&&<button className="page-list-complex-iconbutton"
                    onClick={() => {bufe.aktiv=false;saveBufe(bufe);}}>
              <TrashIcon className="red-icon" />
            </button>}
            {showActive&&<button className="page-list-complex-iconbutton"
                    onClick={() => {navigate("/admin/bufe/"+bufe.id+"/user");}}>
              <UsersIcon className="blue-icon" />
            </button>}
            {!showActive&&<button className="page-list-complex-iconbutton"
                    onClick={() => {bufe.aktiv=true;saveBufe(bufe);}}>
              <ArrowPathIcon className="green-icon" />
            </button>}
          </li>          
        ))}
      </ul>}
    </PageContainer>
  );
}