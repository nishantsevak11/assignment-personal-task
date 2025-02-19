'use client' // This must be the first line in the file

import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, LayoutDashboard, Calendar, Bell, Users } from 'lucide-react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="w-full border-b">
        <div className="container px-4 md:px-6 flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            TaskMaster
          </Link>
          <nav>
            {session ? (
              <Link href="/dashboard">
                <Button size="sm" className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                  Dashboard <LayoutDashboard className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="sm" 
                onClick={() => signIn()}
                className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Manage Your Tasks Efficiently
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                A simple and intuitive task management application to help you stay organized and productive.
              </p>
            </div>
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={() => signIn()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-blue-600" />
              <h3 className="text-xl font-bold">Task Tracking</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Easily track and manage your tasks with a simple and intuitive interface.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <Calendar className="h-12 w-12 text-blue-600" />
              <h3 className="text-xl font-bold">Deadline Reminders</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Never miss a deadline with timely reminders and notifications.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <Users className="h-12 w-12 text-blue-600" />
              <h3 className="text-xl font-bold">Collaboration</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Collaborate with your team and assign tasks seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Boost Your Productivity?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Join thousands of users who are already managing their tasks efficiently with TaskMaster.
            </p>
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={() => signIn()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 py-6 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2023 TaskMaster. All rights reserved.
          </p>
          <nav className="flex space-x-4">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}