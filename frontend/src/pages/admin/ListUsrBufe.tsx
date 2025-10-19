import { useState, useEffect, JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { TrashIcon,  CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { BufeInfo, BufeUsrAddRequest, BufeUsrRelationResponse, BufeUsrSetActiveRequest, ErrorResponse, LoginResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { KEY_LIST_USR_BUFE_ACTIVE } from "./../../constants";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import { ListContainer } from "components/list/ListContainer";
import ListButton from "components/list/ListButton";
import IconButton from "components/IconButton";
import { ListComplexButtonContainer } from "components/list/ListComplexButtonContainer";
import CheckBox from "components/CheckBox";
import NevEsEgyenleg from "components/page/NevEsEgyenleg";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function ListUsrBufe({ clearSession: onLogout, loginResponse, selectedBufe }:Props) {
  const { usrId } = useParams<{ usrId: string }>();
  const [showActive, setShowActive] = useState<boolean>(() => {
    const saved = localStorage.getItem( KEY_LIST_USR_BUFE_ACTIVE );
    return saved==="1";
  });
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [usrBufeRelations, setUsrBufeRelations] = useState<BufeUsrRelationResponse>({relations:[]});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem( KEY_LIST_USR_BUFE_ACTIVE, showActive ? "1" : "0" );
  }, [ showActive ]);
  useEffect(() => {
    const fetchBufes = async () => {
      try {
        setLoading(true);
        const data: BufeUsrRelationResponse = 
              await fetchJson<BufeUsrRelationResponse>( `/api/usr/${usrId}/bufes`, { method: "POST", credentials: "include" } );
        setError(null);
        setUsrBufeRelations(data);
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
    fetchBufes();
  }, [forceRefresh, usrId, onLogout]);

  const addToBufe = async ( bufeId: number ) => {
    try {
      setLoading(true);
      const req: BufeUsrAddRequest = {bufeId:bufeId, usrId:Number(usrId)};
      await fetchVoid( "/api/bufeusr/addtobufe",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify( req ) } );
      setForceRefresh( forceRefresh+1 );
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
      if( error.error==="UNAUTHORIZED" )
        onLogout();
    } finally {
      setLoading(false);
    }
  }
  const setActive = async( bufeUsrId:number, aktiv:boolean ) => {
    try {
      setLoading(true);
      const req: BufeUsrSetActiveRequest = {bufeUsrId:bufeUsrId, active:aktiv};
      await fetchVoid( "/api/bufeusr/setactive",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify( req ) } );
      setForceRefresh( forceRefresh+1 );
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
      if( error.error==="UNAUTHORIZED" )
        onLogout();
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg
        loginResponse={loginResponse}
        selectedBufe={selectedBufe}
        showEgyenleg={false}
        msgEnd="A büfé nevére kattintva szerkesztheted azt. Ikonok sorban:
- törlés/visszaállítás
- büfé felhasználói"/>
      {!error &&
        <ListContainer
          title="Büfék"
          error={error}
          beforeList=
            {!error &&
              <CheckBox
                title="Felhasználói kapcsolat aktív"
                checked={showActive}
                onChanged={(newValue) => setShowActive(newValue)}
              />                  
            }
          >
          {usrBufeRelations.relations.map((relation) => {
            let labelButton: JSX.Element | null = null;
            let iconButton: JSX.Element | null = null;
            if( showActive ) {
              if( relation.bufeUsrId!=null && relation.bufeUsrActive ) {
                const bufeUsrId:number=relation.bufeUsrId;
                labelButton=
                  <ListButton
                    key={1}
                    title={relation.bufeName}
                    onClick={() =>{navigate("/admin/bufeuser/"+relation.bufeUsrId);}}
                  />;
                iconButton=
                  <IconButton
                    key={2}
                    title="Törlés"
                    icon={
                      <TrashIcon className="w-5 h-5 red-600"/>
                    }
                    onClick={() => {setActive( bufeUsrId, false );}}
                  />;
              }
            } else {
              if( relation.bufeUsrId==null || !relation.bufeUsrActive ) {
                labelButton=
                  <ListButton
                    key={3}
                    title={relation.bufeName}
                    disabled={true}
                  />;
                if( relation.bufeUsrId==null ) {
                  iconButton=
                    <IconButton
                      key={4}
                      title="Hozzáadás"
                      icon={
                        <PlusIcon className="w-5 h-5 green-600"/>
                      }
                      onClick={()=>{addToBufe( relation.bufeId );}}
                    />;
                } else {
                  const bufeUsrId:number=relation.bufeUsrId;
                  iconButton=
                    <IconButton
                      key={5}
                      title="Reaktiválás"
                      icon={
                        <CheckIcon className="w-5 h-5 green-600"/>
                      }
                      onClick={()=>{setActive( bufeUsrId, true );}}
                    />;
                }
              }
            }
            return (
              labelButton&&
                <ListComplexButtonContainer key={relation.bufeId}>
                  {labelButton}
                  {iconButton}
                </ListComplexButtonContainer>
            );
          })}
        </ListContainer>
      }
    </PageContainer>
  );
}