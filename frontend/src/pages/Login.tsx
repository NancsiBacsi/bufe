import { useState, FormEvent } from "react";
import "styles/Pages.css";
import { LoginRequest, LoginResponse, ErrorResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import { FormContainer } from "components/form/FormContainer";
import FormInputString from "components/form/FormInputString";
import { FormSubmitButton } from "components/form/FormSubmitButton";

interface Props {
  onLogin: (loginResponse: LoginResponse) => void;
}
export default function Login({ onLogin }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [nev, setNev] = useState<string>("");
  const [jelszo, setJelszo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const req: LoginRequest = { nev, jelszo };
      const loginResponse: LoginResponse = await fetchJson<LoginResponse>( "/api/auth/login",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req), credentials: "same-origin" } );
      setError(null);
      if( loginResponse.bufeInfos.length===1 )
        selectFirstBufe( loginResponse );
      else
        onLogin(loginResponse);
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const selectFirstBufe = async ( loginResponse: LoginResponse ) => {
    try {
      setLoading(true);
      await fetchVoid( `/api/auth/selectbufe/${loginResponse.bufeInfos[0].bufeId}`,
        { method: "POST", credentials: "include" } );
      setError(null);
      onLogin( loginResponse );
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
    } finally {
      setLoading(false);
    }
  };  

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>      
      <FormContainer
        title="Bejelentkezés"
        error={error}
        onSubmit={handleSubmit}>
        <FormInputString
          type="text"
          placeholder="Felhasználó név"
          value={nev}
          onChange={(newValue) => setNev(newValue)}
          required
        />
        <FormInputString
          type="password"
          placeholder="Jelszó"
          value={jelszo}
          onChange={(newValue) => setJelszo(newValue)}
          required
        />
        <FormSubmitButton title="Belépés"/>
      </FormContainer>
    </PageContainer>
  );
}