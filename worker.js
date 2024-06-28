addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const url = new URL(request.url)
    
    // Obtener los parámetros de la imagen
    const width = parseInt(url.searchParams.get('width')) || 800
    const height = parseInt(url.searchParams.get('height')) || 600
    
    // URL de la imagen original
    const imageUrl = 'https://example.com' + url.pathname
    
    // Verificar si la imagen está en la cache
    const cache = caches.default
    let response = await cache.match(request)
    
    if (!response) {
      // Obtener la imagen original
      const imageResponse = await fetch(imageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()
      
      // Usar Cloudflare Image Resizing API para redimensionar la imagen
      response = await fetch(imageUrl, {
        cf: {
          image: {
            width,
            height,
            fit: 'scale-down'
          }
        }
      })
      
      // Clonar la respuesta para poder almacenarla en cache
      const responseClone = response.clone()
      
      // Almacenar la respuesta en la cache
      event.waitUntil(cache.put(request, responseClone))
    }
    
    return response
  }
  