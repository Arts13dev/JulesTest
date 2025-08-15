import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Product } from '@/lib/types'

export default async function ProductsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: products, error } = await supabase.from('products').select('*')

  if (error) {
    return <p>Error loading products: {error.message}</p>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Products</h1>
      <Link href="/products/new" style={{ marginBottom: '20px', display: 'inline-block' }}>
        Add New Product
      </Link>
      <div>
        {products.map((product: Product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <Link href={`/products/${product.id}`}>
              <h2>{product.name}</h2>
            </Link>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
