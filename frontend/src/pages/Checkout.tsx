import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { ordersAPI } from '../api/orders.api'
import { useNavigate } from 'react-router-dom'

export const Checkout: React.FC = () => {
  const { items:  cartItems, summary, clearCart } = useCart()
  const navigate = useNavigate()

  const [deliveryType, setDeliveryType] = useState<'SUPPLY' | 'BUY'>('BUY')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const order = await ordersAPI.createOrder({
        delivery_type:  deliveryType,
        delivery_address: deliveryAddress,
        notes,
        items: cartItems. map((item) => ({
          material_id: item.material_id,
          quantity: item. quantity,
        })),
      })

      await clearCart()
      navigate(`/order-confirmation/${order.id}`)
    } catch (err: any) {
      setError(err. response?.data?.message || 'Checkout failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (! cartItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Keranjang Anda Kosong
          </h1>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lanjutkan Belanja
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Delivery Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Tipe Pengiriman
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="BUY"
                      checked={deliveryType === 'BUY'}
                      onChange={(e) => setDeliveryType(e.target.value as 'BUY')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Pembelian (BUY)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="SUPPLY"
                      checked={deliveryType === 'SUPPLY'}
                      onChange={(e) => setDeliveryType(e.target.value as 'SUPPLY')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Pengiriman Stok (SUPPLY)</span>
                  </label>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Pengiriman
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
              >
                {isLoading ? 'Processing...' : 'Confirm Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Ringkasan Order</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.material. material_name}
                    </p>
                    <p className="text-gray-600">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    Rp {item.subtotal. toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-semibold">Rp {summary?. total.toLocaleString('id-ID')}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Ongkir</p>
                <p className="font-semibold">Rp 0</p>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t">
                <p>Total</p>
                <p>Rp {summary?.total. toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}