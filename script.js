// Função para atualizar quantidade
function atualizarQuantidade(botao, incremento) {
  const card = botao.closest('.card-produto');
  const span = card.querySelector('.controles span');
  let quantidade = parseInt(span.textContent);

  quantidade += incremento;
  if (quantidade < 0) quantidade = 0; // não deixa negativo

  span.textContent = quantidade;
}

// Adiciona eventos aos botões
document.querySelectorAll('.card-produto .controles button').forEach(botao => {
  botao.addEventListener('click', () => {
    if (botao.textContent === '+') {
      atualizarQuantidade(botao, 1);
    } else {
      atualizarQuantidade(botao, -1);
    }
  });
});

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

  // 🔑 Configure aqui o número do WhatsApp (com DDI e DDD)
  const numeroWhatsApp = "5511999999999"; 
  // Exemplo: 55 (Brasil) + 11 (DDD São Paulo) + número

  // Abre WhatsApp com mensagem
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
});
