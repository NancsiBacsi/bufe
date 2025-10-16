import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { Bufe, ErrorResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";

interface Props {
  clearSession: () => void;
}
export default function FormBufe({ clearSession: onLogout }:Props ) {
  const { bufeId } = useParams<{ bufeId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [bufe, setBufe ] = useState<Bufe>({id:-1,nev:"",aktiv:true});

  useEffect(() => {
    const fetchBufe = async () => {
      if(bufeId!=="-1") {
        try {
          setLoading(true);   
          const data: Bufe = 
              await fetchJson<Bufe>( `/api/bufe/${bufeId}`, { method: "POST", credentials: "include" } );
          setError(null);
          setBufe(data);
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
    fetchBufe();
  }, [bufeId, onLogout]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchVoid( "/api/bufe/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bufe) });
      setError(null);
      navigate("/admin/bufe");
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
      <h2 className="page-title">{bufeId==="-1" ? "Új büfé" : "Büfé szerkesztése"}</h2>
      {error && <p className="page-error">{error}</p>}
      <form className="page-form" onSubmit={handleSubmit}>
        {bufeId!=="-1"&&<label htmlFor="nev">Név</label>}
        <input id="nev" type="text" placeholder="Név"
          value={bufe.nev} onChange={(e) => setBufe({ ...bufe, nev: e.target.value })} required
        />
        <button type="submit">Mentés</button>
      </form>
    </PageContainer>
  );
}