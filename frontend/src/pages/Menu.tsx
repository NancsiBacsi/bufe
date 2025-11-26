import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import "./../styles/Pages.css";
import NevEsEgyenleg from "components/page/NevEsEgyenleg";
import { BufeInfo, ErrorResponse, LoginResponse } from "../types";
import { fetchVoid } from "utils/http";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import ErrorLine from "components/ErrorLine";
import { ListContainer } from "components/list/ListContainer";
import ListButton from "components/list/ListButton";

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
      <NevEsEgyenleg
        loginResponse={loginResponse}
        showEgyenleg={true}
        selectedBufe={selectedBufe}
        msgEnd="Jó vásárlást!"
      />
      <ErrorLine error={error}/>
      <ListContainer>
        <ListButton
          onClick={() => navigate("/vasarlas")}
          title="Vásárlás"
        />
        <ListButton
          onClick={() => navigate("/vasarlasvonalkod")}
          title="Vásárlás vonalkóddal"
        />
        <ListButton
          onClick={() => navigate("/vasarlasnaplo")}
          title="Napló"
        />
        <ListButton
          onClick={() => navigate("/statisztika")}
          title="Forgalmi statisztika"
        />        
        {isPenztaros &&(
          <ListButton
            onClick={() => navigate("/arufeltoltes")}
            title="Árufeltöltés"
          />
        )}
        {isPenztaros && (
          <ListButton
            onClick={() => navigate("/szamlafeltoltes")}
            title="Számla feltöltés"
          />
        )}
        {isPenztaros && (
          <ListButton
            onClick={() => navigate("/leltar")}
            title="Leltár"
          />
        )}
        {isPenztaros && (
          <ListButton
            onClick={() => navigate("/bevasarlas")}
            title="Bevásárló lista"
          />
        )}
        {isAdmin && (
          <ListButton
            onClick={() => navigate("/admin/termek")}
            title="Termékek"
          />
        )}
        {isAdmin && (
          <ListButton
            onClick={() => navigate("/admin/usr")}
            title="Felhasználók"
          />
        )}
        {isAdmin && (
          <ListButton
            onClick={() => navigate("/admin/bufe")}
            title="Büfék"
          />
        )}
        <ListButton
          onClick={() => navigate("/changepassword")}
          title="Jelszó változtatás"
        />
        <ListButton
          onClick={() => doLogout()}
          title="Kilépés"
        />
      </ListContainer>
    </PageContainer>
  );
}
