//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import MyCanvas from "./Canvas";
import {AutodeskModel} from "components/Item/components/Model/Autodesk";

const Viewer = ({data}) => {
    const ref = useRef();
    useEffect(() => {
        if (data.style === 'simple') return;
        const resizer = new ResizeObserver(() => {
            if (!ref.current || !window.autodeskViewers || !window.autodeskViewers[data.id]) return;
            let block = ref.current.getBoundingClientRect();
            window.autodeskViewers[data.id].impl.resize(block.width, block.height, true);
        });
        resizer.observe(ref.current);
        return () => {
            try {
                resizer.unobserve(ref.current);
            } catch (e) {}
        }
    }, []);
    return (
        <div className={"model-wrapper"} ref={ref} style={{height:'100%', flex: 1}}>
            <div className={"item__overlay"}></div>
            {data.style !== 'simple' ? <AutodeskModel data={data}></AutodeskModel> :
                <MyCanvas data={data}></MyCanvas>}
        </div>
    );
};

export default Viewer;