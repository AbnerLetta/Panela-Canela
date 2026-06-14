let DB = {
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
      nome: "Churros Avelã",
      preco: 12.99,
      img: "https://via.placeholder.com/100"
    },
    {
      id: 3,
      nome: "Coca-Cola Zero",
      preco: 6.00,
      img: "https://via.placeholder.com/100"
    }
  ],
  carrinho: []
};

// 🛒 ADICIONAR AO CARRINHO
function adicionarAoCarrinho(id) {
  const produto = DB.produtos.find(p => p.id === id);

  const item = DB.carrinho.find(i => i.id === id);

  if (item) {
    item.qtd++;
  } else {
    DB.carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      img: produto.img,
      qtd: 1
    });
  }

  render();
}

// 📦 PRODUTOS
function renderProdutos() {
  const el = document.getElementById("produtos");

  el.innerHTML = "";

  DB.produtos.forEach(p => {
    el.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <div>
          <strong>${p.nome}</strong><br>
          R$ ${p.preco.toFixed(2)}
        </div>
        <button onclick="adicionarAoCarrinho(${p.id})">Adicionar</button>
      </div>
    `;
  });
}

// 🧾 CARRINHO
function renderCarrinho() {
  const el = document.getElementById("carrinho");

  el.innerHTML = "";

  let subtotal = 0;

  DB.carrinho.forEach(item => {
    subtotal += item.preco * item.qtd;

    el.innerHTML += `
      <div class="item">
        <span>${item.nome} (${item.qtd}x)</span>
        <span>R$ ${(item.preco * item.qtd).toFixed(2)}</span>
      </div>
    `;
  });

  let total = subtotal + DB.frete;

  el.innerHTML += `
    <hr>
    <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
    <p>Frete: R$ ${DB.frete.toFixed(2)}</p>
    <h3>Total: R$ ${total.toFixed(2)}</h3>
  `;
}

// 🔄 RENDER GERAL
function render() {
  renderProdutos();
  renderCarrinho();
}

// 🚀 INICIAR
render();