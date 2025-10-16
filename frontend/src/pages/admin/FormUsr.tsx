import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { ErrorResponse, Usr } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";

interface Props {
  clearSession: () => void;
}
export default function FormUsr({ clearSession: onLogout }:Props ) {
  const { usrId } = useParams<{ usrId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [usr, setUsr ] = useState<Usr>({id:-1,nev:"",aktiv:true,admin:false,bufeUsrs:[],email:'',jelszo:'',teljesNev:''});

  useEffect(() => {
    const fetchUsr = async () => {
      if(usrId!=="-1") {
        try {
          setLoading(true);   
          const data: Usr = 
              await fetchJson<Usr>( `/api/usr/${usrId}`, { method: "POST", credentials: "include" } );
          setError(null);
          setUsr(data);
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
    fetchUsr();
  }, [usrId, onLogout]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchVoid( "/api/usr/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(usr) });
      setError(null);
      navigate("/admin/usr");
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
      <h2 className="page-title">{usrId==="-1" ? "Új felhasználó" : "Felhasználó szerkesztése"}</h2>
      <ErrorLine error={error}/>
      <form className="page-form" onSubmit={handleSubmit}>
        {usrId!=="-1"&&<label htmlFor="nev">Név</label>}
        <input id="nev" type="text" placeholder="Név"
          value={usr.nev} onChange={(e) => setUsr({ ...usr, nev: e.target.value })} required
        />
        {usrId!=="-1"&&<label htmlFor="teljesNev">Teljes név</label>}
        <input id="teljesNev" type="text" placeholder="Teljes név"
          value={usr.teljesNev} onChange={(e) => setUsr({ ...usr, teljesNev: e.target.value })} required
        />
        {usrId!=="-1"&&<label htmlFor="jelszo">Jelszó</label>}
        <input id="jelszo" type="password" placeholder="Jelszó"
          value={usr.jelszo} onChange={(e) => setUsr({ ...usr, jelszo: e.target.value })} required
        />
        {usrId!=="-1"&&<label htmlFor="email">E-mail</label>}
        <input id="email" type="email" placeholder="E-mail"
          value={usr.email} onChange={(e) => setUsr({ ...usr, email: e.target.value })} required
        />
        <label htmlFor="admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input id="admin" type="checkbox"
            checked={usr.admin} onChange={(e) => setUsr({ ...usr, admin: e.target.checked })}/>
          Admin
        </label>
        <button type="submit">Mentés</button>
      </form>
    </PageContainer>
  );
}