// Define area class list
const areaClassList = [
    "video-card-list is-main",
    "bangumi-area",
    "guo-chuang-area",
    "variety-area",
    "manga-card-list",
    "live-card-list",
    "eva-extension-area"
  ];
  
  // Define small ads class
  const smallAds = ["video-page-special-card-small"];
  
  // Define empty UpID list
  const UpIDList = [];
  
  // Extract UpID from URLs and add to UpIDList
  function extractUpID(urls) {
    const pattern = /https?:\/\/space\.bilibili\.com\/(\d+)/;
    const matches = urls.match(pattern);
    if (matches) {
      UpIDList.push(`//space.bilibili.com/${matches[1]}/`);
    }
  }
  
  // Read URL from user input and extract UpID
  function readURL() {
    if (UpIDList.length === 0) {
      const urls = prompt("Please enter a list of URLs separated by commas:");
      urls.split(",").forEach(extractUpID);
    } else {
      console.log("UpIDList:", UpIDList);
    }
  }
  
  // Store UpIDList in browser cookie
  function storeCookie() {
    const cookieValue = UpIDList.join(",");
    document.cookie = `UpIDList=${cookieValue}`;
    if (document.cookie.indexOf("UpIDList=") === -1) {
      console.log("Failed to store UpIDList in cookie");
    } else {
      console.log("UpIDList stored in cookie successfully");
    }
  }
  
  // Retrieve UpIDList from browser cookie
  function readCookie() {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)upids\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    
    if (cookieValue) {
      console.log(`Cookie found! Retrieving UpID list from cookie...`);
      UpIDList = JSON.parse(cookieValue);
    } else {
      console.log(`No cookie found! Requesting UpID list from user...`);
      readURL();
    }
  }
  
  
  // Remove small ads from page
  function turnAdOff() {
    for (let i = 0; i < smallAds.length; i++) {
      const elements = document.getElementsByClassName(smallAds[i]);
      for (let j = 0; j < elements.length; j++) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }
  }
  
  // Remove videos by UpID from page
  function turnUpOff() {
    UpIDList.forEach((upID) => {
      const href = upID;
      const videos = document.querySelectorAll(`.video-page-card-small a[href="${href}"]`);
      if (videos.length > 0) {
        videos.forEach((video) => video.closest(".video-page-card-small").remove());
        console.log(`Removed ${videos.length} videos with UpID ${upID} successfully`);
      } else {
        console.log(`No videos with UpID ${upID} found on the page`);
      }
    });
  }
  
  
  // Check for new elements and remove ads and videos dynamically
  const observer = new MutationObserver(() => {
    turnAdOff();
    turnUpOff();
  });
  observer.observe(document, { childList: true, subtree: true });
  
  // Wait for page to finish loading before removing ads and videos
  window.addEventListener("load", () => {
    readCookie();
    turnAdOff();
    turnUpOff();
  });
  