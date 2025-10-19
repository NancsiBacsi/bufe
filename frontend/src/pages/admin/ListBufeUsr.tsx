import { useState, useEffect, JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { TrashIcon,  CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { BufeInfo, BufeUsrAddRequest, BufeUsrSetActiveRequest, ErrorResponse, LoginResponse, UsrBufeRelationResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { KEY_LIST_BUFE_USR_ACTIVE } from "./../../constants";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import { ListContainer } from "components/list/ListContainer";
import { ListComplexButtonContainer } from "components/list/ListComplexButtonContainer";
import ListButton from "components/list/ListButton";
import IconButton from "components/IconButton";
import CheckBox from "components/CheckBox";
import NevEsEgyenleg from "components/page/NevEsEgyenleg";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function ListBufeUsr({ clearSession: onLogout, loginResponse, selectedBufe }:Props) {
  const { bufeId } = useParams<{ bufeId: string }>();
  const [showActive, setShowActive] = useState<boolean>(() => {
    const saved = localStorage.getItem( KEY_LIST_BUFE_USR_ACTIVE );
    return saved==="1";
  });
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [usrBufeRelations, setUsrBufeRelations] = useState<UsrBufeRelationResponse>({relations:[]});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem( KEY_LIST_BUFE_USR_ACTIVE, showActive ? "1" : "0" );
  }, [ showActive ]);
  useEffect(() => {
    const fetchUsrs = async () => {
      try {
        setLoading(true);
        const data: UsrBufeRelationResponse = 
              await fetchJson<UsrBufeRelationResponse>( `/api/bufe/${bufeId}/usrs`, { method: "POST", credentials: "include" } );
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
    fetchUsrs();
  }, [forceRefresh, bufeId, onLogout]);

  const addToBufe = async ( usrId: number ) => {
    try {
      setLoading(true);
      const req: BufeUsrAddRequest = {bufeId:Number(bufeId), usrId:usrId};
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
        msgEnd="A felhasználó nevére kattintva szerkesztheti a felhasználó-büfé kapcsolatot.
Az ikonnal törölheti, illetve hozhatja létre a felhasználó-büfé kapcsolatot."/>
      {!error &&
        <ListContainer
          error={error}
          title="Büfé felhasznállók"
          beforeList={!error &&
            <CheckBox
              title="Büfé kapcsolat aktív"
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
                    title={relation.usrName}
                    onClick={() =>{navigate(`/admin/bufeuser/${relation.bufeUsrId}`);}}
                  />
                iconButton=
                  <IconButton 
                      key={2}
                      icon={
                        <TrashIcon className="w-5 h-5 red-600"/>
                      }
                      onClick={() => {setActive( bufeUsrId, false );}}
                      title="Törlés"
                    />
              }
            } else {
              if( relation.bufeUsrId==null || !relation.bufeUsrActive ) {
                labelButton=
                  <ListButton
                    key={3}
                    disabled={true}
                    title={relation.usrName}
                  />;
                if( relation.bufeUsrId==null ) {
                  iconButton=
                    <IconButton
                      key={4}
                      icon={
                        <PlusIcon className="w-5 h-5 green-600"/>
                      }
                      onClick={()=>{addToBufe( relation.usrId );}}
                      title="Hozzáadás"
                    />;
                } else {
                  const bufeUsrId:number=relation.bufeUsrId;
                  iconButton=
                    <IconButton
                      key={5}
                      icon={
                        <CheckIcon className="w-5 h-5 green-600"/>
                      }
                      onClick={()=>{setActive( bufeUsrId, true );}}
                      title="Reaktiválás"
                    />;
                }
              }
            }
            return (
              labelButton&&
                <ListComplexButtonContainer key={relation.usrId}>
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