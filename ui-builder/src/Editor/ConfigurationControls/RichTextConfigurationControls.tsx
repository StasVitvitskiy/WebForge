import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";
import { HiSun, HiOutlineSun } from "react-icons/hi";

export function RichTextConfigurationControls({
    block,
    onChange,
}: {
    block: UiModelBuildingBlock;
    onChange: (block: UiModelBuildingBlock) => void;
}): JSX.Element {
    const localState = useRef(block.attributes.richText ?? "");

    return (
        <div
            className={`relative ${
                block.attributes.richTextMode === "dark"
                    ? "bg-gray-800"
                    : "bg-white"
            } block min-h-[150px] w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6`}
        >
            <Editor
                onEditorChange={(richText) => {
                    localState.current = richText;
                }}
                onBlur={() => {
                    onChange({
                        ...block,
                        attributes: {
                            ...block.attributes,
                            richText: localState.current,
                        },
                    });
                }}
                apiKey="pa8nqxpwvb0pn6346qb04hpdr2fr9dssphef970iaytjhb56"
                initialValue={(block.attributes.richText as string) ?? ""}
                inline
                init={{
                    plugins:
                        "paste importcss autolink autosave save directionality code visualblocks visualchars fullscreen link charmap hr nonbreaking anchor toc insertdatetime advlist lists wordcount textpattern help charmap quickbars emoticons",
                    menubar: "edit view insert format tools",
                    toolbar:
                        "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen | link anchor codesample | ltr rtl",
                    toolbar_sticky: true,
                    autosave_ask_before_unload: true,
                    autosave_interval: "30s",
                    autosave_prefix: "{path}{query}-{id}-",
                    autosave_restore_when_empty: false,
                    autosave_retention: "2m",
                    importcss_append: true,
                    height: 600,
                    quickbars_selection_toolbar:
                        "bold italic | quicklink h2 h3 blockquote",
                    toolbar_mode: "sliding",
                    contextmenu: "link",
                    skin: "oxide-dark",
                }}
            />

            <div className="absolute right-0 bottom-0 flex p-1">
                {block.attributes.richTextMode !== "dark" && (
                    <HiSun
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => {
                            onChange({
                                ...block,
                                attributes: {
                                    ...block.attributes,
                                    richTextMode: "dark",
                                },
                            });
                        }}
                    />
                )}
                {block.attributes.richTextMode === "dark" && (
                    <HiOutlineSun
                        className="h-5 w-5 cursor-pointer text-white"
                        onClick={() => {
                            onChange({
                                ...block,
                                attributes: {
                                    ...block.attributes,
                                    richTextMode: "light",
                                },
                            });
                        }}
                    />
                )}
            </div>
        </div>
    );
}
