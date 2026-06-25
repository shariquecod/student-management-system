'use client'

import { RegisterForm } from '@/components/forms'
import { Card, CardContent } from '@/components/ui/card'
import {
  Leaf,
  Heart,
  Apple,
  Users,
  Sparkles,
  Zap,
  Star,
  Activity,
  Target,
  Award,
  ChefHat,
  Scale,
} from 'lucide-react'

export default function Register() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Nutritionist Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-white animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white animate-pulse delay-700"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles
            className="absolute top-20 right-16 w-8 h-8 text-white/20 animate-bounce"
            style={{ animationDelay: '0s', animationDuration: '3s' }}
          />
          <Heart
            className="absolute bottom-36 right-20 w-6 h-6 text-white/18 animate-bounce"
            style={{ animationDelay: '1s', animationDuration: '4s' }}
          />
          <Apple
            className="absolute top-1/2 left-20 w-10 h-10 text-white/15 animate-bounce"
            style={{ animationDelay: '2s', animationDuration: '3.5s' }}
          />
          <Users
            className="absolute bottom-16 left-24 w-7 h-7 text-white/22 animate-bounce"
            style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}
          />
          <Leaf
            className="absolute top-1/4 right-1/3 w-5 h-5 text-white/25 animate-bounce"
            style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}
          />
          <ChefHat
            className="absolute bottom-2/3 right-1/4 w-8 h-8 text-white/20 animate-bounce"
            style={{ animationDelay: '2.5s', animationDuration: '4s' }}
          />
        </div>

        <div className="flex flex-col justify-center items-center w-full p-12 relative z-10">
          {/* Logo */}
          <div className="mb-6 flex flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-2xl ">
              <span className="text-3xl font-bold text-indigo-600">F</span>
            </div>
            <div className="">
              <h1 className="text-4xl font-bold text-white text-center mb-2">
                FamGen Nutrition
              </h1>
              <p className="text-white/80 text-center text-lg">
                Professional Nutrition Management
              </p>
            </div>
          </div>

          {/* Welcome Message */}

          {/* Benefits Grid */}
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center space-x-4 p-3 px-5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex-shrink-0">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px]">
                  Goal-Oriented Plans
                </h3>
                <p className="text-white/70 text-sm">
                  Achieve your health objectives faster
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 px-5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex-shrink-0">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px]">
                  Evidence-Based
                </h3>
                <p className="text-white/70 text-sm">
                  Science-backed nutrition guidance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 px-5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex-shrink-0">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px]">
                  Track Progress
                </h3>
                <p className="text-white/70 text-sm">
                  Monitor and celebrate achievements
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 px-5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex-shrink-0">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px]">
                  Ongoing Support
                </h3>
                <p className="text-white/70 text-sm">
                  Continuous professional assistance
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          {/* <div className="mt-12 text-center">
            <div className="text-white/60 text-sm mb-4">
              Trusted by nutrition professionals worldwide
            </div>
            <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-white/70 text-xs">Expert Nutritionists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">25K+</div>
                <div className="text-white/70 text-xs">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-white/70 text-xs">Client Rating</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4">
              <span className="text-2xl font-bold text-white">F</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              FamGen Nutrition
            </h1>
            <p className="text-gray-600">
              Professional Nutrition Portal
            </p>
          </div>

          {/* Register Card */}
          <Card className="border-0 shadow-2xl bg-white/80">
            <CardContent className="p-8">
              <RegisterForm />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Empowering healthier lifestyles through nutrition science
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
