import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { CartItem, CartSummary } from '../types'
import { cartAPI } from '../api/cart.api'
import { useAuth } from './AuthContext'

interface CartContextType {
  items: CartItem[]
  summary: CartSummary | null
  isLoading: boolean
  addItem: (materialId: string, quantity: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

export const CartContext = React.createContext<CartContextType | undefined>(undefined)

export const CartProvider:  React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [summary, setSummary] = useState<CartSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch cart when user logs in
  const refreshCart = async () => {
    if (!isAuthenticated) return
    setIsLoading(true)
    try {
      const cartData = await cartAPI.getCart()
      setItems(cartData.items || [])
      setSummary(cartData)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    }
  }, [isAuthenticated])

  const addItem = async (materialId: string, quantity: number) => {
    try {
      const newItem = await cartAPI.addItem(materialId, quantity)
      setItems([...items, newItem])
      await refreshCart() // Sync with server
    } catch (error) {
      console.error('Failed to add item:', error)
      throw error
    }
  }

  const updateItem = async (itemId: string, quantity:  number) => {
    try {
      await cartAPI.updateItem(itemId, quantity)
      await refreshCart()
    } catch (error) {
      console.error('Failed to update item:', error)
      throw error
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await cartAPI.removeItem(itemId)
      setItems(items.filter((item) => item.id !== itemId))
      await refreshCart()
    } catch (error) {
      console.error('Failed to remove item:', error)
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clearCart()
      setItems([])
      setSummary(null)
    } catch (error) {
      console.error('Failed to clear cart:', error)
      throw error
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export default CartProvider;