import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { ErrorResponse, Usr } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import { FormContainer } from "components/FormContainer";
import FormInputString from "components/FormInputString";
import { FormSubmitButton } from "components/FormSubmitButton";

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
      <FormContainer
        title={usrId==="-1" ? "Új felhasználó" : "Felhasználó szerkesztése"}
        error={error}
        onSubmit={handleSubmit}
      >
        {usrId!=="-1"&&
          <label htmlFor="nev">Név</label>
        }
        <FormInputString
          id="nev"
          type="text"
          placeholder="Név"
          value={usr.nev}
          onChange={(newValue) => setUsr({ ...usr, nev:newValue})}
          required
        />
        {usrId!=="-1"&&
          <label htmlFor="teljesNev">Teljes név</label>
        }
        <FormInputString
          id="teljesNev"
          type="text"
          placeholder="Teljes név"
          value={usr.teljesNev}
          onChange={(newValue) => setUsr({ ...usr, teljesNev:newValue})}
          required
        />
        {usrId!=="-1"&&
          <label htmlFor="jelszo">Jelszó</label>
        }
        <FormInputString
          id="jelszo"
          type="password"
          placeholder="Jelszó"
          value={usr.jelszo}
          onChange={(newValue) => setUsr({ ...usr, jelszo:newValue})}
          required
        />
        {usrId!=="-1"&&
          <label htmlFor="email">E-mail</label>
        }
        <FormInputString
          id="email"
          type="email"
          placeholder="E-mail"
          value={usr.email}
          onChange={(newValue) => setUsr({ ...usr, email:newValue})}
          required
        />
        <label
          htmlFor="admin"
          className="flex text-center gap-2"
        >
          <input
            id="admin"
            type="checkbox"
            checked={usr.admin}
            onChange={(e) => setUsr({ ...usr, admin: e.target.checked })}
          />
          Admin
        </label>
        <FormSubmitButton title="Mentés"/>
      </FormContainer>
    </PageContainer>
  );
}