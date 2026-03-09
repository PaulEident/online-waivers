"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface EventQRCodeProps {
  shortCode: string;
  eventName: string;
}

export default function EventQRCode({ shortCode, eventName }: EventQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [baseUrl, setBaseUrl] = useState("");

  const shortUrl = `/e/${shortCode}`;

  useEffect(() => {
    setBaseUrl(`${window.location.origin}`);
  }, []);

  useEffect(() => {
    if (!baseUrl || !canvasRef.current) return;

    const fullUrl = `${baseUrl}${shortUrl}`;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas dimensions for a print-friendly QR card
    const width = 400;
    const height = 520;
    canvas.width = width;
    canvas.height = height;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Generate QR code to a temporary canvas, then draw it centered
    const tempCanvas = document.createElement("canvas");
    QRCode.toCanvas(tempCanvas, fullUrl, {
      width: 280,
      margin: 2,
      color: { dark: "#1F2937", light: "#ffffff" },
    }).then(() => {
      // Draw QR code centered
      const qrX = (width - 280) / 2;
      const qrY = 40;
      ctx.drawImage(tempCanvas, qrX, qrY, 280, 280);

      // "Scan to sign waiver" text
      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to Sign Waiver", width / 2, 355);

      // Event name
      ctx.fillStyle = "#EA580C";
      ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

      // Truncate long event names
      let displayName = eventName;
      while (ctx.measureText(displayName).width > width - 60 && displayName.length > 10) {
        displayName = displayName.slice(0, -1);
      }
      if (displayName !== eventName) displayName += "…";
      ctx.fillText(displayName, width / 2, 390);

      // Short URL text
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "14px monospace";
      ctx.fillText(fullUrl, width / 2, 420);

      // Divider line
      ctx.strokeStyle = "#E5E7EB";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 445);
      ctx.lineTo(width - 60, 445);
      ctx.stroke();

      // Volntir branding
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.fillText("Powered by Volntir", width / 2, 470);

      // volntir.com
      ctx.fillStyle = "#D1D5DB";
      ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.fillText("volntir.com", width / 2, 490);
    });
  }, [baseUrl, shortUrl, eventName]);

  function downloadQR() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `volntir-qr-${shortCode.toLowerCase()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">QR Code</h2>
      <p className="text-sm text-gray-500 mb-4">
        Download and print this QR code so attendees can scan it to sign the waiver.
      </p>

      <div className="flex flex-col items-center">
        <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 mb-4">
          <canvas ref={canvasRef} className="w-[200px] h-[260px]" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadQR}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white font-semibold text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PNG
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
