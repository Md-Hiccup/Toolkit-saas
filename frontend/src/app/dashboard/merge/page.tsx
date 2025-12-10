'use client'

import { useState, useEffect } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { pdfAPI } from '@/lib/api'
import { formatFileSize } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Download, Loader2 } from 'lucide-react'

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [mergedSize, setMergedSize] = useState(0)

  // Clear result when files change (added or removed)
  useEffect(() => {
    if (resultBlob) {
      // If we had a result and files changed, clear it
      setResultBlob(null)
      setOriginalSize(0)
      setMergedSize(0)
    }
  }, [files])

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    // Calculate total original size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    setOriginalSize(totalSize)

    try {
      const blob = await pdfAPI.mergePDFs(files, setProgress)
      setResultBlob(blob)
      setMergedSize(blob.size)
      toast.success('PDFs merged successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to merge PDFs')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return

    const url = window.URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'merged.pdf'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleClearFiles = () => {
    setFiles([])
    setResultBlob(null)
    setOriginalSize(0)
    setMergedSize(0)
  }

  const handleReset = () => {
    setFiles([])
    setResultBlob(null)
    setProgress(0)
    setOriginalSize(0)
    setMergedSize(0)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Merge PDFs</h1>
        <p className="text-gray-600 mb-8">
          Combine multiple PDF files into a single document
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Upload PDF Files</CardTitle>
            <CardDescription>
              Select at least 2 PDF files to merge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <FileUpload
                accept=".pdf"
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
                  ✓ PDFs merged successfully!
                </p>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Original files ({files.length}):</span>
                    <span className="font-medium">{formatFileSize(originalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merged PDF:</span>
                    <span className="font-medium">{formatFileSize(mergedSize)}</span>
                  </div>
                  {mergedSize < originalSize && (
                    <div className="flex justify-between text-green-700">
                      <span>Saved:</span>
                      <span className="font-medium">
                        {formatFileSize(originalSize - mergedSize)} ({Math.round((1 - mergedSize / originalSize) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Merged PDF
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Merge More Files
                  </Button>
                </div>
              </div>
            )}

            {!resultBlob && (
              <Button
                onClick={handleMerge}
                disabled={files.length < 2 || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Merging...
                  </>
                ) : (
                  `Merge ${files.length} PDF${files.length !== 1 ? 's' : ''}`
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
