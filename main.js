const tBody = document.querySelector("tbody");
const addStudentBtn = document.querySelector("#add-student");
//---------------Bootstrap Modal-------
const myModal = document.querySelector("#myModal");
// const closeModal = document.querySelector("#close-modal");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");
const modalFooter = document.querySelector(".modal-footer");

//---------------Bootstrap Modal-------
const searchInput = document.querySelector(".form-control");
const searchGlassIcon = document.querySelector("#search-glass");
const searchClearIcon = document.querySelector("#search-clear");
//_-----pagination----
const prevPage = document.querySelector(".prev");
const nextPage = document.querySelector(".next");
// let studentId;
let allStudents = [];
let actionType;

const url = "https://63000b629350a1e548e9abfc.mockapi.io/api/v1/students/";

function fetchData() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      allStudents = data;

      createStudents(allStudents);
      displayPaginatedStudents(currPage);
    })
    .catch((err) => console.log(err));
}
fetchData();

function createStudents(students) {
  tBody.innerHTML = "";
  if (students.length) {
    students.forEach((student) => {
      const { fname, lname, id } = student;

      const newStudent = `<tr>
      <td>${id}</td>
      <td>${fname}</td>
      <td>${lname}</td>
      <td>
        <button onClick = "editStudent(${id})" id="edit" type="button" class="btn btn-secondary">
          <i class="bi bi-pencil"></i>
        </button>
        <button onClick = "deleteStudent(${id})" id="delete" type="button" class="btn btn-danger">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>`;
      tBody.innerHTML += newStudent;
    });
  } else {
    tBody.innerHTML = `<tr>
   <td colspan = "4" >No data found!</td>
 </tr>`;
  }
}
const modal = bootstrap.Modal.getOrCreateInstance(myModal);

function displayModalAndContent(title, tbody, tfooter) {
  modal.show();
  modalTitle.innerHTML = title;
  modalBody.innerHTML = tbody;
  modalFooter.innerHTML = tfooter;
}

addStudentBtn.addEventListener("click", () => {
  const mFooter = "";
  const mBody = `  <form onsubmit="submitFormData(event, false, null)" >
  <div class="form-group row">
    <label for="inputEmail3" class="col-sm-2 col-form-label"
      >First Name</label
    >
    <div class="col-sm-10">
      <input required type="text" class="form-control" id="fname" />
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword3" class="col-sm-2 col-form-label"
      >Last Name</label
    >
    <div class="col-sm-10">
      <input required type="text" class="form-control" id="lname" />
    </div>
  </div>
  <div class="form-group row">
    <div class="col-sm-10">
      <button type="button" id="close-modal" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
      <button type="submit" class="btn btn-primary" >Submit</button>
    </div>
  </div>
</form>`;
  displayModalAndContent("Add a Student", mBody, mFooter);
});

function editStudent(id) {
  const currStudent = allStudents.find((student) => student.id == id);

  const { fname, lname } = currStudent;
  const mbody = `  <form onsubmit="submitFormData(event, true, ${id})" >
  <div class="form-group row">
    <label for="inputEmail3" class="col-sm-2 col-form-label"
      >First Name</label
    >
    <div class="col-sm-10">
      <input value = "${fname}" required type="text" class="form-control" id="fname" />
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword3" class="col-sm-2 col-form-label"
      >Last Name</label
    >
    <div class="col-sm-10">
      <input value= "${lname}" required type="text" class="form-control" id="lname" />
    </div>
  </div>
  <div class="form-group row">
    <div class="col-sm-10">
      <button type="button" id="close-modal" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
      <button type="submit" class="btn btn-primary" >Submit</button>
    </div>
  </div>
</form>`;
  mFooter = "";
  displayModalAndContent("Edit Student", mbody, mFooter);
}

function submitFormData(e, editMode, id) {
  e.preventDefault();

  const modals = document.querySelector("#myModal");
  const inputElements = modals.querySelectorAll("input");
  const formData = {};

  for (let input of inputElements) {
    formData[input.id] = input.value;
  }
  // console.log(formData);
  const options = {
    method: editMode ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(formData),
  };

  const customUrl = editMode ? url + id : url;

  fetch(customUrl, options)
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);

      console.log(
        `Student with id ${data.id} has been successfully ${
          editMode ? "updated" : "added"
        }! `
      );
      fetchData();
      modal.hide();
    })
    .catch((err) => console.log(err));
}

function deleteStudent(id) {
  studentId = id;

  const mTitle = "Delete a Student?";
  const mBody = `<p>Are you sure you wnat to delete student with id <strong>${id}</strong></p>`;
  const mFooter = `<button
         type="button"
         class="btn btn-secondary"
         id="close-modal"
         data-bs-dismiss="modal"
         
          >
         No
          </button>
          <button id="submit-modal" type="button" class="btn btn-primary" onClick = "yesDeleteStudent(${id})">
           Yes
          </button>`;
  displayModalAndContent(mTitle, mBody, mFooter);
}

function yesDeleteStudent(id) {
  const options = {
    method: "DELETE",
  };
  fetch(url + id, options)
    .then((res) => res.json())
    .then((data) => {
      console.log(`student with id ${data.id} has been deleted`);

      fetchData();
    })
    .catch((err) => console.log(err));
  modal.hide();
}

searchInput.addEventListener("keyup", (event) => {
  const value = event.target.value.trim().toLowerCase();
  let filteredStudents = [];

  if (value !== " ") {
    searchGlassIcon.classList.add("d-none");
    searchClearIcon.classList.remove("d-none");

    filteredStudents = allStudents.filter((student) => {
      return (
        student.fname.toLowerCase().includes(value) ||
        student.lname.toLowerCase().includes(value)
      );
    });
    createStudents(filteredStudents);
  } else {
    searchGlassIcon.classList.remove("d-none");
    searchClearIcon.classList.add("d-none");
    createStudents(allStudents);
  }
});
searchClearIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchGlassIcon.classList.remove("d-none");
  searchClearIcon.classList.add("d-none");

  createStudents(allStudents);
});

const studentsPerPage = 10;
let currPage = 1;

function displayPaginatedStudents(page) {
  const start = (page - 1) * studentsPerPage;
  const end = start + studentsPerPage;
  const paginatedStudents = allStudents.slice(start, end);
  createStudents(paginatedStudents);
}

function prevPageFn() {
  if (currPage > 1) {
    currPage--;
    displayPaginatedStudents(currPage);
  }
}

function nextPageFn() {
  if (currPage * studentsPerPage < allStudents.length) {
    currPage++;
    displayPaginatedStudents(currPage);
  }
}

prevPage.addEventListener("click", prevPageFn);
nextPage.addEventListener("click", nextPageFn);
