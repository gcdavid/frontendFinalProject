function createTripElement(trip) {
  const tripElement = document.createElement("section");

  tripElement.classList.add("saved-trip");

  const tripDetailsContainer = document.createElement("div");
  tripDetailsContainer.classList.add(
    "w-[250px]",
    "shadow-md",
    "h-[450px]",
    "md:w-[300px]",
    "md:h-[440px]",
    "relative"
  );

  const tripImage = document.createElement("img");
  tripImage.src = trip.image;
  tripImage.alt = "";
  tripImage.classList.add("w-full", "h-[300px]", "object-cover", "rounded-md");
  tripDetailsContainer.appendChild(tripImage);

  const ratingWrapper = document.createElement("div");
  ratingWrapper.classList.add("flex", "items-center");

  for (let i = 0; i < Math.floor(trip.rating); i++) {
    const ratingStar = document.createElement("img");
    ratingStar.src = "star.svg";
    ratingStar.alt = "liked";
    ratingStar.classList.add("w-[20px]");
    ratingWrapper.appendChild(ratingStar);
  }

  const decimalPart = trip.rating % 1;
  if (decimalPart > 0) {
    const halfStar = document.createElement("img");
    halfStar.src = "../assets/svg/halfstar.svg";
    halfStar.alt = "half star";
    halfStar.classList.add("w-[16px]");
    ratingWrapper.appendChild(halfStar);
  }

  const ratingInfoWrapper = document.createElement("div");
  ratingInfoWrapper.classList.add("flex", "items-center");

  const ratingStarNumberWrapper = document.createElement("div");
  const ratingStarNumber = document.createElement("span");
  ratingStarNumber.textContent = trip.rating;
  ratingStarNumberWrapper.appendChild(ratingStarNumber);
  ratingStarNumberWrapper.classList.add(
    "bg-blue-500",
    "text-xs",
    "w-6",
    "h-6",
    "flex",
    "justify-center",
    "items-center",
    "p-4",
    "rounded-r-[10px]",
    "rounded-tl-[10px]"
  );

  const ratingGrade = document.createElement("span");
  ratingGrade.textContent = "Excellent";

  const ratingReviewNumber = document.createElement("span");
  ratingReviewNumber.textContent = "590 reviews";
  ratingInfoWrapper.appendChild(ratingStarNumberWrapper);
  ratingInfoWrapper.appendChild(ratingGrade);
  ratingInfoWrapper.appendChild(ratingReviewNumber);

  const locationWrapper = document.createElement("div");
  locationWrapper.classList.add("text-sm");
  const locationInfo1 = document.createElement("div");
  locationInfo1.classList.add("flex", "items-center", "gap-2");
  const locationIcon1 = document.createElement("img");
  locationIcon1.src = "location.svg";
  locationIcon1.alt = "location";
  locationIcon1.classList.add("w-[20px]");
  const locationText1 = document.createElement("span");
  locationText1.textContent = trip.location;
  locationInfo1.appendChild(locationIcon1);
  locationInfo1.appendChild(locationText1);

  const locationInfo2 = document.createElement("div");
  locationInfo2.classList.add("flex", "gap-2", "my-1");
  const locationIcon2 = document.createElement("img");
  locationIcon2.src = "distance.svg";
  locationIcon2.alt = "location";
  locationIcon2.classList.add("w-[20px]");
  const locationText2 = document.createElement("span");
  locationText2.textContent = "350m from center";
  locationInfo2.appendChild(locationIcon2);
  locationInfo2.appendChild(locationText2);

  locationWrapper.appendChild(locationInfo1);
  locationWrapper.appendChild(locationInfo2);

  const tripPricingWrapper = document.createElement("div");
  tripPricingWrapper.classList.add(
    "text-sm",
    "float-right",
    "text-right",
    "my-2"
  );
  const tripPricing1 = document.createElement("span");
  tripPricing1.textContent = "1 night, 2 adults";

  const tripPricing2 = document.createElement("div");
  const oldPrice = document.createElement("span");
  oldPrice.textContent = "CAD 175";
  oldPrice.classList.add("text-red-600", "line-through");
  const newPrice = document.createElement("span");
  newPrice.textContent = "CAD 157";
  newPrice.classList.add("font-semibold");
  tripPricing2.appendChild(oldPrice);
  tripPricing2.appendChild(newPrice);

  const priceInfo = document.createElement("span");
  priceInfo.textContent = "Includes taxes and fees";

  tripPricingWrapper.appendChild(tripPricing1);
  tripPricingWrapper.appendChild(tripPricing2);
  tripPricingWrapper.appendChild(priceInfo);

  const cancelTripWrapper = document.createElement("div");
  cancelTripWrapper.dataset.tripId = trip.id;
  cancelTripWrapper.addEventListener("click", (e) => {
    const tripId = e.currentTarget.dataset.tripId;
    deleteSavedTrip(db, tripId)
      .then(() => {
        renderUpdatedTrips(trip);
      })
      .catch((error) => {
        console.error(error);
      });
  });
  cancelTripWrapper.classList.add(
    "w-[30px]",
    "absolute",
    "top-2",
    "right-3",
    "cursor-pointer",
    "cancel-trip"
  );
  const cancelIcon = document.createElement("img");
  cancelIcon.src = "close.svg";
  cancelIcon.alt = "close-icon";
  cancelIcon.classList.add("w-[30px]", "rounded-full");
  cancelTripWrapper.appendChild(cancelIcon);

  tripDetailsContainer.appendChild(ratingWrapper);
  tripDetailsContainer.appendChild(locationWrapper);
  tripDetailsContainer.appendChild(tripPricingWrapper);
  tripDetailsContainer.appendChild(cancelTripWrapper);

  tripElement.append(tripDetailsContainer);

  return tripElement;
}

