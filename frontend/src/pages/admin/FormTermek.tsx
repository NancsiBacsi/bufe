import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { ErrorResponse, Termek } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";

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
      <h2 className="page-title">{termekId==="-1" ? "Új termék" : "Termék szerkesztése"}</h2>
      <ErrorLine error={error}/>
      <form className="page-form" onSubmit={handleSubmit}>
        {termekId!=="-1"&&<label htmlFor="nev">Név</label>}
        <input id="nev" type="text" placeholder="Név"
          value={termek.nev} onChange={(e) => setTermek({ ...termek, nev: e.target.value })} required
        />
        {termekId!=="-1"&&<label htmlFor="vonalkod">Vonalkód</label>}
        <input id="vonalkod" type="text" placeholder="Vonalkód"
          value={termek.vonalKod} onChange={(e) => setTermek({ ...termek, vonalKod: e.target.value })} required
        />
        <button type="submit">Mentés</button>
      </form>
    </PageContainer>
  );
}