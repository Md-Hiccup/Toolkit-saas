'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Check, Crown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function UpgradePage() {
  const { user } = useAuthStore()

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-gray-600">
            Unlock unlimited PDF processing and advanced features
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Premium Plan */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
              </div>
              <CardDescription>For power users</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <span className="font-medium">Unlimited operations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <span className="font-medium">Max 100MB file size</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <span className="font-medium">All PDF operations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <span className="font-medium">OCR text extraction</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <span className="font-medium">Priority processing</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <span className="font-medium">No watermarks</span>
                </li>
              </ul>
              <div className="mt-6">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Upgrade Now (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Payment integration coming soon. All features are currently available for testing.</p>
        </div>
      </div>
    </div>
  )
}
