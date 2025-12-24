import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Package, AlertTriangle, Flame, Droplet, Skull, Zap, Radiation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Material } from '../types'
import { materialsAPI } from '../api/materials.api'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

interface CategoryItem {
  name: string
  icon: React.ReactNode
  hazardClass: string
  color: string
}

export const Dashboard: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredMaterials, setFeaturedMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const slides = [
    {
      title: "Sistem Logistik Bahan Berbahaya",
      subtitle: "Pengelolaan dan Distribusi Terpercaya",
      bgColor: "from-blue-500 to-blue-700"
    },
    {
      title: "Keamanan Terjamin",
      subtitle: "Standar Internasional Hazmat",
      bgColor: "from-orange-500 to-red-600"
    },
    {
      title: "Tracking Real-time",
      subtitle:  "Monitor Pengiriman Anda",
      bgColor: "from-green-500 to-emerald-700"
    }
  ]

  const categories:  CategoryItem[] = [
    {
      name: "Explosive",
      icon: <Zap className="w-8 h-8" />,
      hazardClass: "Explosive",
      color: "bg-red-100 text-red-600 hover:bg-red-200"
    },
    {
      name: "Flammable",
      icon: <Flame className="w-8 h-8" />,
      hazardClass: "Flammable Liquid",
      color: "bg-orange-100 text-orange-600 hover:bg-orange-200"
    },
    {
      name: "Corrosive",
      icon: <Droplet className="w-8 h-8" />,
      hazardClass: "Corrosive",
      color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
    },
    {
      name: "Toxic",
      icon: <Skull className="w-8 h-8" />,
      hazardClass:  "Poison",
      color: "bg-purple-100 text-purple-600 hover:bg-purple-200"
    },
    {
      name: "Radioactive",
      icon:  <Radiation className="w-8 h-8" />,
      hazardClass: "Radioactive",
      color: "bg-green-100 text-green-600 hover:bg-green-200"
    },
    {
      name: "Oxidizer",
      icon: <AlertTriangle className="w-8 h-8" />,
      hazardClass: "Oxidizer",
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200"
    }
  ]

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Fetch featured materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materials = await materialsAPI.getAll({ limit: 6 })
        setFeaturedMaterials(materials. slice(0, 6))
      } catch (error) {
        console.error('Failed to fetch materials:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleCategoryClick = (category: CategoryItem) => {
    navigate(`/products?hazard_class=${encodeURIComponent(category.hazardClass)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Slider Section */}
      <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg">
        <div className="relative h-80 md:h-96">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ?  'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`w-full h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center`}>
                <div className="text-center text-white px-4">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-xl md:text-2xl opacity-90">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition z-10"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition z-10"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides. map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Kategori Pilihan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className={`${category.color} rounded-xl p-6 flex flex-col items-center justify-center space-y-2 transition-all transform hover:scale-105 shadow-sm hover:shadow-md`}
              >
                {category.icon}
                <span className="text-sm font-semibold text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Produk Unggulan</h2>
            <button
              onClick={() => navigate('/products')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Lihat Semua →
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(featuredMaterials)
                ? featuredMaterials.map((material) => (
                    <div
                      key={material.id}
                      onClick={() => navigate(`/products/${material.id}`)}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
                    >
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <Package className="w-24 h-24 text-white opacity-30" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{material.material_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Kode:  {material.material_code}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            {material.hazzard_class}
                          </span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            Level: {material.hazzard_level}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-blue-600 mb-3">
                          Rp {material.price. toLocaleString('id-ID')}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/products/${material.id}`)
                          }}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Pengiriman Aman</h3>
              <p className="text-sm text-gray-600">Standar keamanan internasional untuk bahan berbahaya</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Dokumentasi Lengkap</h3>
              <p className="text-sm text-gray-600">Sertifikat dan izin sesuai regulasi</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Tracking Real-time</h3>
              <p className="text-sm text-gray-600">Monitor status pengiriman kapan saja</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}