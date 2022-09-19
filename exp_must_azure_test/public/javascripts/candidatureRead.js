let validationContainer = document.getElementById('validation-container');
let openNotesButton = document.getElementById('open-notes-button');
let notesContainer = document.getElementById('notes-container');
let managerNoteButton = document.getElementById('manager-note-button');
let rhNoteButton = document.getElementById('rh-note-button');
let managerTab = document.getElementById('manager-tab');
let rhTab = document.getElementById('rh-tab');
let saveNoteButton = document.getElementById('save-note-button');
let form = document.getElementById('form');
let textArea = document.getElementById('text-area');
let saveNotesButtonManager = document.getElementById(
	'save-notes-button-manager'
);
let saveNotesButtonRh = document.getElementById('save-notes-button-rh');

openNotesButton.addEventListener('click', () => handleClickOpenNotes());
managerNoteButton.addEventListener('click', () => handleClickManagerNote());
rhNoteButton.addEventListener('click', () => handleClickRhNote());
saveNoteButton.addEventListener('click', () => handleClickSaveNote());

function handleClickOpenNotes() {
	validationContainer.style.display = 'none';
	notesContainer.style.display = 'block';
}

function handleClickManagerNote() {
	rhTab.style.display = 'none';
	managerTab.style.display = 'block';
	rhNoteButton.classList.remove('border-b-2');
	rhNoteButton.classList.remove('border-blue-400');
	managerNoteButton.classList.add('border-b-2');
	managerNoteButton.classList.add('border-blue-400');
	if (saveNotesButtonRh) {
		saveNotesButtonRh.classList.add('hidden');
	}
	if (saveNotesButtonManager) {
		saveNotesButtonManager.classList.remove('hidden');
	}
}

function handleClickRhNote() {
	managerTab.style.display = 'none';
	rhTab.style.display = 'block';
	managerNoteButton.classList.remove('border-b-2');
	managerNoteButton.classList.remove('border-blue-400');
	rhNoteButton.classList.add('border-b-2');
	rhNoteButton.classList.add('border-blue-400');
	if (saveNotesButtonManager) {
		saveNotesButtonManager.classList.add('hidden');
	}
	if (saveNotesButtonRh) {
		saveNotesButtonRh.classList.remove('hidden');
	}
}

function handleClickSaveNote() {
	form.submit();
}
