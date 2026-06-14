import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let produtos = [];
let carrinho = [];
const FRETE = 10;

document.addEventListener("DOMContentLoaded", carregarProdutos);

async function carregarProdutos() {
  const snapshot = await getDocs(collection(db, "produtos"));

  produtos = snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      nome: data.nome,
      categoria: data.categoria,
      descricao: data.descricao,
      foto: data.foto,
      preco: Number(data.preco)
    };
  });

  renderProdutos();
}

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

  totalEl.innerHTML = `Total: R$ ${(total + FRETE).toFixed(2)}`;
}

function finalizarPedido() {
  let msg = "🍩 Pedido Panela & Canela:%0A%0A";

  carrinho.forEach(item => {
    msg += `${item.qtd}x ${item.nome} - R$ ${(item.preco * item.qtd).toFixed(2)}%0A`;
  });

  msg += `%0AFrete: R$ ${FRETE.toFixed(2)}`;
  msg += `%0ATotal: R$ ${carrinho.reduce((a, i) => a + i.preco * i.qtd, 0) + FRETE}`;

  window.open(`https://wa.me/SEUNUMERO?text=${msg}`);
}

window.adicionar = adicionar;
window.remover = remover;
window.alterarQtd = alterarQtd;
window.finalizarPedido = finalizarPedido;