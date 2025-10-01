import React, { useEffect, useState, useRef, useMemo } from "react";
import { BarcodeFormat, BrowserMultiFormatReader } from "@zxing/browser";
import "./../styles/Components.css";

export default function BarcodeScanner({ onScan, active }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const [roiSize, setRoiSize] = useState(() => {
    const saved = localStorage.getItem("roiSize");
    return saved ? parseFloat(saved) : 0.3;
  });
  useEffect(() => {
    localStorage.setItem("roiSize", roiSize);
  }, [roiSize]);
  const roi = useMemo(() => ({ 
    x: (1 - roiSize) / 2, 
    y: (1 - roiSize) / 2, 
    width: roiSize, 
    height: roiSize 
  }), [roiSize]);

  useEffect(() => {
    if (!active) {
      // ha nem aktív, leállítjuk a kamerát
      try {
        codeReaderRef.current?.stop();
      } catch (e) {
        console.warn("Error stopping scanner:", e);
      }
      return;
    }
    // Reader létrehozása
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    const constraints = { video: { facingMode: "environment" } }
    // Kamera indítása, háttérben a legjobb kamera (mobil: environment)
    codeReader
      .decodeFromConstraints(
        constraints, videoRef.current,
        (result, err) => {
          if (result) {
            onScan(result.getText());
          }
          if (err && !(err.name === "NotFoundException")) {
            console.error("Scanner error:", err);
          }
        },
        { possibleFormats: [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.UPC_A],
          tryHarder: true,
          roi: roi,  }
      )
      .catch((err) => console.error("Cannot start scanner:", err));

    // Cleanup: leállítás unmount-nál
    return () => {
      try {
        codeReader.stop(); // leállítja a kamerát
      } catch (e) {
        console.warn("Error stopping barcode scanner:", e);
      }
    };
  }, [onScan,active,roi]);
  return (
    <div>
      <div className="barcodescanner-container">
        <video ref={videoRef} className="barcodescanner-video"/>
        <div>
          <div className="barcodescanner-blur"
              style={{top: 0, left: 0, right: 0, height: `${roi.y * 100}%`}} />
          <div className="barcodescanner-blur"
              style={{top: `${(roi.y + roi.height) * 100}%`,left: 0, right: 0, bottom: 0}} />
          <div className="barcodescanner-blur"
              style={{top: `${roi.y * 100}%`, left: 0, width: `${roi.x * 100}%`, height: `${roi.height * 100}%`}} />
          <div className="barcodescanner-blur"
              style={{top: `${roi.y * 100}%`, left: `${(roi.x + roi.width) * 100}%`, right: 0, height: `${roi.height * 100}%`}} />
          <div className="barcodescanner-roi"
            style={{ top: `${roi.y * 100}%`, left: `${roi.y * 100}%`, width: `${roi.width * 100}%`, height: `${roi.height * 100}%`}}/>
        </div>
      </div>
      <div className="barcodescanner-buttonbar">
        <button className="barcodescanner-button" onClick={() => setRoiSize((s) => Math.max(s - 0.05, 0.1))}>–</button>
        <button className="barcodescanner-button" onClick={() => setRoiSize((s) => Math.min(s + 0.05, 1))}>+</button>
      </div>
    </div>
  );
}