console.log("JS CARREGOU COM SUCESSO");

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
      img: "https://via.placeholder.com/120"
    },
    {
      id: 2,
      nome: "Churro Chocolate",
      preco: 14.99,
      img: "https://via.placeholder.com/120"
    },
    {
      id: 3,
      nome: "Churro Doce de Leite",
      preco: 13.99,
      img: "https://via.placeholder.com/120"
    }
  ]
};

// =========================
// CARRINHO
// =========================
let carrinho = [];

// =========================
// INÍCIO
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
// PRODUTOS
// =========================
function renderProdutos() {
  const el = document.getElementById("produtos");
  el.innerHTML = "";

  DB.produtos.forEach(produto => {
    el.innerHTML += `
      <div class="produto">
        <img src="${produto.img}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
        <button onclick="adicionar(${produto.id})">Adicionar</button>
      </div>
    `;
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
        <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
        <button onclick="remover(${index})">X</button>
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