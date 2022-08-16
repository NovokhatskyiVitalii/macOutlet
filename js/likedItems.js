const LOCALE_STORAGE_KEY = 'likedItems';

// array of ids [3, 6, 15]
let likedItems = [];

export function toggleLikedItem(id) {
    if (isItemLiked(id)) {
        removeLikedItem(id);
    } else {
        addLikedItem(id)
    }
    setLikedItemsToStorage(likedItems);
}

function addLikedItem(id) {
    if (!isItemLiked(id)) {
        likedItems.push(id);
    }
}

function removeLikedItem(id) {
    let pos = likedItems.indexOf(id);

    likedItems.splice(pos, 1);
}

export function isItemLiked(id) {
    return likedItems.includes(id);
}

function getLikedItemsFromStorage() {
    let likedItemsJSON = localStorage.getItem(LOCALE_STORAGE_KEY);

    if (likedItemsJSON) {
        return JSON.parse(likedItemsJSON);
    }
    return [];
}

function setLikedItemsToStorage(items) {
    let likedItemsJSON = JSON.stringify(items);

    localStorage.setItem(LOCALE_STORAGE_KEY, likedItemsJSON);
}

export default function initLikedItems() {
    likedItems = getLikedItemsFromStorage();
}