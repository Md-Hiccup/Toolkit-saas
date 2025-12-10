'use client'

import { useState, useEffect } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { pdfAPI } from '@/lib/api'
import { formatFileSize } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Download, Loader2 } from 'lucide-react'

export default function PdfToImagePage() {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState('png')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [hasConverted, setHasConverted] = useState(false)
  const [originalSize, setOriginalSize] = useState(0)
  const [zipSize, setZipSize] = useState(0)

  // Clear result when files change
  useEffect(() => {
    if (hasConverted) {
      // Clear result when files are removed or changed
      setResultBlob(null)
      setOriginalSize(0)
      setZipSize(0)
      setHasConverted(false)
    }
  }, [files])

  // Auto-reconvert when format changes after initial conversion
  useEffect(() => {
    if (hasConverted && files.length > 0 && !isProcessing) {
      handleConvert()
    }
  }, [format])

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    
    // Only set original size on first conversion
    if (!hasConverted) {
      setOriginalSize(files[0].size)
    }

    try {
      const blob = await pdfAPI.pdfToImage(files[0], format, setProgress)
      setResultBlob(blob)
      setZipSize(blob.size)
      setHasConverted(true)
      toast.success(`Images created in ${format.toUpperCase()} format!`)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to convert PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return

    const url = window.URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `images.zip`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setFiles([])
    setResultBlob(null)
    setProgress(0)
    setHasConverted(false)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">PDF to Image</h1>
        <p className="text-gray-600 mb-8">
          Convert PDF pages to PNG or JPG images
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Upload PDF File</CardTitle>
            <CardDescription>
              Select a PDF file to convert to images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload
              accept=".pdf"
              multiple={false}
              files={files}
              onFilesSelected={setFiles}
              disabled={isProcessing}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                disabled={isProcessing}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="png">PNG (Better quality)</option>
                <option value="jpg">JPG (Smaller size)</option>
              </select>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {resultBlob && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                <p className="text-green-800 font-medium">
                  ✓ Images ready in {format.toUpperCase()} format! {isProcessing && '(Re-converting...)'}
                </p>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Original PDF:</span>
                    <span className="font-medium">{formatFileSize(originalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Images ZIP:</span>
                    <span className="font-medium">{formatFileSize(zipSize)}</span>
                  </div>
                  {zipSize > originalSize && (
                    <div className="flex justify-between text-blue-700">
                      <span>Increase:</span>
                      <span className="font-medium">
                        {formatFileSize(zipSize - originalSize)} ({Math.round((zipSize / originalSize - 1) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleDownload} disabled={isProcessing}>
                    <Download className="mr-2 h-4 w-4" />
                    {isProcessing ? 'Processing...' : 'Download Images (ZIP)'}
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                    Start Over
                  </Button>
                </div>
              </div>
            )}

            {!hasConverted && (
              <Button
                onClick={handleConvert}
                disabled={files.length === 0 || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  'Convert to Images'
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
