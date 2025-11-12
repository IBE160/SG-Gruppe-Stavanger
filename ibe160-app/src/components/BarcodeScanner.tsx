"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, X, CheckCircle2, Keyboard } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<any>(null)
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
    if (manualMode) return

    const startScanner = async () => {
      try {
        // Dynamic import for client-side only
        const { Html5Qrcode } = await import("html5-qrcode")

        const html5QrCode = new Html5Qrcode("barcode-scanner")
        scannerRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
          },
          (decodedText) => {
            console.log("Barcode detected:", decodedText)
            html5QrCode.stop()
            onScan(decodedText)
            setScanning(false)
          },
          (errorMessage) => {
            // Silently ignore scanning errors
          }
        )
      } catch (err) {
        console.error("Scanner error:", err)
        setError("Failed to access camera. Please allow camera permissions.")
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error)
      }
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
                {/* html5-qrcode scanner container */}
                <div id="barcode-scanner" className="w-full" />

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
                    #barcode-scanner video {
                      width: 100% !important;
                      height: 400px !important;
                      object-fit: cover;
                      border-radius: 0.75rem;
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
