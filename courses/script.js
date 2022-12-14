const coursesUrl = 'http://localhost:8080/courses/';

const table = document.getElementById('table');
const tableBody = document.getElementById('table-body');

const inputName = document.getElementById('input-name');

const btnSalvar = document.getElementById('btn-salvar');
const addbtn = document.getElementById('addbtn');

let actualId = 0;

async function getCourses() {
  const response = await fetch(coursesUrl);
  if (response.ok) {
    const courses = await response.json();

    if (courses.length > 0) {
      courses.forEach((course) => {
        createRow(course);
      })

      showTable();
    }
    
  }
}

function showTable() {
  table.removeAttribute('hidden');
}
document.addEventListener("keypress", function (tecla) {
  if (tecla.which == 13) {
    findByNameContainning()
  }
})

async function findByNameContainning() {
  tableBody.innerHTML = ''
  const courseNameForSearch = document.getElementById('courseNameForSearch').value
  const response = await fetch('http://localhost:8080/courses?name=' + courseNameForSearch)
  if (response.ok) {
    const courses = await response.json();
    courses.forEach((course) => {
      createRow(course);
    });
  }
}

async function remover(id, name, row) {
  const result = confirm('Você deseja remover o curso: ' + name);

  if (result) {
    const response = await fetch(coursesUrl + id, {
      method: 'DELETE',     
    });
    if (response.ok) {
      tableBody.removeChild(row);
    }else{
      alert("Não pode deletar um curso associado com alocações. Remova as alocações primeiro e em seguida remova o curso." );
    }

  }
 
}

async function salvar() {
  if (actualId) {
    atualizar();
  } else {
    adicionar();
  }
}

async function adicionar() {
  const name = inputName.value.trim();

  if (name) {
    const response = await fetch(coursesUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    });
    if (response.ok) {
      const course = await response.json();
      inputName.value = "";
      removeModal();
      createRow(course);
      showTable();
    }
  } else {
    alert('O nome do curso precisa ter 3 ou mais caracteres!')
  }
}

async function atualizar() {
  const name = inputName.value.trim();

  if (name) {
    const response = await fetch(coursesUrl + actualId, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    });
    if (response.ok) {
      inputName.value = "";
      removeModal();

      tableBody.innerHTML = "";
      getCourses();
    }
  }
}

function abrirModalCriar() {
  actualId = 0;
  document.getElementById('formCouseLabel').textContent = 'Adicionar curso';
  inputName.value = "";
}

function abrirModalAtualizar(courseId, name) {
  actualId = courseId;
  document.getElementById('formCouseLabel').textContent = 'Editar curso';
  inputName.value = name;
}

function removeModal() {
  const modalElement = document.getElementById("form-course");
  const modalBootstrap = bootstrap.Modal.getInstance(modalElement);

  modalBootstrap.hide();
}

btnSalvar.addEventListener('click', salvar);
addbtn.addEventListener('click', abrirModalCriar);


function createRow({id, name}) {
  const row = document.createElement('tr');
  const idCollumn = document.createElement('th');
  const nameCollumn = document.createElement('td');
  const acoesCollumn = document.createElement('td');

  const imgDelete = document.createElement('img');
  imgDelete.src = '../assets/delete.svg';

  const imgEdit = document.createElement('img');
  imgEdit.src = '../assets/edit.svg';

  const btnDelete = document.createElement('button');
  btnDelete.addEventListener('click', () => remover(id, name, row));
  btnDelete.classList.add('btn');
  btnDelete.classList.add('button-ghost');
  btnDelete.appendChild(imgDelete);
  btnDelete.title = `Remover ${name}`;

  const btnEdit = document.createElement('button');
  btnEdit.setAttribute('data-bs-toggle', 'modal');
  btnEdit.setAttribute('data-bs-target', '#form-course');
  btnEdit.addEventListener('click', () => abrirModalAtualizar(id, name));
  btnEdit.classList.add('btn');
  btnEdit.classList.add('button-ghost');
  btnEdit.appendChild(imgEdit);
  btnEdit.title = `Editar ${name}`;

  idCollumn.textContent = id;
  idCollumn.setAttribute("scope", "row");

  nameCollumn.textContent = name;

  acoesCollumn.appendChild(btnDelete);
  acoesCollumn.appendChild(btnEdit);

  row.appendChild(idCollumn);
  row.appendChild(nameCollumn);
  row.appendChild(acoesCollumn);
  
  tableBody.appendChild(row);
}


getCourses();
