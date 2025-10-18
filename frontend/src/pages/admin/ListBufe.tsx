import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/Pages.css";
import { TrashIcon, ArrowPathIcon, UsersIcon } from "@heroicons/react/24/solid";
import { ListBufeResponse, ErrorResponse, Bufe } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import { ListContainer } from "components/ListContainer";
import ListButton from "components/ListButton";
import { ListComplexButtonContainer } from "components/ListComplexButtonContainer";
import IconButton from "components/IconButton";

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
      {!error &&
        <ListContainer
          title="Büfék"
          error={error}
          beforeList={!error &&
            <div className="page-header text-center">
              <label>
                <input
                  type="checkbox"
                  checked={showActive}
                  onChange={(e) => setShowActive(e.target.checked)}
                />
                &nbsp;Aktív büfék
              </label>
            </div>
          }
        >
          <ListButton
            key={-1}
            title="Új büfé"
            className="bg-green-600 hover:bg-green-400"
            onClick={() => navigate("/admin/bufe/-1" )}
          />
          {bufek.bufek.map((bufe) => (
            <ListComplexButtonContainer key={bufe.id}>
                <ListButton
                  title={bufe.nev}
                  key={1}
                  disabled={!showActive}
                  onClick={() => navigate("/admin/bufe/"+bufe.id)}
                />
                {showActive &&
                  <IconButton 
                    key={2}
                    icon={
                      <TrashIcon className="w-5 h-5 red-600"/>
                    }
                    onClick={() => {bufe.aktiv=false;saveBufe(bufe);}}
                    title="Törlés"
                  />
                }
                {showActive &&               
                  <IconButton 
                    key={3}
                    icon={
                      <UsersIcon className="w-5 h-5 blue-600" />
                    }
                    onClick={() => {navigate(`/admin/bufe/${bufe.id}/user`);}}
                    title="felhasználók"
                  />    
                }
                {showActive &&               
                  <IconButton 
                    key={4}
                    icon={
                      <ArrowPathIcon className="w-5 h-5 green-600" />
                    }
                    onClick={() => {bufe.aktiv=true;saveBufe(bufe);}}
                    title="Reaktiválás"
                  />    
                }                
            </ListComplexButtonContainer>
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}