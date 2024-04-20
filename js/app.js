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
