function validateadmin(form) {

  // var cnic = document.getElementById("cnic").value;
  //var pass = document.getElementById("pass").value;

  //localStorage.setItem("cnic1", cnic)
  //localStorage.setItem("pass1", pass)

  //var cnic1 = localStorage.getItem("cnic1");
  //var pass1 = localStorage.getItem("pass1");

  if (form.acnic.value == "34101-111-1111-1" && form.apass.value == "admin") {
    localStorage.setItem("code", "secret");
    window.location.href = "AdminDash.html";/*opens the target page while Id & password matches*/
  }
  else {
    alert("Error CNIC or Password is incorrect or missing! ")/*displays error message*/
  }
}

//if (form.acnic.value == "34101-111-1111-1" && form.apass.value == "admin") {
//  window.location.replace('AdminDash.html')/*opens the target page while Id & password matches*/
//}
//else {
// alert("Error Password or Username")/*displays error message*/
//}
//}


function logout() {

  var a = localStorage.setItem("code", "logout");
  alert("Successfully logged-out")/*displays error message*/
  window.location.href = "index.html";

}

// timer functionality
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let mytime;
setInterval(() => {

  let mydate = new Date();
  mytime = mydate.toLocaleDateString(undefined, options);
  document.getElementById('timecl').innerHTML = mydate.getHours() + ":" + mydate.getMinutes() + ":" + mydate.getSeconds() + " " + mytime;


}, 1000);
