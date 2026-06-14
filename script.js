import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvoVJwVefB6B5Igtm13sG2pR3Q7Nk5rVo",
  authDomain: "panela-canela.firebaseapp.com",
  projectId: "panela-canela",
  storageBucket: "panela-canela.appspot.com",
  messagingSenderId: "293544912065",
  appId: "1:293544912065:web:7841f7e26b7c367a026040"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Renderizar cardápio agrupado por categoria
async function listarProdutos() {
  const snapshot = await getDocs(collection(db, "produtos"));
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  const categorias = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!categorias[data.categoria]) {
      categorias[data.categoria] = [];
    }
    categorias[data.categoria].push(data);
  });

  Object.keys(categorias).forEach(cat => {
    const bloco = document.createElement("div");
    bloco.className = "categoria";

    const titulo = document.createElement("h2");
    titulo.textContent = cat;
    bloco.appendChild(titulo);

    const grid = document.createElement("div");
    grid.className = "grid-produtos";

    categorias[cat].forEach(data => {
      const card = document.createElement("div");
      card.className = "card-produto";

      let quantidade = 0;

      const foto = document.createElement("img");
      foto.src = data.foto;
      foto.alt = data.nome;
      foto.className = "produto-foto";

      const nome = document.createElement("h3");
      nome.textContent = data.nome;

      const descricao = document.createElement("p");
      descricao.textContent = data.descricao;

      const preco = document.createElement("p");
      preco.className = "preco";
      preco.textContent = `R$${data.preco.toFixed(2)}`;

      const controles = document.createElement("div");
      controles.className = "controles";

      const menos = document.createElement("button");
      menos.textContent = "-";
      menos.onclick = () => {
        if (quantidade > 0) {
          quantidade--;
          qtd.textContent = quantidade;
        }
      };

      const mais = document.createElement("button");
      mais.textContent = "+";
      mais.onclick = () => {
        quantidade++;
        qtd.textContent = quantidade;
      };

      const qtd = document.createElement("span");
      qtd.textContent = quantidade;

      controles.appendChild(menos);
      controles.appendChild(qtd);
      controles.appendChild(mais);

      card.appendChild(foto);
      card.appendChild(nome);
      card.appendChild(descricao);
      card.appendChild(preco);
      card.appendChild(controles);

      grid.appendChild(card);

      card.dataset.nome = data.nome;
      card.dataset.preco = data.preco;
      card.dataset.qtdSpan = qtd;
    });

    bloco.appendChild(grid);
    container.appendChild(bloco);
  });
}

// Enviar pedido para WhatsApp
document.getElementById("pedidoForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const nomeCliente = document.getElementById("nomeCliente").value;
  const enderecoCliente = document.getElementById("enderecoCliente").value;
  const formaPagamento = document.getElementById("formaPagamento").value;
  const frete = document.getElementById("frete").value;
  const observacoesCliente = document.getElementById("observacoesCliente").value;

  let mensagem = `🧾 CUPOM - Panela & Canela\n\n`;
  mensagem += `Cliente: ${nomeCliente}\n`;
  mensagem += `Endereço: ${enderecoCliente}\n`;
  mensagem += `Pagamento: ${formaPagamento}\n`;
  mensagem += `Entrega: ${frete}\n\nItens:\n`;

  let total = 0;

  document.querySelectorAll(".card-produto").forEach(prod => {
    const qtd = parseInt(prod.querySelector(".controles span").textContent);
    const preco = parseFloat(prod.dataset.preco);
    if (qtd > 0) {
      const subtotal = qtd * preco;
      total += subtotal;
      mensagem += `- ${prod.dataset.nome} x${qtd} = R$${subtotal.toFixed(2)}\n`;
    }
  });

  mensagem += `\nTOTAL: R$${total.toFixed(2)}\n`;

  if (observacoesCliente.trim() !== "") {
    mensagem += `\nObservações: ${observacoesCliente}\n`;
  }

  mensagem += `\nObrigado pelo pedido! 🙌`;

  const numeroLoja = "5511925572150";
  const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});

// Inicializar
listarProdutos();
