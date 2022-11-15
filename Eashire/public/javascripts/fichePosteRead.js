const containerDiv = document.getElementById('ficheposteread-div')
const cancelButton = document.querySelectorAll('.cancel-button')
const updateButton = document.querySelectorAll('.update-button')

/*
 * QUERYING THE LINKS AND DIVS
 */

// LABEL
const labelModifierDiv = document.getElementById('modifier-label')
const labelModifierLink = document.getElementById('link-label')
// TYPE
const typeModifierDiv = document.getElementById('modifier-type')
const typeModifierLink = document.getElementById('link-type')
// URGENCY
const urgencyModifierDiv = document.getElementById('modifier-urgency')
const urgencyModifierLink = document.getElementById('link-urgency')
// JOBDESCRIPTION
const jobDescriptionModifierDiv = document.getElementById('modifier-jobDescription')
const jobDescriptionModifierLink = document.getElementById('link-jobDescription')
// LOCALISATION
const localisationModifierDiv = document.getElementById('modifier-localisation')
const localisationModifierLink = document.getElementById('link-localisation')
// DESTINATIONSERVICE
const destinationServiceModifierDiv = document.getElementById('modifier-destinationService')
const destinationServiceModifierLink = document.getElementById('link-destinationService')
// ENTRYDATE
const entryDateModifierDiv = document.getElementById('modifier-entryDate')
const entryDateModifierLink = document.getElementById('link-entryDate')
// ENDDATE
const endDateModifierDiv = document.getElementById('modifier-endDate')
const endDateModifierLink = document.getElementById('link-endDate')
// EXPERIENCE
const experienceModifierDiv = document.getElementById('modifier-experience')
const experienceModifierLink = document.getElementById('link-experience')
// COMPENSATION
const compensationModifierDiv = document.getElementById('modifier-compensation')
const compensationModifierLink = document.getElementById('link-compensation')

// ADD ON CLICK EVENT TO LINK
labelModifierLink.addEventListener('click', () => handleLinkClicked('label'))
typeModifierLink.addEventListener('click', () => handleLinkClicked('type'))
urgencyModifierLink.addEventListener('click', () => handleLinkClicked('urgency'))
jobDescriptionModifierLink.addEventListener('click', () => handleLinkClicked('jobDescription'))
localisationModifierLink.addEventListener('click', () => handleLinkClicked('localisation'))
destinationServiceModifierLink.addEventListener('click', () =>
	handleLinkClicked('destinationService'),
)
entryDateModifierLink.addEventListener('click', () => handleLinkClicked('entryDate'))
endDateModifierLink.addEventListener('click', () => handleLinkClicked('endDate'))
experienceModifierLink.addEventListener('click', () => handleLinkClicked('experience'))
compensationModifierLink.addEventListener('click', () => handleLinkClicked('compensation'))

// ADD EVENT LISTENERS ON UPDATE AND CANCEL BUTTON
cancelButton.forEach((currentCancelButton) => {
	currentCancelButton.addEventListener('click', () => handleCancel())
})

updateButton.forEach((currentUpdateButton) => {
	currentUpdateButton.addEventListener('click', () => handleUpdateClicked())
})

function handleCancel() {
	containerDiv.style.opacity = 1
	labelModifierDiv.style.display = 'none'
	typeModifierDiv.style.display = 'none'
	urgencyModifierDiv.style.display = 'none'
	jobDescriptionModifierDiv.style.display = 'none'
	localisationModifierDiv.style.display = 'none'
	destinationServiceModifierDiv.style.display = 'none'
	entryDateModifierDiv.style.display = 'none'
	endDateModifierDiv.style.display = 'none'
	experienceModifierDiv.style.display = 'none'
	compensationModifierDiv.style.display = 'none'
	localStorage.removeItem('currentUpdate')
}

function handleLinkClicked(linkName) {
	containerDiv.style.opacity = 0.25
	switch (linkName) {
		case 'label':
			localStorage.setItem('currentUpdate', 'label')
			labelModifierDiv.style.display = 'flex'
			break
		case 'type':
			localStorage.setItem('currentUpdate', 'type')
			typeModifierDiv.style.display = 'flex'
			break
		case 'urgency':
			localStorage.setItem('currentUpdate', 'urgency')
			urgencyModifierDiv.style.display = 'flex'
			break
		case 'jobDescription':
			localStorage.setItem('currentUpdate', 'jobDescription')
			jobDescriptionModifierDiv.style.display = 'flex'
			break
		case 'localisation':
			localStorage.setItem('currentUpdate', 'localisation')
			localisationModifierDiv.style.display = 'flex'
			break
		case 'destinationService':
			localStorage.setItem('currentUpdate', 'destinationService')
			destinationServiceModifierDiv.style.display = 'flex'
			break
		case 'entryDate':
			localStorage.setItem('currentUpdate', 'entryDate')
			entryDateModifierDiv.style.display = 'flex'
			break
		case 'endDate':
			localStorage.setItem('currentUpdate', 'endDate')
			endDateModifierDiv.style.display = 'flex'
			break
		case 'experience':
			localStorage.setItem('currentUpdate', 'experience')
			experienceModifierDiv.style.display = 'flex'
			break
		case 'compensation':
			localStorage.setItem('currentUpdate', 'compensation')
			compensationModifierDiv.style.display = 'flex'
			break
		default:
			console.log('No link name was passed')
	}
}

function handleUpdateClicked() {
	const currentUpdate = localStorage.getItem('currentUpdate')

	const currentForm = document.querySelector(`#form-update-${currentUpdate}`).submit()
}
