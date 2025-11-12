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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string>("")
  const [scanning, setScanning] = useState(true)
  const [manualMode, setManualMode] = useState(false)
  const [manualBarcode, setManualBarcode] = useState("")
  const [processing, setProcessing] = useState(false)

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim())
      setManualBarcode("")
    }
  }

  const captureAndDecode = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setProcessing(true)
    setError("")

    try {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas size to video size
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Create reader with aggressive hints
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

      const reader = new BrowserMultiFormatReader(hints)

      // Convert canvas to image and decode
      const imageUrl = canvas.toDataURL('image/png')
      const img = new Image()
      img.src = imageUrl

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const result = await reader.decodeFromImageElement(img)

      if (result) {
        console.log("Barcode found:", result.getText())
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
        onScan(result.getText())
        setScanning(false)
      }
    } catch (err) {
      console.error("Decode error:", err)
      setError("Kunne ikke lese. Prøv igjen!")
      setTimeout(() => setError(""), 2000) // Clear error after 2s
    } finally {
      setProcessing(false)
    }
  }

  useEffect(() => {
    if (manualMode) return

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (err) {
        console.error(err)
        setError("Tillat kamera-tilgang")
      }
    }

    start()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [manualMode])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Skann Strekkode</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
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
              <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-96 object-cover"
                  playsInline
                  autoPlay
                  muted
                />

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Scanning frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-72 h-56 border-2 border-white rounded-lg"></div>
                </div>
              </div>

              {error && (
                <div className="mb-3 text-center text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={captureAndDecode}
                disabled={processing}
                className="w-full px-6 py-4 bg-black text-white font-semibold text-lg rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
              >
                {processing ? "Søker..." : "Ta Bilde"}
              </button>

              <button
                onClick={() => setManualMode(true)}
                className="w-full px-4 py-2 text-gray-600 text-sm hover:text-gray-900 underline"
              >
                Skriv inn manuelt
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
