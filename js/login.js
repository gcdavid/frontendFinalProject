const loginForm = document.getElementById("login");

const request = indexedDB.open("registrationDB", 1);

request.onerror = function (event) {
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {

  const db = event.target.result;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = loginForm.elements["email"].value;
    const password = loginForm.elements["password"].value;

    const transaction = db.transaction(["users"]);
    const objectStore = transaction.objectStore("users");

    const request = objectStore.get(email);

    request.onsuccess = function (event) {
      const userData = event.target.result;

      if (userData) {
        if (userData.password === password) {
          console.log("Login successful");
          window.location.href = "../index.html";
        } else {
          alert("Incorrect password");
        }
      } else {
        alert("User not found!");
      }
    };

    request.onerror = function (event) {
      console.log("Error retrieving user data: " + event.target.errorCode);
    };
  });
};

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore("users", { keyPath: "email" });
};
