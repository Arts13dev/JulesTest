import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Image from 'next/image'

type ProductPageProps = {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !product) {
    return <p>Product not found.</p>
  }

  return (
    <div style={{ padding: '20px' }}>
      {product.image_url && (
        <Image
          src={product.image_url}
          alt={product.name}
          width={400}
          height={400}
          style={{ objectFit: 'cover' }}
        />
      )}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <p>Condition: {product.condition}</p>
      <p>Stock: {product.stock}</p>
    </div>
  )
}
