import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { ErrorResponse, Termek } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import FormInputString from "components/form/FormInputString";
import { FormSubmitButton } from "components/form/FormSubmitButton";
import { FormContainer } from "components/form/FormContainer";

interface Props {
  clearSession: () => void;
}
export default function FormTermek({ clearSession: onLogout }:Props) {
  const { termekId } = useParams<{ termekId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [termek, setTermek ] = useState<Termek>({id:-1,nev:"",vonalKod:"",aktiv:true});

  useEffect(() => {
    const fetchTermek = async () => {
      if(termekId!=="-1") {
        try {
          setLoading(true);   
          const data: Termek = 
              await fetchJson<Termek>( `/api/termek/${termekId}`, { method: "POST", credentials: "include" } );
          setError(null);
          setTermek(data);
          setLoading(false);
        } catch (err) {
          const error = err as ErrorResponse;
          setError( error.message );
          if( error.error==="UNAUTHORIZED" )
            onLogout();
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTermek();
  }, [termekId, onLogout]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchVoid( "/api/termek/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(termek) });
      setError(null);
      navigate("/admin/termek");
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.message);
      if( error.error==="UNAUTHORIZED" )
        onLogout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>   
      <FormContainer
        title={termekId==="-1" ? "Új termék" : "Termék szerkesztése"}
        error={error}
        onSubmit={handleSubmit}
        showMenu={true}
        onMenuClick={()=>navigate("/menu")}
      >
        {termekId!=="-1"&&
          <label htmlFor="nev">Név</label>
        }
        <FormInputString
          id="nev"
          type="text"
          placeholder="Név"
          value={termek.nev}
          onChange={(newValue) => setTermek({ ...termek, nev: newValue})}
          required
        />
        {termekId!=="-1"&&
          <label htmlFor="vonalkod">Vonalkód</label>
        }
        <FormInputString
          id="vonalkod"
          type="text"
          placeholder="Vonalkód"
          value={termek.vonalKod}
          onChange={(newValue) => setTermek({ ...termek, vonalKod:newValue})}
          required
        />
        <FormSubmitButton title="Mentés"/>
      </FormContainer>
    </PageContainer>
  );
}