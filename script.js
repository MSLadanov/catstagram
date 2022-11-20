$(document).ready(function () {
  $(".sidenav").sidenav();
});

$(document).ready(function () {
  $(".modal").modal();
});

const renderCards = (data) => {
  document.querySelector(".row").innerHTML = null;
  data.map((item) => {
    document.querySelector(".row").insertAdjacentHTML(
      "beforeend",
      `<div class="col s12 m6">
    <div class="card">
        <div class="cat-card-image">
          <img alt=${item.name} src=${item.img_link}>
        </div>
        <div class="card-content">
        <span class="card-title">${item.name}</span>
        </div>
        <div class="card-menu">
        <div class="card-action" data-id=${item.id}>
        <button class="waves-effect waves-light btn amber lighten-2" data-action="edit" data-target="modal2" class="btn modal-trigger">Edit</button>
        <button class="waves-effect waves-light btn red darken-4" data-action="delete">delete</button>
      </div>
        </div>
      </div>
  </div>`
    );
  });
};

const deleteCat = (id) => {
  fetch(`https://sb-cats.herokuapp.com/api/2/msladanov/delete/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      M.toast({ html: "Done!" });
      getCats();
    })
    .catch((error) => {
      M.toast({ html: `Something wrong : ${error.message}` });
    });
};

const uploadNewCat = () => {
  let formData = {};
  document.querySelectorAll("#addcat input").forEach((item) => {
    if (item.type === "checkbox") {
      formData[item.id] = item.checked;
    } else {
      formData[item.id] = item.value;
    }
  });
  fetch(" https://sb-cats.herokuapp.com/api/2/msladanov/ids")
    .then((response) => response.json())
    .then((json) => {
      if (json.data.includes(+formData.id)) {
        M.toast({ html: "This id already exists!" });
      } else {
        if (formData.id === "") {
          M.toast({ html: "Enter id!" });
        }
        if (formData.name === "") {
          M.toast({ html: "Enter name!" });
        } else {
          fetch("https://sb-cats.herokuapp.com/api/2/msladanov/add", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then(() => {
              M.toast({ html: `Added new cat!` });
              getCats();
              localStorage.removeItem("addForm");
            })
            .catch((error) => {
              M.toast({ html: `Something wrong : ${error.message}` });
            });
        }
      }
    });
};

const updateExistsCat = () => {
  console.log("save");
  let formData = {};
  document.querySelectorAll("#editcat input").forEach((item) => {
    if (item.type === "checkbox") {
      formData[item.id] = item.checked;
    } else {
      formData[item.id] = item.value;
    }
  });
  let putData = { ...formData };
  delete putData.id;
  delete putData.name;
  console.log(putData);
  fetch(`https://sb-cats.herokuapp.com/api/2/msladanov/update/${formData.id}`, {
    method: "PUT",
    body: JSON.stringify(putData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then(() => {
      M.toast({ html: `Changes saved!` });
      getCats();
    })
    .catch((error) => {
      M.toast({ html: `Something wrong : ${error.message}` });
    });
};

async function getCatById(id, option) {
  await fetch(`https://sb-cats.herokuapp.com/api/2/msladanov/show/${id}`)
    .then((response) => response.json())
    .then((json) => {
      openModal(json.data, option);
    })
    .catch((error) => {
      M.toast({ html: `Something wrong : ${error.message}` });
    });
}

const getCats = () => {
  fetch("https://sb-cats.herokuapp.com/api/2/msladanov/show")
    .then((response) => response.json())
    .then((json) => {
      renderCards(json.data);
    })
    .catch((error) => {
      M.toast({ html: `Something wrong : ${error.message}` });
    });
};

const putDataToLS = () => {
  let formData = {};
  document.querySelectorAll("#addcat input").forEach((item) => {
    if (item.type === "checkbox") {
      formData[item.id] = item.checked;
    } else {
      formData[item.id] = item.value;
    }
  });
  localStorage.setItem("addForm", JSON.stringify(formData));
};

const getDataFromLS = () => {
  document
    .querySelector("#addcat")
    .removeEventListener("input", () => putDataToLS());
  let formDataLS = JSON.parse(localStorage.getItem("addForm"));
  if (formDataLS) {
    document
      .querySelector("#modal1")
      .querySelector(".modal-content").innerHTML = `      
  <form id="addcat" action="">
    <div class="input-field col s6">
      <input id="id" type="number" min="0" class="validate" value=${Number(
        formDataLS.id
      )}>
      <label for="id">id</label>
    </div>
    <div class="input-field col s6">
      <input id="name" type="text" class="validate" value=${formDataLS.name} >
      <label for="name">Name</label>
    </div>
    <div class="input-field col s6">
      <input id="description" type="text" class="validate" value=${
        formDataLS.description
      }>
      <label for="description">Description</label>
    </div>
    <div class="input-field col s6">
      <input id="img_link" type="text" class="validate" value=${
        formDataLS.img_link
      }>
      <label for="img_link">Image link</label>
    </div>
    <label>
      <input type="checkbox" id="favourite" checked=${formDataLS.favourite}/>
      <span>Favourite</span>
    </label>
    <p class="range-field">
      <label for="age">Age</label>
      <input type="range" id="age" min="1" max="9" value=${Number(
        formDataLS.age
      )}/>
    </p>
    <p class="range-field">
      <label for="rate">Rate</label>
      <input type="range" id="rate" min="1" max="10" value=${Number(
        formDataLS.rate
      )}/>
    </p>
  </form>`;
  }
  document
    .querySelector("#addcat")
    .addEventListener("input", () => putDataToLS());
};

const openModal = (data, option) => {
  let instance = M.Modal.getInstance(document.querySelector("#modal2"));
  switch (option) {
    case "view":
      let cardRate = "";
      let cardAge = "";
      for (let i = 0; i < data.rate; i++) {
        cardRate += '<i class="material-icons medium">star</i>';
      }
      for (let i = 0; i < data.age; i++) {
        cardAge += '<i class="material-icons small">favoriter</i>';
      }

      document.querySelector(
        "#modal2"
      ).innerHTML = `<div class="cat-card-image">
  <img src=${data.img_link}>
</div>
<div class="card-content">
  <div>${data.name}</div>
  <div>${cardRate}</div>
  <div>${cardAge}</div>
  <div>${
    data.favourite ? '<i class="material-icons small">thumb_up</i>' : ""
  }</div>
  <div><p class="card-description">${data.description}</p>
  </div>
</div>`;
      break;
    case "edit":
      document.querySelector("#modal2").innerHTML = `
      <div class="modal-content">
      <form id="editcat" action="">
      <div class="input-field col s12">
        <input id="id" type="text" class="validate" min="0" value="${data.id}" disabled>
        <span class="helper-text">id</span>
      </div>
      <div class="input-field col s12">
        <input id="name" type="text" class="validate" value="${data.name}" disabled>
        <span class="helper-text">Name</span>
      </div>
      <div class="input-field col s12">
        <input id="description" type="text" class="validate" value="${data.description}">
        <span class="helper-text">Description</span>
      </div>
      <div class="input-field col s12">
        <input id="img_link" type="text" class="validate" value=${data.img_link}>
        <span class="helper-text">Image Link</span>
      </div>
      <label>
        <input type="checkbox" id="favourite" checked=${data.favourite} />
        <span>Favourite</span>
      </label>
      <p class="range-field">
        <label for="age">Age</label>
        <input type="range" id="age" min="1" max="9" value=${data.age} />
      </p>
      <p class="range-field">
        <label for="rate">Rate</label>
        <input type="range" id="rate" min="1" max="10" value=${data.rate}/>
      </p>
    </form>
      </div>
      <div class="modal-footer">
      <button class="waves-effect waves-light btn green darken-3 modal-close" data-action="save">Save</button>
      <button class="waves-effect waves-light btn amber lighten-2 modal-close" data-action="cancel">Cancel</button>
      </div>
      `;
      document
        .querySelector('button[data-action="save"]')
        .addEventListener("click", () => updateExistsCat());
      break;
    default:
      break;
  }

  instance.open();
};

getCats();

const getCatIdForModal = (e) => {
  let card;
  e.composedPath().forEach((item) => {
    if (item.className === "card") {
      card = item;
    }
  });
  let id = card.querySelector(".card-action").dataset.id;
  getCatById(id, "view");
};

const cardClickHandler = (e) => {
  let classListArray = [];
  e.composedPath().forEach((item) => classListArray.push(item.className));
  let isCardImage = classListArray.includes("cat-card-image");
  let isCardContent = classListArray.includes("card-content");
  if (isCardImage || isCardContent) {
    getCatIdForModal(e);
  }
};

const actionHandler = (e) => {
  let id = e.target.parentNode.dataset.id;
  let temp = e.target.dataset;
  switch (temp.action) {
    case "edit":
      getCatById(id, "edit");
      break;
    case "delete":
      deleteCat(id);
      break;
    default:
      cardClickHandler(e);
      break;
  }
};

document
  .querySelector(".content")
  .addEventListener("click", (e) => actionHandler(e));

document
  .querySelector('button[data-action="upload"]')
  .addEventListener("click", () => uploadNewCat());

document
  .querySelectorAll('a[data-action="openModal"]')
  .forEach((item) => item.addEventListener("click", () => getDataFromLS()));

document
  .querySelector("#addcat")
  .addEventListener("input", () => putDataToLS());
