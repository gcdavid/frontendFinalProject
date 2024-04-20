const registerForm = document.getElementById("register");

// Open (or create) the IndexedDB database
const request = indexedDB.open("registrationDB", 1);

request.onerror = function (event) {
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
  const db = event.target.result;

  // Add event listener for form submission
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = registerForm.elements["email"].value;
    const password = registerForm.elements["password"].value;
    const repassword = registerForm.elements["repassword"].value;

    // Create a transaction and get the object store
    const transaction = db.transaction(["users"], "readwrite");
    const objectStore = transaction.objectStore("users");

    // Create an object with the user data
    const userData = {
      email: email,
      password: password,
      repassword: repassword,
    };

    if (password != repassword) {
      return alert("Both of your password should be same.");
    }

    // Add the object to the object store
    const request = objectStore.add(userData);

    request.onsuccess = function (event) {
      alert(`User with ${email} created.`);
      // Clear the form after successful submission
      registerForm.reset();
    };

    request.onerror = function (event) {
      alert("Something went wrong");
    };
  });
};

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore("users", { keyPath: "email" });
  console.log("Object store created");
};
