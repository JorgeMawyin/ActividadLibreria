fetch('https://raw.githubusercontent.com/DAWMFIEC/DAWM-apps/datos/bookstore-books.xml')
    .then(response => response.text())
    .then(async librosXML => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(librosXML, 'text/xml');
        const libros = xmlDoc.querySelectorAll('book');

        const response = await fetch('https://raw.githubusercontent.com/DAWMFIEC/DAWM-apps/datos/bookstore-images.json');
        const imagenes = await response.json();
        const arrayLibros = [];
        libros.forEach(libro => {
            const isbn = libro.querySelector('ISBN').textContent;
            const img = imagenes.find(img => img.ISBN === isbn);
            if (img) {
                arrayLibros.push({ ...objetoLibro(libro), ...img });
            }
        });
        const libreria = document.querySelector("#posts .row");
        arrayLibros.forEach(data => {
            const html = plantillaHTML(data);
            libreria.innerHTML += html;
        });
    })
    .catch(error => console.error('No se pudo obtener nada:', error));

function objetoLibro(libro) {
    const objetoL = {};
    Array.from(libro.children).forEach(child => {
      objetoL[child.tagName] = child.textContent;
    });
    return objetoL;
}

function plantillaHTML(data) {
    const plantilla = `
  <div class="col-lg-2 mb-2 text-center">
    <div class="card border-0 rounded-0">
      <div class="card-image">
        <img src="${data['Image-URL-M']}" alt="book-img" class="img-fluid">
      </div>
    </div>
    <div class="card-body text-capitalize">
      <div class="card-meta fs-6">
        <span class="meta-date">${data['Book-Author']}</span>
        <span class="meta-category">/ <a href="#">${data['Year-Of-Publication']}</a></span>
      </div>
      <h4 class="card-title">
        <a href="buy.html">${data['Book-Title']}</a>
      </h4>
    </div>
  </div>`;
    return plantilla;
}