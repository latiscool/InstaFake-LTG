var contadorPage = 1; //Contador Pagina Inical de Foto
const btnAgregar = document.getElementById('btnAgregarMas');
const formId = document.getElementById('js_form');
//Ocultando Instake Contenido
const oculto = (document.getElementById('instafake').style.display = 'none');
// ********************************************************************
// Escuchador Evento envio formualrio
// ********************************************************************
formId.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('js_email').value;
  const pwdInput = document.getElementById('js_pwd').value;
  const jwt = await tokenData(emailInput, pwdInput);
  getPhotos(jwt);
});
// ********************************************************************
// Obtengo el token (cadena alfanumerica) y se almcena en localStorage
// ********************************************************************
const tokenData = async (emailz, pwd) => {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailz, password: pwd }),
    });
    const { token } = await response.json();
    localStorage.setItem('jwt-token', token);
    return token;
  } catch (error) {
    console.error(`Datos Invalidos.! ${error}`);
  }
};
// ********************************************************************
// Obtengo las variables al destructurar {token}
//http:localhost:3000/api/photos es lo mismo que http:localhost:3000/api/photos?=1
//para no hacer un DRY, se tomara la api/photos?=1 equivalente api/photos
// ********************************************************************

const getPhotos = async (jwt) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/photos?page=${contadorPage}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const { data } = await response.json();
    if (data) {
      cardFilled(data);
      ocultarMostrar(data);
    } else {
      localStorage.clear();
    }
  } catch (error) {
    localStorage.clear();
    console.error(`Data Invalida ${error}`);
  }
};
// ********************************************************************
// CARD agrego las fotos y el autor
// ********************************************************************
const cardFilled = (data) => {
  let newCards = document.getElementById('cardContent');
  data.forEach((e) => {
    newCards.innerHTML += `
    <div class="card my-5">
    <img id="imgCard" class="card-img-top" src="${e.download_url}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Autor: <small id="cardAutor">${e.author}</small> </h5>
    </div>
  </div>
`;
  });
};

// ******************************************************************************
// Oculto InstaFake Contenido y al Autenticar se muestra y se oculta el formulario
// ********************************************************************************
const ocultarMostrar = (data) => {
  if (data) {
    document.getElementById('instafake').style.display = 'block';
    document.getElementById('cabezera').style.display = 'none';
  }
};

// ********************************************************************
// Funcion Agregar mas Contenido de InstaFake (mas fotos y autores)
// ********************************************************************
btnAgregar.addEventListener('click', () => {
  const token = localStorage.getItem('jwt-token');
  if (token) {
    contadorPage++;
    getPhotos(token);
  }
});

// ********************************************************************
// Terminar/Salir el Token y volver al formulario
// ********************************************************************
document.getElementById('salir').addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

// Función que se ejecute cuando se cargue nuestra
// página y valide si existe un JWT, de ser así, debería automáticamente llamar a nuestra API
const check = () => {
  const token = localStorage.getItem('jwt-token');
  if (token) {
    getPhotos(token);
  }
};
check();
