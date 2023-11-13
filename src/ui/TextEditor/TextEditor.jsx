import React, {useEffect, useLayoutEffect, useRef} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {configQuill, QuillModules} from "./config";
import "./TextEditor.scss";
import {getElementFromCursor, isMobileDevice, triggerEvent} from "../../helpers/events";
import {useAddEvent} from "../../hooks/useAddEvent";
import {createRoot} from "react-dom/client";
import {InputAttachment, InputEmoji} from "../../components/Messenger/Input/MessengerInput";

const TextEditor = React.forwardRef(function TextEditor({config, message, callback}, ref) {
    const msgRef = useRef();
    const clickEvent = useRef();

    useAddEvent("mousedown", (e) => {
        clickEvent.current = e;
    })
    const simple = config === 'simple';

    useEffect(() => {
        configQuill();
        if(!msgRef.current) return;
        let root = msgRef.current.getEditor();
        simple && root.keyboard.bindings[13].unshift({
            key: 13,
            handler: (range,context) => {
            }
        })
        let field = root.root;
        simple && (field.dataset.placeholder = 'Сообщение');
        field.addEventListener('keydown', (e) => e.stopPropagation());
        // field.focus();
        simple && field.addEventListener('blur', (e) => {
            let target = getElementFromCursor(clickEvent.current, '', ['icon-emojis', 'emojis-window']);
            if (target) {
                e.preventDefault();
                field.focus();
            }
        });
        simple && field.addEventListener('keydown', (e) => triggerEvent('messenger:keydown', e));
        field.addEventListener('mousedown', e => e.stopPropagation());
        const toolbar = field.closest('.quill').querySelector('.ql-toolbar');
        createRoot(toolbar.querySelector('.ql-emoji')).render(
            <InputEmoji callback={(v) => {
                // console.log(v)
                // const pos = root.getSelection().index;
                callback(m => ({...m, text: m.text + v}));
            }}></InputEmoji>);
        createRoot(toolbar.querySelector('.ql-attachment')).render(
            <InputAttachment callback={(v) => callback(m => ({...m, upload:v.upload}))}></InputAttachment>);

    }, []);

    function inputCallback(value) {
        callback(m => ({...m, text:value}));
        if (simple && msgRef.current) {
            let field = msgRef.current.getEditor();
            let inputHeight = field.root.querySelector('p').getBoundingClientRect().height;
            field.container.style.height = Math.max(Math.min(300, inputHeight), 50) + 'px';
        }
    }

    const modules = QuillModules[config];

    return (
        <>
            <ReactQuill className={"ql-" + config}
                        ref={ref || msgRef}
                        theme="snow"
                        // value={!value ? '<br>' : `<p>${value}</p>`}
                        // onChange={(val) => {
                        //     inputCallback(val.replaceAll(/<\/?p[^>]*>/g, '').replace('<br>', ''));
                        value={message.text}
                        onChange={inputCallback}
                        modules={modules}/>
        </>

    );
});

export default TextEditor;