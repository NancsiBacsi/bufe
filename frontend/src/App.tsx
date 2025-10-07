import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useCallback, useState } from "react";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Vasarlas from "./pages/Vasarlas";
import BufeValaszto from "./pages/BufeValaszto";
import VasarlasVonalkod from "./pages/VasarlasVonalkod";
import VasarlasNaplo from "./pages/VasarlasNaplo";
import ChangePassword from "./pages/ChangePassword";
import ListTermek from "./pages/admin/ListTermek";
import { BufeInfo, LoginResponse } from "./types";
import FormTermek from "pages/admin/FormTermek";
import ListBufe from "pages/admin/ListBufe";
import FormBufe from "pages/admin/FormBufe";
import { KEY_LOGIN_RESPONSE } from "./constants";
import { KEY_SELECTED_BUFE } from "./constants";
import ListBufeUsr from "pages/admin/ListBufeUsr";
import FormBufeUsr from "pages/admin/FormBufeUsr";
import ListUsrBufe from "pages/admin/ListUsrBufe";
import ListUsr from "pages/admin/ListUsr";
import FormUsr from "pages/admin/FormUsr";
import SzamlaFeltoltes from "pages/SzamlaFeltoltes";


function App() {
  const [loginResponse, setLoginResponse] = useState<LoginResponse|null>(() => {
    const saved = sessionStorage.getItem(KEY_LOGIN_RESPONSE);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch( e ) {
      sessionStorage.removeItem(KEY_LOGIN_RESPONSE);
      return null;
    }
  });

  const [selectedBufe, setSelectedBufe] = useState(() => {
    const saved = sessionStorage.getItem(KEY_SELECTED_BUFE);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch( e ) {
      sessionStorage.removeItem(KEY_SELECTED_BUFE);
      return null;
    }
  });

  const onLogin = (loginResponse: LoginResponse) => {
    setLoginResponse(loginResponse);
    sessionStorage.setItem(KEY_LOGIN_RESPONSE, JSON.stringify(loginResponse));
    if (loginResponse.bufeInfos.length === 1) {
      const bufeInfo = loginResponse.bufeInfos[0];
      setSelectedBufe(bufeInfo);
      sessionStorage.setItem(KEY_SELECTED_BUFE, JSON.stringify(bufeInfo));
    }
  };

  const onBufeSelect = (bufeInfo: BufeInfo) => {
    setSelectedBufe(bufeInfo);
    sessionStorage.setItem(KEY_SELECTED_BUFE, JSON.stringify(bufeInfo));
  };

  const onLogout=useCallback(() => {
    sessionStorage.removeItem(KEY_LOGIN_RESPONSE);
    sessionStorage.removeItem(KEY_SELECTED_BUFE);
    setLoginResponse(null);
    setSelectedBufe(null);
  }, []);
  if(!loginResponse)
    return <Login onLogin={onLogin} />;
  if(!selectedBufe)
    return <BufeValaszto bufeInfos={loginResponse.bufeInfos} onSelect={onBufeSelect} onLogout={onLogout}/>
  return (
    <Router>
      <Routes>
        <Route path="/menu" element={<Menu loginResponse={loginResponse} selectedBufe={selectedBufe} onLogout={onLogout}/>} />
        <Route path="/vasarlas" element={<Vasarlas loginResponse={loginResponse} selectedBufe={selectedBufe} onLogout={onLogout}/>}/>
        <Route path="/vasarlasvonalkod" element={<VasarlasVonalkod loginResponse={loginResponse} selectedBufe={selectedBufe} onLogout={onLogout}/>} />
        <Route path="/vasarlasnaplo" element={<VasarlasNaplo loginResponse={loginResponse} selectedBufe={selectedBufe} onLogout={onLogout}/>} />
        <Route path="/szamlafeltoltes" element={<SzamlaFeltoltes loginResponse={loginResponse} selectedBufe={selectedBufe} onLogout={onLogout}/>} />
        <Route path="/changepassword" element={<ChangePassword onLogout={onLogout}/>} />
        <Route path="/admin/termek" element={<ListTermek onLogout={onLogout}/>} />
        <Route path="/admin/termek/:termekId" element={<FormTermek onLogout={onLogout}/>} />
        <Route path="/admin/bufe" element={<ListBufe onLogout={onLogout}/>} />
        <Route path="/admin/bufe/:bufeId" element={<FormBufe onLogout={onLogout}/>} />
        <Route path="/admin/bufe/:bufeId/user" element={<ListBufeUsr onLogout={onLogout}/>} />
        <Route path="/admin/bufeuser/:bufeUsrId" element={<FormBufeUsr onLogout={onLogout}/>} />
        <Route path="/admin/usr" element={<ListUsr onLogout={onLogout}/>} />
        <Route path="/admin/usr/:usrId" element={<FormUsr onLogout={onLogout}/>} />
        <Route path="/admin/usr/:usrId/bufe" element={<ListUsrBufe onLogout={onLogout}/>} />
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </Router>
  );
}

export default App;