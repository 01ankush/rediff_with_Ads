//      window.googletag = window.googletag || { cmd: [] };

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function () {
    googletag.pubads().disableInitialLoad();
});


let rewardedSlot;

function dismissRewardedAd() {
    displayModal();

    if (rewardedSlot) {
        googletag.destroySlots([rewardedSlot]);
    }
}

function displayModal(type = "", message = "", url = "") {
    const modal = document.getElementById("modal");
    modal.removeAttribute("data-type");

    if (type) {
        document.getElementById("modalMessage").textContent = message;
        
        modal.setAttribute("data-type", type);
    }
}



googletag.cmd.push(function () {
    // Register click event handlers.
    document.getElementById("closeButton").addEventListener("click", dismissRewardedAd);
    document.getElementById("noRewardButton").addEventListener("click", dismissRewardedAd);
});
// Function to check if the user has visited more than 5 times in a day
function checkVisitCount() {
    // Get the current date
    var currentDate = new Date().toLocaleDateString();

    // Retrieve visit count from localStorage
    var visitCount = localStorage.getItem('visitCount');
    var lastVisitDate = localStorage.getItem('lastVisitDate');

    // If there's no stored date or the stored date is not the current date, reset the count
    if (!lastVisitDate || lastVisitDate !== currentDate) {
        visitCount = 0;
    }

    // Increment the visit count
    visitCount = parseInt(visitCount) + 1;

    // Update the localStorage with the new values
    localStorage.setItem('visitCount', visitCount);
    localStorage.setItem('lastVisitDate', currentDate);

}

// Call the function when the page loads article page only
threshold = 0;
visitcount = localStorage.getItem('visitCount');
if (visitcount == undefined)
    visitcount = 0;

//load this only when article pages is loaded
if (window.location.href.includes("article"))
    checkVisitCount();

if (visitcount >= threshold) {


    var articleLinks = document.querySelectorAll('a[href*="article"]');

    articleLinks.forEach(function (element) {
        element.addEventListener('click', function (event) {
            // Prevent the default behavior of the link (e.g., navigating to a new page)
            event.preventDefault();
            // displayModal();


            // Your custom logic here
            start(element.href);
            // For example, you can log a message to the console
        });
    });
}
function start(url) {



    googletag.cmd.push(() => {

        rewardedSlot = googletag.defineOutOfPageSlot(
            "/22639388115/rewarded_web_example",
            googletag.enums.OutOfPageFormat.REWARDED,
        );

        // Slot returns null if the page or device does not support rewarded ads.
        if (rewardedSlot) {

            rewardedSlot.addService(googletag.pubads());

            googletag.pubads().enableSingleRequest();
            googletag.enableServices();

            googletag.pubads().refresh([rewardedSlot]);

            timer = 0;
            googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
                timer = 1;
                document.getElementById("watchAdButton").onclick = () => {
                    event.makeRewardedVisible();
                    displayModal();
                };

                displayModal("reward", "Please click the blue play button and watch the video from google, its an add that allows us to keep rediff.com Free");
            });

            setTimeout(function () {
                if (timer == 0)
                    window.location.href = url;
                console.log('Delayed message');
            }, 500);

            googletag.pubads().addEventListener("rewardedSlotClosed", dismissRewardedAd);

            googletag.pubads().addEventListener("rewardedSlotGranted", (event) => {
                // Automatically close the ad by destroying the slot.
                // Remove this to force the user to close the ad themselves.
                //alert("HERE AGAIN");
                dismissRewardedAd();

                const reward = event.payload;
                if (reward) {
                    dismissRewardedAd();
                    window.location.href = url;

                }
            });

            googletag.enableServices();
            googletag.display(rewardedSlot);
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    // Select all article links on the page
    var articleLinks = document.querySelectorAll('a[href^="https://www.rediff.com/news/report/"]');

    // Add click event listeners to each article link
    articleLinks.forEach(function (element) {
        element.addEventListener('click', function (event) {
            // Prevent the default behavior of the link (e.g., navigating to a new page)
            event.preventDefault();
            // Your custom logic here
            displayModal();
            start(element.href);

            // For example, you can log a message to the console
            console.log('Article link clicked:', element.href);
        });
    });
});
