import React, {useEffect, useLayoutEffect} from 'react';
import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom";
import {routes} from "../constants/routes";
import {Intro} from "pages/MainPage";
import {getLocation} from "hooks/getLocation";
import {triggerEvent} from "helpers/events";
import {useAddEvent} from "../../../hooks/useAddEvent";
import ItemsPage from "../../ItemsPage/components/ItemsPage";
import {useSelector} from "react-redux";
import {actions} from "../store/reducers";
import store from "../../../store";

const Components = {
    'ItemsPage': ItemsPage,
    'Main': Intro,
};

const PageWrapper = ({route}) => {
    const location = getLocation();
    document.title = location.pageTitle + ' | MyMount';
    useEffect(()=>{
        if (location.pageSlug === 'main') document.querySelector('.container-main').style.minHeight = 'auto'
        else document.querySelector('.container-main').style.minHeight = '100dvh'
    },[]);

    return (
        <>
            {React.createElement(Components[route.component], {key: location.relativeURL})}
        </>
    );
};

const AppRoutes = () => {
    const navigate = useNavigate();

    function handleNavigate(event) {
        navigate(event.detail.path);
    }

    useAddEvent("router:navigate", handleNavigate)

    useLayoutEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const action = query.getAll('action');
        switch (action) {
            case 'messenger':
                 window.messenger = true;
        }
    }, []);

    return (
        <Routes>
            {
                routes.map((route) =>
                    <Route element={<PageWrapper route={route} key={route.path}/>}
                           path={route.path}
                           exact={true}
                           key={route.path}/>
                )
            }
            <Route path={'*'} element={<Navigate to={'/main/'}/>}/>
        </Routes>
    );
};

export default AppRoutes;