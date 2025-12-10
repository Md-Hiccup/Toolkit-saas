'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'
export default function ViewPdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleFileSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0]
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
      toast.success('PDF loaded!')
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">View PDF</h1>
        <p className="text-gray-600 mb-8">
          Upload and view PDF files
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column - Upload (30%) */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Upload PDF</CardTitle>
                <CardDescription>
                  Select a PDF file to view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept=".pdf"
                  multiple={false}
                  files={files}
                  onFilesSelected={handleFileSelected}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - PDF Viewer (70%) */}
          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>PDF Viewer</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {!pdfUrl ? (
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-6" style={{ minHeight: '700px' }}>
                    <div className="text-center text-gray-500">
                      <p className="text-lg font-medium mb-2">No PDF loaded</p>
                      <p className="text-sm">Upload a PDF file to view it</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden">
                    <iframe
                      src={pdfUrl}
                      className="w-full"
                      style={{ height: '850px' }}
                      title="PDF Viewer"
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
