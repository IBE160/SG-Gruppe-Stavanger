"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from "@zxing/library"
import { Camera, X, CheckCircle2, Keyboard } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const [error, setError] = useState<string>("")
  const [scanning, setScanning] = useState(true)
  const [manualMode, setManualMode] = useState(false)
  const [manualBarcode, setManualBarcode] = useState("")

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim())
      setManualBarcode("")
    }
  }

  useEffect(() => {
    if (manualMode || !videoRef.current) return

    // ZXing with aggressive hints for webcam
    const hints = new Map()
    hints.set(DecodeHintType.TRY_HARDER, true)
    hints.set(DecodeHintType.ASSUME_GS1, true)
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
    ])

    const reader = new BrowserMultiFormatReader(hints, 300)
    readerRef.current = reader

    const start = async () => {
      try {
        await reader.decodeFromVideoDevice(
          null, // Use default camera
          videoRef.current!,
          (result) => {
            if (result) {
              console.log("Barcode:", result.getText())
              reader.reset()
              onScan(result.getText())
              setScanning(false)
            }
          }
        )
      } catch (err) {
        console.error(err)
        setError("Camera error. Please allow permissions.")
      }
    }

    setTimeout(start, 100)

    return () => {
      reader.reset()
    }
  }, [manualMode, onScan])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Scan Barcode</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {manualMode ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 flex-shrink-0" />
                  <span>Enter the barcode number manually (e.g., 8419100020716)</span>
                </p>
              </div>

              <div>
                <label htmlFor="barcode" className="block text-sm font-semibold text-gray-900 mb-2">
                  Barcode Number
                </label>
                <input
                  type="text"
                  id="barcode"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="Enter barcode..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setManualMode(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back to Camera
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualBarcode.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 mb-4 font-medium">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setManualMode(true)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Enter Manually
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  className="w-full h-96 object-cover"
                  playsInline
                />

                {/* Grønn scanning linje overlay */}
                <div className="absolute inset-0 border-4 border-green-500/30 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-48 border-2 border-white/80 rounded-lg relative overflow-hidden">
                      <div
                        className="absolute left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                        style={{
                          top: '0',
                          animation: 'scanLine 3s ease-in-out infinite',
                          willChange: 'transform'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <style dangerouslySetInnerHTML={{
                  __html: `
                    @keyframes scanLine {
                      0% { transform: translateY(0); }
                      50% { transform: translateY(192px); }
                      100% { transform: translateY(0); }
                    }
                  `
                }} />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  {scanning ? (
                    <>
                      <Camera className="w-5 h-5 flex-shrink-0" />
                      <span>
                        <strong>Position the barcode within the frame.</strong> The scanner will
                        automatically detect it.
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span>
                        <strong>Barcode detected!</strong> Processing...
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setManualMode(true)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Keyboard className="w-5 h-5" />
                  Enter Manually
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
