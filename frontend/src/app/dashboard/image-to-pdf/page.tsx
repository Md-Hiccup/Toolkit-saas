'use client'

import { useState, useEffect } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { pdfAPI } from '@/lib/api'
import { formatFileSize } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Download, Loader2 } from 'lucide-react'

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [quality, setQuality] = useState('medium')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [hasConverted, setHasConverted] = useState(false)
  const [originalSize, setOriginalSize] = useState(0)
  const [pdfSize, setPdfSize] = useState(0)

  // Clear result when files change
  useEffect(() => {
    if (hasConverted) {
      // Clear result when files are removed or changed
      setResultBlob(null)
      setOriginalSize(0)
      setPdfSize(0)
      setHasConverted(false)
    }
  }, [files])

  // Auto-reconvert when quality changes after initial conversion
  useEffect(() => {
    if (hasConverted && files.length > 0 && !isProcessing) {
      handleConvert()
    }
  }, [quality])

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image file')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    // Only set original size on first conversion
    if (!hasConverted) {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0)
      setOriginalSize(totalSize)
    }

    try {
      const blob = await pdfAPI.imageToPDF(files, quality, setProgress)
      setResultBlob(blob)
      setPdfSize(blob.size)
      setHasConverted(true)
      toast.success(`PDF created with ${quality} quality!`)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to convert images')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return

    const url = window.URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.pdf'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleClearFiles = () => {
    setFiles([])
    setResultBlob(null)
    setOriginalSize(0)
    setPdfSize(0)
    setHasConverted(false)
  }

  const handleReset = () => {
    setFiles([])
    setResultBlob(null)
    setProgress(0)
    setOriginalSize(0)
    setPdfSize(0)
    setHasConverted(false)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Image to PDF</h1>
        <p className="text-gray-600 mb-8">
          Convert multiple images into a single PDF document with compression
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Upload Image Files</CardTitle>
            <CardDescription>
              Select one or more images (PNG, JPG, JPEG) to convert to PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <FileUpload
                accept=".png,.jpg,.jpeg"
                multiple={true}
                files={files}
                onFilesSelected={setFiles}
                disabled={isProcessing}
              />
              {files.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearFiles}
                    disabled={isProcessing}
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Output Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                disabled={isProcessing}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low (Smallest file, max 800px, 50% quality)</option>
                <option value="medium">Medium (Balanced, max 1200px, 65% quality)</option>
                <option value="high">High (Best quality, max 1600px, 80% quality)</option>
              </select>
              <p className="text-xs text-gray-500">
                Aggressive JPEG compression for minimal file size
              </p>
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
                  ✓ PDF ready with {quality} quality! {isProcessing && '(Re-converting...)'}
                </p>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Original images ({files.length}):</span>
                    <span className="font-medium">{formatFileSize(originalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PDF size:</span>
                    <span className="font-medium">{formatFileSize(pdfSize)}</span>
                  </div>
                  {pdfSize < originalSize ? (
                    <div className="flex justify-between text-green-700">
                      <span>Saved:</span>
                      <span className="font-medium">
                        {formatFileSize(originalSize - pdfSize)} ({Math.round((1 - pdfSize / originalSize) * 100)}%)
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-blue-700">
                      <span>Increase:</span>
                      <span className="font-medium">
                        {formatFileSize(pdfSize - originalSize)} ({Math.round((pdfSize / originalSize - 1) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleDownload} disabled={isProcessing}>
                    <Download className="mr-2 h-4 w-4" />
                    {isProcessing ? 'Processing...' : 'Download PDF'}
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
                  `Convert ${files.length} Image${files.length !== 1 ? 's' : ''} to PDF`
                )}
              </Button>
            )}
            
            {hasConverted && !resultBlob && (
              <div className="text-center text-sm text-gray-500 py-2">
                Change quality above to automatically re-convert
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
