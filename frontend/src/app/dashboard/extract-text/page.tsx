'use client'

import { useState, useEffect } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { pdfAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Copy, Download, Loader2 } from 'lucide-react'

export default function ExtractTextPage() {
  const [files, setFiles] = useState<File[]>([])
  const [useOcr, setUseOcr] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedText, setExtractedText] = useState<string>('')
  const [hasExtracted, setHasExtracted] = useState(false)

  // Clear result when files change
  useEffect(() => {
    if (hasExtracted) {
      // Clear result when files are removed or changed
      setExtractedText('')
      setHasExtracted(false)
    }
  }, [files])

  // Auto-reconvert when OCR setting changes after initial extraction
  useEffect(() => {
    if (hasExtracted && files.length > 0 && !isProcessing) {
      handleExtract()
    }
  }, [useOcr])

  const handleExtract = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const response = await pdfAPI.extractText(files[0], useOcr, setProgress)
      // Handle both object response {text: "..."} and string response
      const text = typeof response === 'object' && response.text ? response.text : String(response)
      setExtractedText(text)
      setHasExtracted(true)
      toast.success(`Text extracted ${useOcr ? 'with OCR' : 'successfully'}!`)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to extract text')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText)
    toast.success('Text copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'extracted-text.txt'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setFiles([])
    setExtractedText('')
    setProgress(0)
    setHasExtracted(false)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Extract Text</h1>
        <p className="text-gray-600 mb-8">
          Extract text from PDF documents or images using OCR
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column - Upload & Settings (30%) */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>
                  Select a PDF or image file to extract text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUpload
                  accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                  multiple={false}
                  files={files}
                  onFilesSelected={setFiles}
                  disabled={isProcessing}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useOcr"
                    checked={useOcr}
                    onChange={(e) => setUseOcr(e.target.checked)}
                    disabled={isProcessing}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="useOcr" className="text-sm font-medium">
                    Use OCR for PDFs
                  </label>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Extracting...</span>
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

                {!hasExtracted && (
                  <Button
                    onClick={handleExtract}
                    disabled={files.length === 0 || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      'Extract Text'
                    )}
                  </Button>
                )}

                {hasExtracted && (
                  <Button variant="outline" onClick={handleReset} disabled={isProcessing} className="w-full">
                    Start Over
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Text Viewer (70%) */}
          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Extracted Text</CardTitle>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {!extractedText ? (
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-6" style={{ minHeight: '700px' }}>
                    <div className="text-center text-gray-500">
                      <p className="text-lg font-medium mb-2">No text extracted</p>
                      <p className="text-sm">Upload a file and click Extract Text</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    {hasExtracted && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">
                          ✓ Text extracted {useOcr ? 'with OCR' : 'successfully'}! ({extractedText.length} characters)
                        </p>
                      </div>
                    )}
                    <textarea
                      value={extractedText}
                      readOnly
                      className="w-full p-4 border rounded-lg font-mono text-sm bg-white"
                      style={{ height: '750px' }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
