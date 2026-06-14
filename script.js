console.log("JS carregou");

// =========================
// BANCO DE DADOS
// =========================
const DB = {
  frete: 10,
  produtos: [
    {
      id: 1,
      nome: "Churro Festeiro",
      preco: 12.99,
      categoria: "Tradicionais",
      img: "https://via.placeholder.com/120"
    },
    {
      id: 2,
      nome: "Churro Doce de Leite",
      preco: 13.99,
      categoria: "Tradicionais",
      img: "https://via.placeholder.com/120"
    },
    {
      id: 3,
      nome: "Churro Chocolate",
      preco: 14.99,
      categoria: "Chocolate",
      img: "https://via.placeholder.com/120"
    },
    {
      id: 4,
      nome: "Churro Chocolate Branco",
      preco: 15.99,
      categoria: "Chocolate",
      img: "https://via.placeholder.com/120"
    }
  ]
};

// =========================
// CARRINHO
// =========================
let carrinho = [];

// =========================
// INICIAR
// =========================
document.addEventListener("DOMContentLoaded", () => {
  render();
});

// =========================
// RENDER GERAL
// =========================
function render() {
  renderProdutos();
  renderCarrinho();
}

// =========================
// PRODUTOS POR CATEGORIA
// =========================
function renderProdutos() {
  const el = document.getElementById("produtos");
  el.innerHTML = "";

  const categorias = [...new Set(DB.produtos.map(p => p.categoria))];

  categorias.forEach(cat => {
    el.innerHTML += `
      <h3 class="categoria">${cat}</h3>
    `;

    DB.produtos
      .filter(p => p.categoria === cat)
      .forEach(produto => {
        el.innerHTML += `
          <div class="produto">
            <img src="${produto.img}">
            <div class="info">
              <h4>${produto.nome}</h4>
              <p>R$ ${produto.preco.toFixed(2)}</p>
            </div>
            <button onclick="adicionar(${produto.id})">+</button>
          </div>
        `;
      });
  });
}

// =========================
// ADICIONAR
// =========================
function adicionar(id) {
  const item = DB.produtos.find(p => p.id === id);
  carrinho.push(item);
  render();
}

// =========================
// REMOVER
// =========================
function remover(index) {
  carrinho.splice(index, 1);
  render();
}

// =========================
// CARRINHO
// =========================
function renderCarrinho() {
  const el = document.getElementById("carrinho");
  el.innerHTML = "";

  let subtotal = 0;

  carrinho.forEach((item, index) => {
    subtotal += item.preco;

    el.innerHTML += `
      <div class="item">
        <span>${item.nome}</span>
        <span>R$ ${item.preco.toFixed(2)}</span>
        <button onclick="remover(${index})">x</button>
      </div>
    `;
  });

  const total = subtotal + DB.frete;

  document.getElementById("total").innerHTML = `
    Subtotal: R$ ${subtotal.toFixed(2)} <br>
    Frete: R$ ${DB.frete.toFixed(2)} <br>
    <strong>Total: R$ ${total.toFixed(2)}</strong>
  `;
}