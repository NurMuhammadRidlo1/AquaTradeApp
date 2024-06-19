document.addEventListener('DOMContentLoaded', () => {
  fetch('/products')
    .then(response => response.json())
    .then(products => {
      const productsContainer = document.getElementById('products');
      productsContainer.classList.add('row', 'w-100', 'mt-5');

      products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'col-lg-3 col-md-4 col-sm-6 mb-4'; 

        productElement.innerHTML = `
          <div class="card h-100"> 
            <img
              src="${product.image_url}" alt="${product.nama}"
              class="card-img-top" 
              width="180" 
            />
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">⭐ ${product.rating}</p>
              <p class="card-text">Rp ${product.price}</p>
              <a href="#" class="btn btn-primary">Beli Sekarang</a>
            </div>
          </div>
        `;
        
        productsContainer.appendChild(productElement);
      });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
});
