//@ts-nocheck
import React, {cloneElement, useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./Slider.scss";

const Slider = ({children, togglers, callback=null, defaultOpened=true}) => {
    const [isOpened, setOpened] = useState(defaultOpened);
    const state = (isOpened ? 'opened' : 'closed');
    const ref = useRef();

    useLayoutEffect(() => {
        setOpened(defaultOpened);
    }, [defaultOpened]);

    useEffect(() => {
        if (callback) callback(isOpened);
        document.documentElement.style.setProperty('--slider-width', ref.current.getBoundingClientRect().width + 'px');
    }, [isOpened]);

    return (
        <div className={"slider " + state} ref={ref}>
            <div className={"slider__body"}>
                {children}
                <div className="slider__togglers">
                    {
                        togglers.map((toggler, index) => {
                            return cloneElement(toggler.element, {onClick: () => {
                                    toggler.callback();
                                    const action = toggler.action;
                                    setOpened(opened => {
                                        if (action === 'toggle') return !opened;
                                        return action === 'open';
                                    });
                                }, key: index});
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default Slider;