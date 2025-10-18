import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/Pages.css";
import { TrashIcon, ArrowPathIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import { ErrorResponse, ListUsrResponse, Usr } from "types";
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
export default function ListUsr({ clearSession: onLogout }:Props) {
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
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      {!error &&
        <ListContainer
          title="Felhasználók"
          error={error}
          beforeList={!error &&
            <div className="page-header text-center">
              <label>
                <input type="checkbox" checked={showActive} onChange={(e) => setShowActive(e.target.checked)}/>
                &nbsp;Aktív felhasználók
              </label>
            </div>
          }        
        >
          <ListButton
            key={-1}
            title="Új felhasználó"
            className="bg-green-600 hover:bg-green-400"
            onClick={() => navigate("/admin/usr/-1" )}
          />
          {usrs.usrs.map((usr) => (
            <ListComplexButtonContainer key={usr.id}>
              <ListButton
                key={1}
                title={usr.nev}
                disabled={!showActive}
                onClick={() => navigate("/admin/usr/"+usr.id)}
              />
              {showActive &&
                <IconButton
                  key={2}
                  title="Törlés"
                  icon={
                    <TrashIcon className="w-5 h-5 red-600"/>
                  }
                  onClick={() => {usr.aktiv=false;saveUsr(usr);}}
                />
              }
              {showActive &&
                <IconButton
                  key={3}
                  title="Büfék"
                  icon={
                    <BuildingStorefrontIcon className="w-5 h-5 blue-600"/>
                  }
                  onClick={() => {navigate(`/admin/usr/${usr.id}/bufe`);}}
                />
              }
              {!showActive &&
                <IconButton
                  key={4}
                  title="Reaktiválás"
                  icon={
                    <ArrowPathIcon className="w-5 h-5 green-600"/>
                  }
                  onClick={() => {usr.aktiv=true;saveUsr(usr);}}
                />
              }
            </ListComplexButtonContainer>     
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}