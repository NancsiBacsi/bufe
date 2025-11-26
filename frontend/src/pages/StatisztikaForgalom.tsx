import { useState, useEffect } from "react";
import "styles/Pages.css";
import { BufeInfo, ErrorResponse, ForgalmiStatisztikaResponse, ForgalmiStatisztikaSor, LoginResponse } from "types";
import { fetchJson } from "utils/http";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import { ListContainer } from "components/list/ListContainer";
import { getISOFormatedDate } from "utils/date";
import { FormContainer } from "components/form/FormContainer";
import FormInputDate from "components/form/FormInputDate";
import FormatedTxt from "components/FormatedText";
import { useNavigate } from "react-router-dom";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function StatisztikaForgalom({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const navigate = useNavigate();
  const [sumForgalom, setSumForgalom] = useState<number>(0);
  const [sumLeltarKorrekcio, setSumLeltarKorrekcio] = useState<number>(0);
  const [sumEredmeny, setSumEredmeny] = useState<number>(0);
  const [sorok, setSorok] = useState<ForgalmiStatisztikaSor[]>([]);
  const [vege, setVege] = useState<string>(getISOFormatedDate( new Date() ));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  useEffect(() => {
    const fetchStatisztika = async () => {
      try {
        setLoading(true);
        const data: ForgalmiStatisztikaResponse = 
            await fetchJson<ForgalmiStatisztikaResponse>( `/api/statisztika/forgalom/${vege}`, { method: "POST", credentials: "include" } );
        setError(null);
        setSumForgalom( data.sumForgalom );
        setSumLeltarKorrekcio( data.sumLeltarKorrekcio );
        setSumEredmeny( data.sumEredmeny );
        setSorok( data.sorok );
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
    fetchStatisztika();
  }, [selectedBufe.bufeUsrId, vege, onLogout]);

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <FormContainer
        title="Forgalmi statisztika"
        error={error}
        showMenu={true}
        onMenuClick={()=>navigate("/menu")}
      >
        <label htmlFor="vege">Időszak vége</label>
        <FormInputDate
          id="vege"
          value={vege}
          onChange={(newValue)=>setVege(newValue)}
          required={true}
        />
        <FormatedTxt formatedTxt={`Forgalom: **${sumForgalom}**
${sumLeltarKorrekcio < 0 ? 'Leltár hiány:' : 'Leltár többlet:'} ${sumLeltarKorrekcio < 0 ? '*#r' + Math.abs(sumLeltarKorrekcio) + '*#r' : '*#g' + Math.abs(sumLeltarKorrekcio) + '*#g'}
${sumEredmeny < 0 ? 'Veszteség: ' : 'Nyereség: ' } ${sumEredmeny < 0 ? '*#r' + Math.abs(sumEredmeny) + '*#r' : '*#g' + Math.abs(sumEredmeny) + '*#g'}`}
          className=""
        />
      </FormContainer>
      {!loading&&
        <ListContainer>
          {sorok.map((t) => (
            <FormatedTxt formatedTxt={`${t.termekNev} ${t.eredmeny<0 ? '*#r' + Math.abs(t.eredmeny) + '*#r' : '*#g' + t.eredmeny + '*#g'} (${t.forgalom})`}/>
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}