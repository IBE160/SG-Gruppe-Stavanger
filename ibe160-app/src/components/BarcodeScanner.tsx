"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library"
import { Camera, X, CheckCircle2 } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string>("")
  const [scanning, setScanning] = useState(true)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()
    readerRef.current = codeReader

    const startScanning = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices()
        if (videoInputDevices.length === 0) {
          setError("No camera found")
          return
        }

        const selectedDeviceId = videoInputDevices[0].deviceId

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, error) => {
            if (result) {
              const barcode = result.getText()
              onScan(barcode)
              setScanning(false)
              codeReader.reset()
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error("Scan error:", error)
            }
          }
        )
      } catch (err) {
        console.error("Camera error:", err)
        setError("Failed to access camera. Please allow camera permissions.")
      }
    }

    startScanning()

    return () => {
      if (readerRef.current) {
        readerRef.current.reset()
      }
    }
  }, [onScan])

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
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 mb-4 font-medium">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  className="w-full h-96 object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute inset-0 border-4 border-green-500/30 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-48 border-2 border-white/80 rounded-lg"></div>
                  </div>
                </div>
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

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
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