const tripNumber = document.getElementById("tripNumber");
const request = indexedDB.open("liked_trips", 3);

request.onerror = function (event) {
  console.log("Database error: " + event.target.errorCode);
};

function getSavedTrips(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("savedTrips");
    const store = tx.objectStore("savedTrips");

    const getAllTrips = store.getAll();

    getAllTrips.onsuccess = () => {
      resolve(getAllTrips.result);
    };

    getAllTrips.onerror = () => {
      reject("Error fetching saved trips");
    };
  });
}

// Function to render trips
let db;
let tripLength;
function renderTrips() {
  const tripListElement = document.getElementById("saved-trip");

  request.onsuccess = async (event) => {
    db = event.target.result;

    try {
      const savedTrips = await getSavedTrips(db);
      tripNumber.textContent = savedTrips.length;
      savedTrips.forEach((trip) => {
        const tripElement = createTripElement(trip);
        tripListElement.appendChild(tripElement);
      });
    } catch (error) {
      console.error(error);
    }
  };
}

function deleteSavedTrip(db, tripId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("savedTrips", "readwrite");
    const store = tx.objectStore("savedTrips");

    //+ converting the data type in number.
    const deletedTripRequest = store.delete(+tripId);

    deletedTripRequest.onsuccess = async () => {
      try {
        const updatedTrips = await getSavedTrips(db);
        renderUpdatedTrips(updatedTrips);
      } catch (error) {
        console.error("Error updating trips:", error);
      }
    };

    deletedTripRequest.onerror = (event) => {
      console.error("Error deleting trip:", event.target.error);
      reject(event.target.error);
    };
  });
}

function renderUpdatedTrips(trips) {
  const tripListElement = document.getElementById("saved-trip");

  //Clear the static data
  while (tripListElement.firstChild) {
    tripListElement.removeChild(tripListElement.firstChild);
  }

  tripNumber.textContent = trips.length;

  trips.forEach((trip) => {
    const tripElement = createTripElement(trip);
    tripListElement.appendChild(tripElement);
  });
}

// Call renderTrips function to display the trips
renderTrips();
