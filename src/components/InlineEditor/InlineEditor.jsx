import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import TextEditor from "ui/TextEditor/TextEditor";
import {triggerEvent} from "../../helpers/events";

const InlineEditor = ({data, closeCallback, mount}) => {
    const [value, setValue] = useState({text: data.value});
    const valRef = useRef();
    valRef.current = value;
    const ref = useRef();
    useEffect(() => {
        ref.current.editor.container.addEventListener('keydown', event => {
            event.stopPropagation();
            if (event.key === 'Escape' || (event.key === 'Enter' && event.ctrlKey)) {
                let text = valRef.current.text;
                if (text === '<p><br></p>') text = '';
                closeCallback(text, mount);
            }
        });
        ref.current.focus();
        if (data.config === 'editor') {
            let block = ref.current.editor.container.closest('.quill');
            let item = block.closest('.transform-item');
            item.style.width = Math.max(300, item.clientWidth) + "px";
        }
    }, []);
    useLayoutEffect(() => {
        if (!ref.current) return;
        triggerEvent("container:init", {container:ref.current.editor.container.closest(".transform-container")});
    }, [value]);

    return (
        <TextEditor ref={ref}
                    config={data.config}
                    message={value}
                    callback={setValue}></TextEditor>
    );
};

export default InlineEditor;