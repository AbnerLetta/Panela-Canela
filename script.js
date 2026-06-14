console.clear();

let produtos = [];
let carrinho = [];

const FRETE = 10;

// =============================
// INÍCIO
// =============================
document.addEventListener("DOMContentLoaded", init);

function init() {
  carregarProdutos();
}

// =============================
// FIREBASE (VOCÊ VAI COLOCAR AQUI)
// =============================
async function carregarProdutos() {
  // 🔥 SUBSTITUA PELO SEU FIREBASE REAL
  const snapshot = await buscarDoFirebase();

  produtos = snapshot.map(normalizarProduto);

  renderProdutos();
}

// =============================
// SIMULAÇÃO (REMOVE QUANDO USAR FIREBASE REAL)
// =============================
async function buscarDoFirebase() {
  return [
    {
      id: "1",
      nome: "Churro Chocolate",
      categoria: "Chocolate",
      preco: "14.99",
      foto: "https://via.placeholder.com/100"
    },
    {
      id: "2",
      nome: "Coca-Cola",
      categoria: "Bebidas",
      preco: "5.79",
      foto: "https://via.placeholder.com/100"
    }
  ];
}

// =============================
// NORMALIZAÇÃO (ESSENCIAL)
// =============================
function normalizarProduto(p) {
  return {
    id: p.id,
    nome: p.nome,
    categoria: p.categoria,
    descricao: p.descricao,
    foto: p.foto,
    preco: Number(p.preco)
  };
}

// =============================
// PRODUTOS
// =============================
function renderProdutos() {
  const el = document.getElementById("produtos");
  el.innerHTML = "";

  const categorias = [...new Set(produtos.map(p => p.categoria))];

  categorias.forEach(cat => {
    el.innerHTML += `<h3>${cat}</h3>`;

    produtos
      .filter(p => p.categoria === cat)
      .forEach(p => {
        el.innerHTML += `
          <div class="produto">
            <img src="${p.foto}" width="60">
            <div>
              <strong>${p.nome}</strong><br>
              R$ ${p.preco.toFixed(2)}
            </div>
            <button onclick="adicionar('${p.id}')">+</button>
          </div>
        `;
      });
  });
}

// =============================
// CARRINHO
// =============================
function adicionar(id) {
  const item = produtos.find(p => p.id === id);
  if (!item) return;

  const existente = carrinho.find(p => p.id === id);

  if (existente) {
    existente.qtd += 1;
  } else {
    carrinho.push({ ...item, qtd: 1 });
  }

  renderCarrinho();
}

function remover(id) {
  carrinho = carrinho.filter(p => p.id !== id);
  renderCarrinho();
}

function alterarQtd(id, delta) {
  const item = carrinho.find(p => p.id === id);
  if (!item) return;

  item.qtd += delta;

  if (item.qtd <= 0) {
    remover(id);
  }

  renderCarrinho();
}

// =============================
// RENDER CARRINHO
// =============================
function renderCarrinho() {
  const el = document.getElementById("carrinho");
  const totalEl = document.getElementById("total");

  el.innerHTML = "";

  let total = 0;

  carrinho.forEach(item => {
    total += item.preco * item.qtd;

    el.innerHTML += `
      <div class="carrinho-item">
        ${item.nome} - R$ ${item.preco.toFixed(2)}
        
        <button onclick="alterarQtd('${item.id}', -1)">-</button>
        ${item.qtd}
        <button onclick="alterarQtd('${item.id}', 1)">+</button>

        <button onclick="remover('${item.id}')">x</button>
      </div>
    `;
  });

  totalEl.innerHTML = `
    Total: R$ ${(total + FRETE).toFixed(2)}
  `;
}

// =============================
// WHATSAPP
// =============================
function finalizarPedido() {
  let msg = "🍩 Pedido Panela & Canela:%0A%0A";

  carrinho.forEach(item => {
    msg += `${item.qtd}x ${item.nome} - R$ ${(item.preco * item.qtd).toFixed(2)}%0A`;
  });

  msg += `%0AFrete: R$ ${FRETE.toFixed(2)}`;
  msg += `%0ATotal: R$ ${calcularTotal().toFixed(2)}`;

  window.open(`https://wa.me/SEUNUMERO?text=${msg}`);
}

function calcularTotal() {
  return carrinho.reduce((acc, i) => acc + i.preco * i.qtd, 0) + FRETE;
}