import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import UsersPage from "./pages/UsersPage";
import { useEffect, useState } from "react";

interface AppRoutesProps{
    loggedIn: boolean;
    setLoggedIn: any;
}
export const AppRoutes = (props: AppRoutesProps) =>{

    const { loggedIn = false, setLoggedIn } = props;
    const [user, setUser] = useState(null);

    // useEffect(()=>{
    //     const sessionUser : any = sessionStorage.getItem("user");
    //     console.log(sessionUser);
    //     if(sessionUser){
    //         setUser(sessionUser);
    //         setLoggedIn(true);
    //     }
    // }, []);

    useEffect(()=>{
        if(!loggedIn){
            setUser(null);
        }
    }, [loggedIn]);

    return(
        <Routes>
            <Route
                path={"/"}
                element={<LoginPage setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
            />
            <Route
                path={"/home"}
                element={<HomePage user={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
            />
            <Route
                path={"/upload"}
                element={<UploadPage user={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn}  />}
            />
            <Route
                path={"/users"}
                element={<UsersPage user={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn}  />}
            />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
};