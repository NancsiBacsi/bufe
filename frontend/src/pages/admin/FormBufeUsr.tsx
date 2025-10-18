import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { BufeUsr, ErrorResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import { FormContainer } from "components/FormContainer";
import FormInputInteger from "components/FormInputInteger";
import { FormSubmitButton } from "components/FormSubmitButton";

interface Props {
  clearSession: () => void;
}
export default function FormBufeUsr({ clearSession: onLogout }:Props ) {
  const { bufeUsrId } = useParams<{ bufeUsrId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [bufeUsr, setBufeUsr ] = useState<BufeUsr>({id:-1,aktiv:true,bufe:{id:-1,aktiv:true,nev:""},hitelKeret:0,minusArres:20,plusArres:10,penztaros:false,usr:{id:-1,admin:false,aktiv:true,bufeUsrs:[],email:"",jelszo:"",nev:"",teljesNev:""}});

  useEffect(() => {
    const fetchBufeUsr = async () => {
      if(bufeUsrId!=="-1") {
        try {
          setLoading(true);   
          const data: BufeUsr = 
              await fetchJson<BufeUsr>( `/api/bufeusr/${bufeUsrId}`, { method: "POST", credentials: "include" } );
          setError(null);
          setBufeUsr(data);
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
    fetchBufeUsr();
  }, [bufeUsrId, onLogout]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchVoid( "/api/bufeusr/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bufeUsr) });
      setError(null);
      navigate(`/admin/bufe/${bufeUsr.bufe.id}/user`);
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
        title="Büfé felhasználó szerkesztése"
        error={error}
        onSubmit={handleSubmit}
      >
        <label htmlFor="nev">Hitelkeret</label>
        <FormInputInteger
          id="nev"
          min={0}
          max={99999}
          placeholder="Hitelkeret"
          value={bufeUsr.hitelKeret}
          onChange={(newValue) => setBufeUsr({ ...bufeUsr, hitelKeret:newValue})}
          required
        />
        <label htmlFor="plusArres">Pozitív árrés</label>
        <FormInputInteger
          id="plusArres"
          min={0}
          max={999}
          placeholder="Pozitív árrés"
          value={bufeUsr.plusArres}
          onChange={(newValue) => setBufeUsr({ ...bufeUsr, plusArres:newValue})}
          required
        />
        <label htmlFor="minusArres">Negatív árrés</label>
        <FormInputInteger
          id="minusArres"
          min={0}
          max={999}
          placeholder="Negatív árrés"
          value={bufeUsr.minusArres}
          onChange={(newValue) => setBufeUsr({ ...bufeUsr, minusArres:newValue})}
          required
        />
        <label
          htmlFor="penztaros"
          className="flex text-center gap-2"
        >
          <input
            id="penztaros"
            type="checkbox"
            checked={bufeUsr.penztaros}
            onChange={(e) => setBufeUsr({ ...bufeUsr, penztaros: e.target.checked })}
          />
          Pénztáros
        </label>   
        <FormSubmitButton title="Mentés"/>
      </FormContainer>
    </PageContainer>
  );
}