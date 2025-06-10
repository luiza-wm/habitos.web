// ======= VARIÁVEIS GLOBAIS =======
const calendar = document.getElementById('calendar');
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDay = today.getDate();

let habitos = [];
let marcacoes = {};
let habitoSelecionadoId = null;

// ======= CALENDÁRIO =======
function createCalendar(month, year) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  let html = `<h2 id="month-year">${monthNames[month]} ${year}</h2>`;
  html += '<table>';
  html += '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';

  let day = 1;
  for (let i = 0; i < 6; i++) {
    html += '<tr>';
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayIndex) {
        html += '<td></td>';
      } else if (day > totalDays) {
        break;
      } else {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const marcado = marcacoes[habitoSelecionadoId]?.includes(dateStr);
        const classList = [];

        if (day === currentDay && month === currentMonth && year === currentYear)
          classList.push('today');
        if (marcado)
          classList.push('marcado');

        html += `<td class="${classList.join(' ')}" data-dia="${dateStr}" onclick="marcarDia('${dateStr}')">${day}</td>`;
        day++;
      }
    }
    html += '</tr>';
  }

  html += '</table>';
  calendar.innerHTML = html;
}

// ======= MARCAR DIAS =======
function marcarDia(data) {
  if (!habitoSelecionadoId) {
    alert("Selecione um hábito primeiro!");
    return;
  }

  if (!marcacoes[habitoSelecionadoId]) {
    marcacoes[habitoSelecionadoId] = [];
  }

  const index = marcacoes[habitoSelecionadoId].indexOf(data);

  if (index === -1) {
    marcacoes[habitoSelecionadoId].push(data);
  } else {
    marcacoes[habitoSelecionadoId].splice(index, 1);
  }

  salvarDados();
  createCalendar(currentMonth, currentYear);
}

// ======= HÁBITOS: Adicionar =======
function mostrarInput() {
  document.getElementById('inputArea').style.display = 'block';
}

function adicionarHabito() {
  const input = document.getElementById('novoHabito');
  const texto = input.value.trim();

  if (texto !== '') {
    const novoHabito = {
      id: Date.now(),
      texto: texto
    };

    habitos.push(novoHabito);
    salvarDados();
    renderizarHabitos();
    input.value = '';
    document.getElementById('inputArea').style.display = 'none';
  }
}

// ======= HÁBITOS: Renderizar =======
function renderizarHabitos() {
  const ul = document.querySelector('.habibi');
  ul.innerHTML = '';

  habitos.forEach(habito => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '10px';

    const botao = document.createElement('button');
    botao.textContent = habito.texto;
    botao.classList.add('habito-btn');
    if (habitoSelecionadoId === habito.id) {
      botao.classList.add('ativo');
    }

    botao.onclick = () => {
      habitoSelecionadoId = habito.id;
      renderizarHabitos();
      createCalendar(currentMonth, currentYear);
    };

    const btnEditar = document.createElement('button');
    btnEditar.textContent = '✏️';
    btnEditar.style.padding = '10px';
    btnEditar.onclick = () => editarHabito(habito.id);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = '🗑️';
    btnExcluir.style.padding = '10px';
    btnExcluir.onclick = () => excluirHabito(habito.id);

    li.appendChild(botao);
    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);
    ul.appendChild(li);
  });
}

// ======= HÁBITOS: Editar / Excluir =======
function editarHabito(id) {
  const novoTexto = prompt('Editar hábito:');
  if (novoTexto) {
    const habito = habitos.find(h => h.id === id);
    if (habito) {
      habito.texto = novoTexto;
      salvarDados();
      renderizarHabitos();
    }
  }
}

function excluirHabito(id) {
  habitos = habitos.filter(h => h.id !== id);
  delete marcacoes[id];
  salvarDados();
  renderizarHabitos();
  createCalendar(currentMonth, currentYear);
}

// ======= LOCALSTORAGE =======
function salvarDados() {
  localStorage.setItem('habitos', JSON.stringify(habitos));
  localStorage.setItem('marcacoes', JSON.stringify(marcacoes));
}

function carregarDados() {
  const dados = localStorage.getItem('habitos');
  const dadosMarcacoes = localStorage.getItem('marcacoes');

  if (dados) habitos = JSON.parse(dados);
  if (dadosMarcacoes) marcacoes = JSON.parse(dadosMarcacoes);

  renderizarHabitos();
  createCalendar(currentMonth, currentYear);
}

// ======= INICIAR =======
window.onload = carregarDados;


function aplicarPersonalizacao() {
  const font = document.getElementById('fontSelect').value;
  const bgColor = document.getElementById('bgColorPicker').value;
  const textColor = document.getElementById('textColorPicker').value;

  document.body.style.fontFamily = font;
  document.body.style.backgroundColor = bgColor;
  document.body.style.color = textColor;

  localStorage.setItem('preferencias', JSON.stringify({
    font, bgColor, textColor
  }));
}

function carregarPersonalizacao() {
  const prefs = localStorage.getItem('preferencias');
  if (prefs) {
    const { font, bgColor, textColor } = JSON.parse(prefs);
    document.body.style.fontFamily = font;
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;

    document.getElementById('fontSelect').value = font;
    document.getElementById('bgColorPicker').value = bgColor;
    document.getElementById('textColorPicker').value = textColor;
  }
}

window.addEventListener('DOMContentLoaded', carregarPersonalizacao);
