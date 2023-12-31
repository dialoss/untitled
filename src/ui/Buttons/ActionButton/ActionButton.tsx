//@ts-nocheck
import React, {useEffect, useLayoutEffect, useRef} from 'react';
import './ActionButton.scss';
import {useAppSelector} from "hooks/redux";
import {triggerEvent} from "../../../helpers/events";

const ActionButton = ({children, focus=false, modalToggle=true, authorizeAction, className, ...props}) => {
    const ref = useRef();
    const user = useAppSelector(state => state.users.current);
    const f = props.onClick;
    if (authorizeAction) {
        props.onClick = (e) => {
            if (!user.authenticated) {
                window.callbacks.call("user-auth", true);
                return;
            }
            f(e);
        }
    }
    if (focus) {
        const ff = props.onClick;
        props.onClick = (e) => {
            setTimeout(() => {
                ref.current && ref.current.focus();
            }, 2);
            ff(e);
        }
    }

    return (
        <button ref={ref} {...props}
                className={`action-button ${modalToggle ? 'modal__toggle-button' : ''} ${className || ''}`}>{children}</button>
    );
};

export default ActionButton;