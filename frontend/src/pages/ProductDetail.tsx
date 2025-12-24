import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Package, ChevronLeft, ShoppingCart } from 'lucide-react'
import { Material } from '../types'
import { materialsAPI } from '../api/materials.api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id:  string }>()
  const navigate = useNavigate()
  const [material, setMaterial] = useState<Material | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchMaterial = async () => {
      if (! id) return
      try {
        const data = await materialsAPI.getById(id)
        setMaterial(data)
      } catch (err) {
        setError('Produk tidak ditemukan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterial()
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Silakan login terlebih dahulu')
      return
    }

    if (! material) return

    setIsAddingToCart(true)
    try {
      await addItem(material.id, quantity)
      setSuccessMessage(`${material.material_name} ditambahkan ke keranjang!`)
      setQuantity(1)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError('Gagal menambahkan ke keranjang')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error || !material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Produk
          </button>
        </div>
      </div>
    )
  }

  const getHazardColor = (hazardClass: string) => {
    const colors:  { [key: string]: string } = {
      'Explosive':  'bg-red-100 text-red-600',
      'Flammable Liquid': 'bg-orange-100 text-orange-600',
      'Corrosive':  'bg-yellow-100 text-yellow-700',
      'Poison': 'bg-purple-100 text-purple-600',
      'Radioactive': 'bg-green-100 text-green-600',
      'Oxidizer': 'bg-blue-100 text-blue-600',
    }
    return colors[hazardClass] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Kembali
        </button>

        {/* Product Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
            <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-32 h-32 text-white opacity-30" />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{material. material_name}</h1>
              <p className="text-gray-600 text-lg">Kode: {material.material_code}</p>
            </div>

            {/* Hazard Info */}
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <h3 className="font-semibold text-gray-800 text-lg">Informasi Bahaya</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Klasifikasi Bahaya</p>
                  <span className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${getHazardColor(material.hazzard_class)}`}>
                    {material.hazzard_class}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Level Bahaya</p>
                  <span className="inline-block px-3 py-1 rounded-lg font-semibold text-sm bg-red-100 text-red-600">
                    Level {material.hazzard_level}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">{material.desc}</p>
            </div>

            {/* Price & Stock */}
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Harga Satuan</p>
                <p className="text-3xl font-bold text-blue-600">
                  Rp {material.price.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Stok Tersedia</p>
                <p className={`text-xl font-semibold ${material.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {material.stock > 0 ? `${material.stock} unit` : 'Tidak Tersedia'}
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            {material.stock > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    ✓ {successMessage}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={material.stock}
                      className="w-16 text-center border border-gray-300 rounded-lg py-2"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(material.stock, quantity + 1))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Subtotal</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {(material.price * quantity).toLocaleString('id-ID')}
                  </p>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !isAuthenticated}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center space-x-2 font-semibold"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isAddingToCart ? 'Menambahkan.. .' : 'Tambah ke Keranjang'}</span>
                </button>

                {! isAuthenticated && (
                  <p className="text-sm text-orange-600 text-center">
                    Silakan login terlebih dahulu untuk menambahkan ke keranjang
                  </p>
                )}
              </div>
            )}

            {material.stock === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p className="font-semibold">Produk Tidak Tersedia</p>
                <p className="text-sm mt-1">Maaf, stok produk ini habis. Silakan cek produk lainnya.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produk Sejenis</h2>
          <button
            onClick={() => navigate(`/products? hazard_class=${encodeURIComponent(material.hazzard_class)}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Lihat Kategori {material.hazzard_class}
          </button>
        </div>
      </div>
    </div>
  )
}