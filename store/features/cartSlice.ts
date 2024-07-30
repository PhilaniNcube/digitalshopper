import { CartItem, CartProduct } from "@/interfaces";
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface CartState {
  cartItems:CartItem[],
  open:boolean
}

const initialState:CartState = {
  cartItems: [],
  open:false
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increment: (state, action:PayloadAction<CartProduct>) => {
       // check if the product is already in the cart
       const item = state.cartItems.find(item => item.product.product.id === action.payload.product.id && item.product.selectedVariant === action.payload.selectedVariant)

       // if it is, increment the qty
        if (item) item.qty++

      // if not, add it to the cart
        else {
          state.cartItems.push({
            product: action.payload,
            qty: 1
          })
        }
    },

    decrement:(state, action:PayloadAction<CartProduct>) => {
   // check if the product is already in the cart
       const item = state.cartItems.find(item => item.product.product.id === action.payload.product.id && item.product.selectedVariant === action.payload.selectedVariant)

        // if it is, decrement the qty
        if (item) {
          // if the qty is 1, remove the item from the cart
          if (item.qty === 1) {
            state.cartItems = state.cartItems.filter(item => !(item.product.product.id === action.payload.product.id && item.product.selectedVariant === action.payload.selectedVariant))
          }
          // if not, decrement the qty
          else item.qty--
        }

    },

    //delete item from cart
    deleteItem:(state, action:PayloadAction<CartProduct>) => {
      state.cartItems = state.cartItems.filter(item => !(item.product.product.id === action.payload.product.id && item.product.selectedVariant === action.payload.selectedVariant))
    },

    //clear cart
    clearCart:(state) => {
      state.cartItems = []
    },

    // function to open cart
    openCart:(state) => {
      state.open = true
    },

    // function to close cart
    closeCart:(state) => {
      state.open = false
    },

    // function to toggle cart
     toggleCart:(state) => {
      state.open = !state.open
    }



  }
})

export const isOpen = (state:RootState) => state.cart.open

const cartItems = (state:RootState) => state.cart.cartItems



export const totalCartItems = createSelector([cartItems], (cartItems:CartItem[]) => cartItems.reduce((acc, item) => acc + item.qty, 0))

export const totalCartPrice = createSelector([cartItems], (cartItems:CartItem[]) => cartItems.reduce((acc, item) => acc + item.qty * item.product.product.price, 0))

export const productQty = createSelector([cartItems, (cartItems:CartItem[], productId:string) => productId], (cartItems, productId) => cartItems.find(item => item.product.product.id === productId)?.qty || 0)

export const { increment, decrement, toggleCart, openCart, closeCart, deleteItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
