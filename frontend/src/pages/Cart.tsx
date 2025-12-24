import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export const Cart: React.FC = () => {
  const { items, summary, isLoading, removeItem, updateItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const handleUpdateQuantity = async (itemId: string, newQuantity:  number) => {
    if (newQuantity < 1) return
    
    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      await updateItem(itemId, newQuantity)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const handleRemove = async (itemId: string) => {
    if (window.confirm('Hapus item ini dari keranjang?')) {
      setUpdatingItems(prev => new Set(prev).add(itemId))
      try {
        await removeItem(itemId)
      } finally {
        setUpdatingItems(prev => {
          const next = new Set(prev)
          next.delete(itemId)
          return next
        })
      }
    }
  }

  if (! isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Silakan Login</h1>
          <p className="text-gray-600 mb-6">
            Anda harus login terlebih dahulu untuk melihat keranjang belanja.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) return <LoadingSpinner />

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center bg-white rounded-lg shadow-md p-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Keranjang Kosong</h1>
            <p className="text-gray-600 mb-6">Belum ada produk di keranjang Anda</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Lanjutkan Belanja
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Keranjang Belanja</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 p-6 last:border-b-0 hover:bg-gray-50 transition"
                >
                  <div className="flex gap-4">
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {item.material. material_name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Kode: {item.material.material_code}
                      </p>
                      <div className="flex gap-2 mb-3">
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          {item.material.hazzard_class}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          Level: {item.material.hazzard_level}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        Rp {item.material.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={updatingItems.has(item.id)}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(item.id, parseInt(e. target.value) || 1)
                          }
                          className="w-12 text-center border-l border-r border-gray-300 py-1"
                          min="1"
                        />
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={updatingItems.has(item. id)}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                        <p className="text-lg font-bold text-gray-800">
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={updatingItems.has(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Ringkasan Pesanan</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Jumlah Item</p>
                  <p className="font-semibold text-gray-800">{items.length}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Total Qty</p>
                  <p className="font-semibold text-gray-800">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-semibold">
                    Rp {summary?. total. toLocaleString('id-ID') || 0}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Ongkir</p>
                  <p className="font-semibold">Rp 0</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Pajak</p>
                  <p className="font-semibold">Rp 0</p>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-blue-600 mb-6">
                <p>Total</p>
                <p>Rp {summary?.total. toLocaleString('id-ID') || 0}</p>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Lanjut ke Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Lanjutkan Belanja
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}