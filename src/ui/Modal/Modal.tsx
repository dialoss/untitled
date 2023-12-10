//@ts-nocheck
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import './Modal.scss';
import {getElementFromCursor} from "../../helpers/events";
import {useAddEvent} from "../../hooks/useAddEvent";

const Modal = ({content, style, name, isOpened, closeCallback}) => {
    const ref = useRef<HTMLElement>(null);
    const opened = (isOpened ? "opened" : "");
    console.log(name, style)
    function backgroundClose(event) {
        const toggle = getElementFromCursor(event, 'modal__toggle-button');
        !toggle && closeCallback();
        if (style.bg !== 'bg-none') event.stopPropagation();
    }
    useAddEvent("mousedown", (e) => {
        const toggle = getElementFromCursor(e, 'modal__toggle-button');
        const mod = getElementFromCursor(e, name);
        !mod && !toggle && style.bg === 'bg-none' && closeCallback();
    });

    useEffect(() => {
        const transformItem: HTMLElement = ref.current.closest('.transform-item');
        if (!transformItem || name.includes('emojis')) return;
        !isOpened && (transformItem.style.pointerEvents = 'none');
        isOpened && (transformItem.style.pointerEvents = 'auto');
    }, [isOpened]);

    return (
        <div className={"modal"} ref={ref}>
            <div className={"modal__wrapper"}>
                <div className={`modal__background ${opened} ${!!style && (style.bg || '')}`}
                     onClick={backgroundClose}>
                    <div className={`modal__window ${name}-window ${opened} ${!!style && ((style.win || '') + ' ' + (style.bg || ''))}`}
                         onClick={e => e.stopPropagation()}>
                        <div className="modal__content">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;