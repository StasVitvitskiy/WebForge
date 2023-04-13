import { Button, Modal } from "flowbite-react";
import React, {
    type Ref,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { SiCsswizardry, SiJavascript } from "react-icons/si";
import MonacoEditor, { type RefEditorInstance } from "@uiw/react-monacoeditor";

export function CustomCssAndJsConfigurationControls({
    block,
    onChange,
}: {
    block: UiModelBuildingBlock;
    onChange: (block: UiModelBuildingBlock) => void;
}): JSX.Element {
    const [activeModal, setActiveModal] = useState<"css" | "js" | undefined>(
        undefined,
    );
    const localState = useRef<{
        css: undefined | string;
        js: undefined | string;
    }>({ css: undefined, js: undefined });

    const onCssChange = useCallback(
        (css: string) => (localState.current.css = css),
        [],
    );
    const onCssSave = useCallback(() => {
        onChange({
            ...block,
            attributes: {
                ...block.attributes,
                customCSS: localState.current.css,
            },
        });
        setActiveModal(undefined);
    }, []);
    const onCssCancel = useCallback(() => {
        localState.current.css = undefined;
        setActiveModal(undefined);
    }, []);

    const onJsChange = useCallback(
        (js: string) => (localState.current.js = js),
        [],
    );
    const onJsSave = useCallback(() => {
        onChange({
            ...block,
            attributes: {
                ...block.attributes,
                customJS: localState.current.js,
            },
        });
        setActiveModal(undefined);
    }, []);
    const onJsCancel = useCallback(() => {
        localState.current.js = undefined;
        setActiveModal(undefined);
    }, []);

    const cssEditorRef = useRef<RefEditorInstance>();
    const jsEditorRef = useRef<RefEditorInstance>();

    useEffect(() => {
        if (activeModal === "css") {
            cssEditorRef?.current?.editor?.layout();
        }
        if (activeModal === "js") {
            jsEditorRef?.current?.editor?.layout();
        }
    }, [activeModal]);

    return (
        <div className="mt-4 grid grid-cols-2 gap-x-4">
            <Button
                onClick={() => {
                    setActiveModal("css");
                }}
            >
                <SiCsswizardry className="mr-2 h-5 w-5" />
                Custom CSS
            </Button>
            <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                    setActiveModal("js");
                }}
            >
                <SiJavascript className="mr-2 h-5 w-5" />
                Custom JS
            </Button>

            <Modal
                show={activeModal === "js"}
                onClose={setActiveModal as () => void}
                key="custom-js-modal"
            >
                <Modal.Header>Custom JS</Modal.Header>
                <Modal.Body
                    className="h-[600px]"
                    style={ModalBody}
                    key="custom-js-modal-body"
                >
                    <MonacoEditor
                        ref={jsEditorRef as Ref<RefEditorInstance>}
                        className="h-full w-full"
                        key={block.id}
                        language="javascript"
                        value={block.attributes.customJS as string | undefined}
                        options={MonacoEditorOptions}
                        onChange={onJsChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button outline onClick={onJsCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onJsSave}>Save</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={activeModal === "css"}
                onClose={setActiveModal as () => void}
                key="custom-css-modal"
            >
                <Modal.Header>Custom CSS</Modal.Header>
                <Modal.Body
                    className="h-[600px]"
                    style={ModalBody}
                    key="custom-css-modal-body"
                >
                    <MonacoEditor
                        ref={cssEditorRef as Ref<RefEditorInstance>}
                        className="h-full w-full"
                        key={block.id}
                        language="css"
                        value={block.attributes.customCSS as string | undefined}
                        options={MonacoEditorOptions}
                        onChange={onCssChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button outline onClick={onCssCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onCssSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

const MonacoEditorOptions = {
    theme: "vs-dark",
};
const ModalBody = {
    padding: 0,
};
