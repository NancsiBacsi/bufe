import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import "./../styles/Pages.css";
import NevEsEgyenleg from "../components/NevEsEgyenleg";
import { BufeInfo, ErrorResponse, LoginResponse } from "../types";
import { fetchVoid } from "utils/http";
import { PageContainer } from "../components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";
import { ListContainer } from "components/ListContainer";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function Menu({ loginResponse, selectedBufe, clearSession: onLogout }: Props) {
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
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg loginResponse={loginResponse} showEgyenleg={true} selectedBufe={selectedBufe} msgEnd="Jó vásárlást!" forceRefresh={0} />
      <ErrorLine error={error}/>
      <ListContainer>
        <button className="page-list-button" onClick={() => navigate("/vasarlas")}>Vásárlás</button>
        <button className="page-list-button" onClick={() => navigate("/vasarlasvonalkod")}>Vásárlás vonalkóddal</button>
        <button className="page-list-button" onClick={() => navigate("/vasarlasnaplo")}>Napló</button>
        {isPenztaros && (<button className="page-list-button" onClick={() => navigate("/arufeltoltes")}>Árufeltöltés</button>)}
        {isPenztaros && (<button className="page-list-button" onClick={() => navigate("/szamlafeltoltes")}>Számla feltöltés</button>)}
        {isPenztaros && (<button className="page-list-button" onClick={() => navigate("/leltar")}>Leltár</button>)}
        {isPenztaros && (<button className="page-list-button" onClick={() => navigate("/bevasarlas")} >Bevásárló lista</button>)}

        {isAdmin && (<button className="page-list-button" onClick={() => navigate("/admin/termek")}>Termékek</button>)}
        {isAdmin && (<button className="page-list-button" onClick={() => navigate("/admin/usr")}>Felhasználók</button>)}
        {isAdmin && (<button className="page-list-button" onClick={() => navigate("/admin/bufe")}>Büfék</button>)}

        <button className="page-list-button" onClick={() => navigate("/changepassword")}>Jelszó változtatás</button>
        <button className="page-list-button" onClick={() => doLogout()}>Kilépés</button>
      </ListContainer>
    </PageContainer>
  );
}
