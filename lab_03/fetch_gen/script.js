async function loadProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    if (!response.ok) throw new Error("Błąd sieci");
    const data = await response.json();
    return data.products;
  } catch (err) {
    alert("Błąd! Wczytywanie danych nie powiodło się.");
    console.error("Fetch error:", err);
    return [];
  }
}

let products = [];

async function main() {
  products = await loadProducts();

  const filterPhrase = document.getElementById("filter");
  const select = document.getElementById("sort");

  filterPhrase.addEventListener("input", () => renderFiltered());
  select.addEventListener("change", () => renderFiltered());

  renderFiltered();
}

function renderFiltered() {
  const filterPhrase = document.getElementById("filter");
  const select = document.getElementById("sort");

  const phrase = filterPhrase.value.trim().toLowerCase();
  const selectedValue = select.value;

  let filtered = phrase.length > 0 ? products.filter((product) =>
    product.title.toLowerCase().startsWith(phrase)) : products;

  switch (selectedValue) {
    case "asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "desc":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "origin":
      break;
    default:
      console.log("Nieznana opcja sortowania");
  }

  // ograniczamy do 30 elementów
  const products30 = filtered.slice(0, 30);

  const productTable = document.querySelector(
    ".products-container #products-tabel tbody"
  );
  productTable.innerHTML = "";

  products30.forEach((product) => {
    const productHTML = `
        <tr>
          <td>${product.title}</td>
          <td>${product.description}</td>
          <td><img src="${product.thumbnail}" loading="lazy" alt="${product.title}" width="50"></td>
        </tr>
      `;
    productTable.innerHTML += productHTML;
  });
}

main();
