'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Product } from '@/lib/types'

export default function NewProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState<'weaves' | 'smartphones' | 'laptops' | 'perfumes'>('smartphones')
  const [condition, setCondition] = useState<'new' | 'used'>('new')
  const [stock, setStock] = useState(1)
  const [image, setImage] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('You must be logged in to create a product.')
      return
    }

    let imageUrl = null
    if (image) {
      const { data, error } = await supabase.storage
        .from('product_images')
        .upload(`${user.id}/${Date.now()}_${image.name}`, image)

      if (error) {
        alert(`Error uploading image: ${error.message}`)
        return
      }
      const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(data.path)
      imageUrl = publicUrl
    }

    const { error } = await supabase.from('products').insert({
      name,
      description,
      price,
      category,
      condition,
      stock,
      image_url: imageUrl,
      user_id: user.id,
    })

    if (error) {
      alert(`Error creating product: ${error.message}`)
    } else {
      alert('Product created successfully!')
      router.push('/products')
      router.refresh()
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Add New Product</h1>
      <form onSubmit={handleCreateProduct}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="price">Price</label>
          <input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as any)} required style={{ width: '100%', padding: '8px' }}>
            <option value="weaves">Weaves</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="perfumes">Perfumes</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="condition">Condition</label>
          <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as any)} required style={{ width: '100%', padding: '8px' }}>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="stock">Stock</label>
          <input id="stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="image">Image</label>
          <input id="image" type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Create Product</button>
      </form>
    </div>
  )
}
