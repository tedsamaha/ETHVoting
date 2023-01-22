firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      var email_id = user.email;

      var voterm = (document.getElementById('voterMail').innerHTML = email_id);
    }
  } else {
    // No user is signed in.
  }
});

//voter login functionality

function voterlogin() {
  var vcnic = document.getElementById('vcnic').value;
  var vpin = document.getElementById('vpin').value;

  firebase
    .auth()
    .signInWithEmailAndPassword(vcnic, vpin)
    .then((userCredential) => {
      // Signed in

      var user = userCredential.user;
      // exp
      //
      localStorage.setItem('code', 'vsecrett');
      window.location.replace('VoterDashboard.html');

      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // showing err msg
      var err = (document.getElementById('err').innerHTML = errorMessage);
      // ..
    });
}

//voter logout functionality

function voterlogout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      var vl = localStorage.setItem('code', 'vlogoutt');
      window.alert('Successfully logged-out');
      window.location.replace('index.html');
    })
    .catch((error) => {
      // An error happened.
      window.alert(error);
    });
}

//voter registeration functionality

function registerVoter() {
  var vrmail = document.getElementById('vrmail').value;
  var vrcnic = document.getElementById('vrcnic').value;
  var vrphone = document.getElementById('vrphone').value;
  var vrpin = document.getElementById('vrpin').value;

  console.log(vrcnic.length);
  if (vrmail && vrcnic && vrphone && vrpin) {
    if (vrcnic.length == 13) {
      var db = firebase.firestore();
      db.collection('users')
        .add({
          Email: vrmail,
          Cnic: vrcnic,
          Phone: vrphone,
          //Pin: vrpin
        })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });

      firebase
        .auth()
        .createUserWithEmailAndPassword(vrmail, vrpin)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;

          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          window.alert(error.message);

          // ..
        });
      window.alert('User Registered.');
      window.location.href = 'index.html';
    } else {
      window.alert('Invalid Cnic');
    }
  } else {
    window.alert('Please Fill the fields');
  }
}

//// elecion status active functionality

function statusActive() {
  document.getElementById('elecmsg').innerHTML =
    'Current Status : Elections Active';

  var db = firebase.firestore();
  db.collection('electionstatus')
    .doc('GZfNxyDWkg0RTS9Z2Wya')
    .update({
      value: 1,
      //Pin: vrpin
    })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
}

// election statusclosed functionality
function statusClosed() {
  document.getElementById('elecmsg').innerHTML =
    'Current Status : Elections Closed';

  var db = firebase.firestore();
  db.collection('electionstatus')
    .doc('GZfNxyDWkg0RTS9Z2Wya')
    .update({
      value: 0,
      //Pin: vrpin
    })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      // console.error("Error adding document: ", error);
    });
}

//Election status check functionality

function checkelectionstatus() {
  var db = firebase.firestore();
  var docRef = db.collection('electionstatus').doc('GZfNxyDWkg0RTS9Z2Wya');

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        var val = doc.data().value;

        var val = val.toString();
        console.log(val);
        if (val == 1) {
          window.location.replace('castvote.html');
          window.alert('You may Vote now :)');
        } else {
          window.alert('Election not started yet');
        }
        //location.reload();
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
}

function checkelectionstatus1() {
  var db = firebase.firestore();
  var docRef = db.collection('electionstatus').doc('GZfNxyDWkg0RTS9Z2Wya');

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        var val = doc.data().value;

        var val = val.toString();
        console.log(val);
        if (val == 1) {
          document.getElementById('elecmsg').innerHTML =
            'Current Status : Elections Active';
        } else {
          document.getElementById('elecmsg').innerHTML =
            'Current Status : Elections Closed';
        }
        //location.reload();
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
}

/// change Pin funtionality

function changepin() {
  var auth = firebase.auth();
  var email = document.getElementById('remail').value;

  if (email != '') {
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        window.alert('Email has been send to you please check and verify.');
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);

        window.alert('Message :' + errorMessage);
      });
  } // if end
  else {
    window.alert('Please write your email first.');
  }
} // function ends

// admin logout
function logout() {
  var a = localStorage.setItem('code', 'logout');
  alert('Successfully logout'); /*displays error message*/
  window.location.href = 'index.html';
}

// Timer functionality
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
let mytime;
setInterval(() => {
  let mydate = new Date();
  mytime = mydate.toLocaleDateString(undefined, options);
  document.getElementById('timecl').innerHTML =
    mydate.getHours() +
    ':' +
    mydate.getMinutes() +
    ':' +
    mydate.getSeconds() +
    '<br>' +
    mytime;
}, 1000);
