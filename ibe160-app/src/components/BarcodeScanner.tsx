"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library"

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
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">📷 Scan Barcode</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-96 object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute inset-0 border-4 border-blue-500 opacity-50 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-48 border-2 border-white"></div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  {scanning ? (
                    <>
                      📱 <strong>Position the barcode within the frame.</strong> The scanner will
                      automatically detect it.
                    </>
                  ) : (
                    <>
                      ✅ <strong>Barcode detected!</strong> Processing...
                    </>
                  )}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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
