import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para atualizar quantidade
function atualizarQuantidade(botao, incremento) {
  const card = botao.closest('.card-produto');
  const span = card.querySelector('.controles span');
  let quantidade = parseInt(span.textContent);

  quantidade += incremento;
  if (quantidade < 0) quantidade = 0;

  span.textContent = quantidade;
}

// Renderizar produtos de uma coleção Firebase
async function carregarProdutos(categoria, containerId) {
  const querySnapshot = await getDocs(collection(db, categoria));
  const container = document.getElementById(containerId);

  querySnapshot.forEach((doc) => {
    const produto = doc.data();
    const card = document.createElement("div");
    card.className = "card-produto";
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="produto-foto">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <p class="preco">R$ ${produto.preco}</p>
      <div class="controles">
        <button>-</button>
        <span>0</span>
        <button>+</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Ativar botões de quantidade após renderização
  container.querySelectorAll('.controles button').forEach(botao => {
    botao.addEventListener('click', () => {
      if (botao.textContent === '+') {
        atualizarQuantidade(botao, 1);
      } else {
        atualizarQuantidade(botao, -1);
      }
    });
  });
}

// Carregar categorias
carregarProdutos("churros_gourmet", "produtos-gourmet");
carregarProdutos("churros_tradicionais", "produtos-tradicionais");
carregarProdutos("bebidas", "produtos-bebidas");

// Envio do pedido para WhatsApp
document.getElementById('pedidoForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('nomeCliente').value;
  const endereco = document.getElementById('enderecoCliente').value;
  const pagamento = document.getElementById('formaPagamento').value;
  const frete = document.getElementById('frete').value;
  const observacoes = document.getElementById('observacoesCliente').value;

  // Monta resumo dos produtos
  let resumoProdutos = '';
  document.querySelectorAll('.card-produto').forEach(card => {
    const nomeProduto = card.querySelector('h3').textContent;
    const quantidade = parseInt(card.querySelector('.controles span').textContent);
    if (quantidade > 0) {
      resumoProdutos += `${nomeProduto} x${quantidade}\n`;
    }
  });

  const mensagem = 
    `Pedido Panela & Canela\n\n` +
    `Cliente: ${nome}\n` +
    `Endereço: ${endereco}\n` +
    `Pagamento: ${pagamento}\n` +
    `Entrega: ${frete}\n\n` +
    `Produtos:\n${resumoProdutos}\n` +
    `Observações: ${observacoes}`;

  // Número do WhatsApp configurado
  const numeroWhatsApp = "5511925572150"; 

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
});
