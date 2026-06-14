// =========================
// BANCO DE DADOS
// =========================
const DB = {
  frete: 10.00,
  produtos: [
    {
      id: 1,
      nome: "Churro Festeiro",
      preco: 12.99,
      img: "https://via.placeholder.com/100"
    },
    {
      id: 2,
      nome: "Churro de Chocolate",
      preco: 14.99,
      img: "https://via.placeholder.com/100"
    },
    {
      id: 3,
      nome: "Churro de Doce de Leite",
      preco: 13.99,
      img: "https://via.placeholder.com/100"
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
window.addEventListener("DOMContentLoaded", () => {
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
// PRODUTOS
// =========================
function renderProdutos() {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  DB.produtos.forEach(produto => {
    container.innerHTML += `
      <div class="produto">
        <img src="${produto.img}" width="80">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
        <button onclick="addCarrinho(${produto.id})">Adicionar</button>
      </div>
    `;
  });
}

// =========================
// ADICIONAR NO CARRINHO
// =========================
function addCarrinho(id) {
  const item = DB.produtos.find(p => p.id === id);
  carrinho.push(item);
  render();
}

// =========================
// REMOVER DO CARRINHO
// =========================
function removerItem(index) {
  carrinho.splice(index, 1);
  render();
}

// =========================
// CARRINHO
// =========================
function renderCarrinho() {
  const container = document.getElementById("carrinho");
  container.innerHTML = "";

  let subtotal = 0;

  carrinho.forEach((item, index) => {
    subtotal += item.preco;

    container.innerHTML += `
      <div class="item-carrinho">
        <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
        <button onclick="removerItem(${index})">X</button>
      </div>
    `;
  });

  const total = subtotal + DB.frete;

  document.getElementById("total").innerText =
    `Subtotal: R$ ${subtotal.toFixed(2)} + Frete: R$ ${DB.frete.toFixed(2)} = Total: R$ ${total.toFixed(2)}`;
}