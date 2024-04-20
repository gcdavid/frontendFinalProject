//Navbar functionality
const primaryNavigation = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-item");
const navToggle = document.querySelector(".mobile-nav-toggle");
const navImg = document.querySelector("#menu-img");

let visibility = primaryNavigation.getAttribute("data-visible") === "true";

const openMenu = () => {
  visibility = true;
  primaryNavigation.setAttribute("data-visible", true);
  navToggle.setAttribute("aria-expanded", true);
  navImg.src = "assets/svg/close.svg";
};

const closeMenu = () => {
  visibility = false;
  primaryNavigation.setAttribute("data-visible", false);
  navToggle.setAttribute("aria-expanded", false);
  navImg.src = "assets/svg/menu.svg";
};

navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    if (visibility) {
      closeMenu();
    }
  });
});

navToggle.addEventListener("click", () => {
  if (visibility) {
    closeMenu();
  } else {
    openMenu();
  }
});

//tab functionality
function changeTab(evt, menu) {
  let i, tabContent, tablinks;

  tabContent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");

  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(menu).style.display = "block";
  evt.currentTarget.className += " active";
}

const accountBtn = document.getElementById("accountBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

// Initialize isOpen based on the value stored in localStorage
let isOpen = false;

function toggleDropdown() {
  // Toggle the visibility of the dropdown menu

  if (!isOpen) {
    dropdownMenu.classList.remove("block");
    dropdownMenu.classList.add("hidden");
  }

  if (isOpen) {
    dropdownMenu.classList.remove("hidden");
    dropdownMenu.classList.add("block");
  }

  // Toggle the state of isOpen
  isOpen = !isOpen;

  // Store the updated state in localStorage
  localStorage.setItem("dropdownOpen", isOpen.toString());
}

// Initial setup
toggleDropdown();

// Event listener
accountBtn.addEventListener("click", toggleDropdown);

//trip dummy data
const data = [
  {
    id: 1,
    image:
      "https://cf.bstatic.com/xdata/images/hotel/square600/121402222.webp?k=f7f266ab09f90ddea4464309eca14d79429afe4218ced6887cb52f82c42c03dc&o=",
    location: "Barrie, Canada",
    rating: 4.71,
    price: 100,
    date: "Apr 18 - May 20",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1547401061-7fbd33ec9021?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vbnRyZWFsfGVufDB8fDB8fHww",
    location: "Toronto, Canada",
    rating: 5,
    price: 120,
    date: "Apr 18 - May 20",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1545956146-d70420cd4320?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Toronto, Canada",
    rating: 5,
    price: 200,
    date: "Apr 18 - May 20",
  },
  {
    id: 4,
    image:
      "https://plus.unsplash.com/premium_photo-1672115680945-7fab8f469b55?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Toronto, Canada",
    rating: 5,
    price: 320,
    date: "Apr 18 - May 20",
  },
];

let savedTrips = [];

const recommendedTrip = document.querySelector(".recommended-trip");

// Function to create a trip element
function createTripElement(trip) {
  const tripElement = document.createElement("section");
  tripElement.classList.add("relative", "group");

  const image = document.createElement("img");
  image.src = trip.image;
  image.alt = "";
  image.classList.add(
    "w-full",
    "h-[240px]",
    "object-cover",
    "rounded-md",
    "mb-3"
  );
  tripElement.appendChild(image);

  const unfilledStar = document.createElement("img");
  unfilledStar.classList.add(
    "absolute",
    "top-2",
    "right-2",
    "hidden",
    "group-hover:block",
    "cursor-pointer",
    "w-[32px]"
  );

  const request = indexedDB.open("liked_trips", 3);

  request.onerror = function (event) {
    console.log("Database error: " + event.target.errorCode);
  };

  let isLiked = false;

  function updateLikeStatus(db, trip) {
    const tx = db.transaction("savedTrips");
    const store = tx.objectStore("savedTrips");

    const getStatus = store.get(trip.id);

    getStatus.onsuccess = () => {
      isLiked = getStatus.result !== undefined && getStatus.result !== null;
      if (isLiked) {
        unfilledStar.src = "assets/svg/heart.svg";
      } else {
        unfilledStar.src = "assets/svg/unfilledStar.svg";
      }

      unfilledStar.style.display = isLiked ? "block" : "hidden";
    };

    getStatus.onerror = () => {
      console.log("error");
    };
  }

  function getSavedTrips(db) {
    const tx = db.transaction("savedTrips");
    const store = tx.objectStore("savedTrips");

    const getAllTrips = store.getAll();

    getAllTrips.onsuccess = () => {
      let savedPropertyLength = getAllTrips.result.length;
      let savedProperties = getAllTrips.result;
      updateSavedPropertyText(savedProperties, savedPropertyLength);
    };
  }

  function updateSavedPropertyText(savedProperties, savedPropertyLength) {
    const savedProperty = document?.getElementById("savedPropertyNumber");
    const tripImg = document.createElement("tripImg");
    if (!savedProperty) {
      return;
    }
    savedProperty.textContent = savedPropertyLength;
    savedProperties.map((savedProperty) => {
      const tripImg = document.getElementById("tripImg");
      tripImg.src = savedProperty.image;
    });
  }

  request.onsuccess = function (event) {
    const db = event.target.result;
    updateLikeStatus(db, trip);
    getSavedTrips(db);

    unfilledStar.addEventListener("click", () => {
      if (isLiked) {
        unfilledStar.src = "assets/svg/unfilledStar.svg";
      } else {
        unfilledStar.src = "assets/svg/heart.svg";
      }

      const tx = db.transaction("savedTrips", "readwrite");
      const store = tx.objectStore("savedTrips");

      if (isLiked) {
        savedTrips = savedTrips.filter((savedTrip) => savedTrip.id !== trip.id);
        const request = store.delete(trip.id);
      } else {
        savedTrips.push(trip);
        const request = store.add(trip);
      }
      isLiked = !isLiked;
    });
  };

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore("savedTrips", { keyPath: "id" });
  };

  tripElement.appendChild(unfilledStar);

  const tripDetails = document.createElement("div");

  const location = document.createElement("span");
  location.textContent = trip.location;
  location.classList.add("font-semibold");
  tripDetails.appendChild(location);

  const ratingWrapper = document.createElement("div");
  ratingWrapper.classList.add("flex", "items-center");

  const ratingStarWrapper = document.createElement("div");
  for (let i = 0; i < Math.floor(trip.rating); i++) {
    const ratingStar = document.createElement("img");
    ratingStar.src = "assets/svg/star.svg";
    ratingStar.alt = "liked";
    ratingStar.classList.add("w-[20px]");
    ratingWrapper.appendChild(ratingStar);
  }

  ratingWrapper.appendChild(ratingStarWrapper);

  const decimalPart = trip.rating % 1;
  if (decimalPart > 0) {
    const halfStar = document.createElement("img");
    halfStar.src = "assets/svg/halfstar.svg";
    halfStar.alt = "half star";
    halfStar.classList.add("w-[16px]");
    ratingWrapper.appendChild(halfStar);
  }

  const rating = document.createElement("span");
  rating.textContent = trip.rating;
  ratingWrapper.appendChild(rating);

  tripDetails.appendChild(ratingWrapper);

  const tripInfo = document.createElement("div");

  const littleLake = document.createElement("span");
  littleLake.textContent = "Little Lake";
  littleLake.classList.add("text-gray-600");
  tripInfo.appendChild(littleLake);

  const date = document.createElement("span");
  date.textContent = trip.date;
  date.classList.add("text-gray-600");
  tripInfo.appendChild(date);

  const price = document.createElement("div");

  const priceAmount = document.createElement("span");
  priceAmount.textContent = `$ ${trip.price} `;
  priceAmount.classList.add("font-semibold");
  price.appendChild(priceAmount);

  const priceUnit = document.createElement("span");
  priceUnit.textContent = "night";
  priceUnit.classList.add("text-gray-600");
  price.appendChild(priceUnit);

  tripInfo.appendChild(price);

  tripDetails.appendChild(tripInfo);

  tripElement.appendChild(tripDetails);

  return tripElement;
}

// Function to render trips
function renderTrips() {
  const tripListElement = document.getElementById("tripList");
  data.forEach((trip) => {
    const tripElement = createTripElement(trip);

    tripListElement?.appendChild(tripElement);
  });
}

// Call renderTrips function to display the trips
renderTrips();
