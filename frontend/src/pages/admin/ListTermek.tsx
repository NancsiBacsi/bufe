import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/Pages.css";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { ListTermekResponse, ErrorResponse, Termek, LoginResponse, BufeInfo } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import { ListContainer } from "components/list/ListContainer";
import ListButton from "components/list/ListButton";
import { ListComplexButtonContainer } from "components/list/ListComplexButtonContainer";
import IconButton from "components/IconButton";
import CheckBox from "components/CheckBox";
import NevEsEgyenleg from "components/page/NevEsEgyenleg";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function ListTermek({ clearSession: onLogout, loginResponse, selectedBufe }:Props) {
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
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg
        loginResponse={loginResponse}
        selectedBufe={selectedBufe}
        showEgyenleg={false}
        msgEnd="A büfé nevére kattintva szerkesztheted azt. Ikonok sorban:
- törlés/visszaállítás
- büfé felhasználói"/>
      {!error &&
        <ListContainer
          title="Termékek"
          error={error}
          beforeList={!error &&
            <CheckBox
              title="Aktív termékek"
              checked={showActive}
              onChanged={(newValue) => setShowActive(newValue)}
            />                  
          }
        >
          <ListButton
            key={-1}
            className="bg-green-600 hover:bg-green-400"
            title="Új termék"
            onClick={() => navigate("/admin/termek/-1" )}
          />
          {termekek.termekek.map((termek) => (
            <ListComplexButtonContainer key={termek.id}>
              <ListButton
                key={1}
                title={termek.nev}
                disabled={!showActive}
                onClick={() => navigate("/admin/termek/"+termek.id)}
              />
              {showActive&&
                <IconButton
                  title="Törlés"
                  key={2}
                  icon={
                    <TrashIcon className="w-5 h-5 red-600"/>
                  }
                  onClick={() => {termek.aktiv=false;saveTermek(termek);}}
                />
              }
              {!showActive&&
                <IconButton
                  title="Reaktiválás"
                  key={3}
                  icon={
                    <ArrowPathIcon className="w-5 h-5 red-600"/>
                  }
                  onClick={() => {termek.aktiv=true;saveTermek(termek);}}
                />              
              }
            </ListComplexButtonContainer>    
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}