import React, { useState, useEffect } from 'react'
import { Material } from '../types'
import { materialsAPI } from '../api/materials.api'
import { ProductCard } from '../components/products/ProductCard'
import { CategoryFilter } from '../components/products/CategoryFilter'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

const HAZARD_CLASSES = [
  'Explosive',
  'Flammable Liquid',
  'Corrosive',
  'Poison',
  'Radioactive',
  'Oxidizer',
]

export const Products: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await materialsAPI.getAll({
          hazard_class: selectedCategory || undefined,
          search: searchQuery || undefined,
        })
        setMaterials(data)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Daftar Produk</h1>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Cari material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus: ring-2 focus:ring-blue-500"
            />
          </div>

          <CategoryFilter
            categories={HAZARD_CLASSES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        {isLoading ?  (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : materials.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            Tidak ada produk yang sesuai
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <ProductCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}