import React, { createContext, useState, useEffect } from 'react'

type Item = { id:string, title:string, price:number, quantity:number }

type Context = {
  items: Item[];
  addItem: (it: Item) => void;
  removeItem: (id:string) => void;
  clear: () => void;
}

export const CartContext = createContext<Context>({} as Context)

export const CartProvider: React.FC<any> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(()=>{
    const raw = localStorage.getItem('fes_cart')
    if(raw) setItems(JSON.parse(raw))
  }, [])

  useEffect(()=>{
    localStorage.setItem('fes_cart', JSON.stringify(items))
  }, [items])

  function addItem(it: Item){
    setItems(prev => {
      const exists = prev.find(p=>p.id===it.id)
      if(exists) return prev.map(p=>p.id===it.id?{...p, quantity: p.quantity+it.quantity}:p)
      return [...prev, it]
    })
  }

  function removeItem(id:string){ setItems(prev => prev.filter(p=>p.id!==id)) }
  function clear(){ setItems([]) }

  return (<CartContext.Provider value={{ items, addItem, removeItem, clear }}>{children}</CartContext.Provider>)
}
