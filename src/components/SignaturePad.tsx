"use client";

import { useRef, useState, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSignatureChange: (type: "draw" | "type", data: string) => void;
}

export default function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState("");
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleClear = useCallback(() => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      onSignatureChange("draw", "");
    }
  }, [onSignatureChange]);

  const handleDrawEnd = useCallback(() => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      onSignatureChange("draw", dataUrl);
    }
  }, [onSignatureChange]);

  const handleTypeChange = useCallback(
    (value: string) => {
      setTypedName(value);
      onSignatureChange("type", value);
    },
    [onSignatureChange]
  );

  const handleModeSwitch = useCallback(
    (newMode: "draw" | "type") => {
      setMode(newMode);
      if (newMode === "draw") {
        onSignatureChange("draw", "");
      } else {
        onSignatureChange("type", typedName);
      }
    },
    [onSignatureChange, typedName]
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Signature <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeSwitch("draw")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "draw"
              ? "bg-brand text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Draw Signature
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("type")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "type"
              ? "bg-brand text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Type Signature
        </button>
      </div>

      {mode === "draw" ? (
        <div>
          <div className="border-2 border-gray-300 rounded-lg bg-white touch-none">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: "w-full h-40 md:h-48",
              }}
              onEnd={handleDrawEnd}
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear signature
          </button>
          <p className="text-xs text-gray-400 mt-1">
            Use your finger, stylus, or mouse to draw your signature above
          </p>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={typedName}
            onChange={(e) => handleTypeChange(e.target.value)}
            placeholder="Type your full legal name"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl text-gray-800"
            style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
          />
          {typedName && (
            <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Signature preview:</p>
              <p
                className="text-3xl text-gray-800"
                style={{
                  fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
                }}
              >
                {typedName}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
