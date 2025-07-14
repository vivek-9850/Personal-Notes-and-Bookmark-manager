// Initialize data from localStorage or set empty arrays
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

// Form elements
const noteForm = document.getElementById('noteForm');
const bookmarkForm = document.getElementById('bookmarkForm');
const notesSection = document.getElementById('notesSection');
const bookmarksSection = document.getElementById('bookmarksSection');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');

// Show/Hide sections
function showNotes() {
    notesSection.classList.remove('hidden');
    bookmarksSection.classList.add('hidden');
    renderNotes();
}

function showBookmarks() {
    bookmarksSection.classList.remove('hidden');
    notesSection.classList.add('hidden');
    renderBookmarks();
}

// Handle note submission
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    if (!title || !content) {
        alert('Please fill in all fields');
        return;
    }

    const note = {
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleDateString(),
        favorite: false
    };

    notes.push(note);
    saveNotes();
    renderNotes();
    noteForm.reset();
});

// Handle bookmark submission
bookmarkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('bookmarkTitle').value;
    const url = document.getElementById('bookmarkUrl').value;
    const description = document.getElementById('bookmarkDescription').value;
    
    if (!title || !url) {
        alert('Please fill in all required fields');
        return;
    }

    const bookmark = {
        id: Date.now(),
        title,
        url,
        description,
        date: new Date().toLocaleDateString(),
        favorite: false
    };

    bookmarks.push(bookmark);
    saveBookmarks();
    renderBookmarks();
    bookmarkForm.reset();
});

// Save to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// Delete functions
function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== id);
        saveNotes();
        renderNotes();
    }
}

function deleteBookmark(id) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
        saveBookmarks();
        renderBookmarks();
    }
}

// Toggle favorite
function toggleNoteFavorite(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.favorite = !note.favorite;
        saveNotes();
        renderNotes();
    }
}

function toggleBookmarkFavorite(id) {
    const bookmark = bookmarks.find(b => b.id === id);
    if (bookmark) {
        bookmark.favorite = !bookmark.favorite;
        saveBookmarks();
        renderBookmarks();
    }
}

// Edit functions
function openEditModal(type, id) {
    const item = type === 'note' 
        ? notes.find(n => n.id === id)
        : bookmarks.find(b => b.id === id);

    if (!item) return;

    document.getElementById('editItemId').value = id;
    document.getElementById('editItemType').value = type;
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editContent').value = type === 'note' ? item.content : item.description;
    
    const urlContainer = document.getElementById('editUrlContainer');
    if (type === 'bookmark') {
        urlContainer.classList.remove('hidden');
        document.getElementById('editUrl').value = item.url;
    } else {
        urlContainer.classList.add('hidden');
    }

    editModal.classList.remove('hidden');
}

function closeEditModal() {
    editModal.classList.add('hidden');
    editForm.reset();
}

// Handle edit form submission
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('editItemId').value);
    const type = document.getElementById('editItemType').value;
    const title = document.getElementById('editTitle').value;
    const content = document.getElementById('editContent').value;

    if (type === 'note') {
        const note = notes.find(n => n.id === id);
        if (note) {
            note.title = title;
            note.content = content;
            saveNotes();
            renderNotes();
        }
    } else {
        const url = document.getElementById('editUrl').value;
        const bookmark = bookmarks.find(b => b.id === id);
        if (bookmark) {
            bookmark.title = title;
            bookmark.description = content;
            bookmark.url = url;
            saveBookmarks();
            renderBookmarks();
        }
    }

    closeEditModal();
});

// Render functions
function renderNotes() {
    const notesList = document.getElementById('notesList');
    
    notesList.innerHTML = notes.map(note => `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold">${note.title}</h3>
                <div class="flex space-x-2">
                    <button onclick="toggleNoteFavorite(${note.id})" class="text-yellow-500 hover:text-yellow-600 text-xl" title="${note.favorite ? 'Remove from favorites' : 'Add to favorites'}">
                        <i class="fa-solid ${note.favorite ? 'fa-star' : 'fa-star'}" style="font-weight: ${note.favorite ? 'bold' : 'normal'}"></i>
                    </button>
                    <button onclick="openEditModal('note', ${note.id})" class="text-blue-500 hover:text-blue-700">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteNote(${note.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-600 mb-4">${note.content}</p>
            <p class="text-sm text-gray-500">Created: ${note.date}</p>
        </div>
    `).join('');
}

function renderBookmarks() {
    const bookmarksList = document.getElementById('bookmarksList');
    
    bookmarksList.innerHTML = bookmarks.map(bookmark => `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold">${bookmark.title}</h3>
                <div class="flex space-x-2">
                    <button onclick="toggleBookmarkFavorite(${bookmark.id})" class="text-yellow-500 hover:text-yellow-600 text-xl" title="${bookmark.favorite ? 'Remove from favorites' : 'Add to favorites'}">
                        <i class="fa-solid ${bookmark.favorite ? 'fa-star' : 'fa-star'}" style="font-weight: ${bookmark.favorite ? 'bold' : 'normal'}"></i>
                    </button>
                    <button onclick="openEditModal('bookmark', ${bookmark.id})" class="text-blue-500 hover:text-blue-700">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteBookmark(${bookmark.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <a href="${bookmark.url}" target="_blank" class="text-blue-600 hover:text-blue-800 block mb-2 break-all">
                <i class="fas fa-link mr-2"></i>${bookmark.url}
            </a>
            <p class="text-gray-600 mb-4">${bookmark.description || 'No description'}</p>
            <p class="text-sm text-gray-500">Added: ${bookmark.date}</p>
        </div>
    `).join('');
}

// Initial render
renderNotes();
renderBookmarks(); 