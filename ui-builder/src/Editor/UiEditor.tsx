import React from "react";

export function UiEditor() {
    return (
        <div className="h-full grid grid-cols-[20%_1fr_20%]">
            <div className="bg-gray-800 text-white">Left Panel</div>
            <div>Canvas</div>
            <div className="bg-gray-800 text-white">Right Panel</div>
        </div>
    );
}
