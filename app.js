const modal = document.querySelector('#modal')
const content = document.querySelector('#content')
const backdrop = document.querySelector('#backdrop')
const progress = document.querySelector('#progress')
const form = document.querySelector('#form')

const APP_TITLE = document.title
const LS_KEY = 'MY_TECHS'

content.addEventListener('click', openCard)
backdrop.addEventListener('click', closeModal)
modal.addEventListener('change', toggleTech)
form.addEventListener('submit', createTech)

function openCard(event) {
    // Проверка. Если мы сликаем не по карточке, не открывается меню
    const data = event.target.dataset
    const tech = technologies.find(t => t.type === data.type)
    if (!tech) return

    openModal(toModal(tech), tech.title)
}

function toModal(tech) {
    const checked = tech.done ? 'checked' : ''

    return `
        <h2>${tech.title}</h2>
        <p>${tech.description}</p>
        <hr />
        <div>
            <input type="checkbox" id="done" ${checked} data-type="${tech.type}"/>
            <label for="done">Выучил</label>
        </div>
    `
}

function toggleTech (event) {
    const type = event.target.dataset.type
    const tech = technologies.find(t => t.type === type)
    tech.done = event.target.checked

    saveState()

    init()
}

function openModal(html, title = APP_TITLE) {
    document.title = `${title} | ${APP_TITLE}` 
    modal.innerHTML = html
    modal.classList.add('open')
}

function closeModal() {
    document.title = APP_TITLE
    modal.classList.remove('open')
}

const technologies = getState()

function init() {
    renderCards()
    renderProgress()
}

function renderCards() {
    if (technologies.length === 0) {
        content.innerHTML = '<p class="empty">Технологий пока что нет. Добавьте первую.</p>'
    } else {
        // let html = ''
        // for (let i = 0; i < technologies.length; i++) {
        //     const tech = technologies[i]
        //     html += toCard(tech)
        // }
        // content.innerHTML = html   
        content.innerHTML = technologies.map(toCard).join('')
    }
}

function toCard(tech) {
    const doneClass = tech.done ? 'done' : ''

    return `
    <div class="card ${doneClass}" data-type="${tech.type}">
        <h3 data-type="${tech.type}">${tech.title}</h3>
    </div>
`
}

function renderProgress() {
    const percent = completeProgressPercent()

    let background

    if (percent <= 30) {
        background = '#e75a5a'
    } else if (percent > 30 && percent <= 70) {
        background = '#f99415'
    } else {
        background = '#73ba3c'
    }

    progress.style.background = background
    progress.style.width = `${percent}%`
    progress.textContent = percent ? percent + '%' : ''
}

function completeProgressPercent() {
    // вычисляем процент выполненных задач от числа всех имеющихся

    if (technologies.length === 0) return 0

    let doneCount = 0
    for (let i = 0; i < technologies.length; i++) {
        if (technologies[i].done) doneCount++
    }

    return Math.round(doneCount/technologies.length*100)
}

function isInvalid(title, description) {
    return !title.value || ! description.value
}

function createTech(event) {
    event.preventDefault()

    // const title = event.target.title
    // const description = event.target.description
    const {title, description} = event.target

    if (isInvalid(title, description)) {
        if (!title.value) title.classList.add('invalid')
        if (!description.value) description.classList.add('invalid')

        setTimeout(() => {
            title.classList.remove('invalid')
            description.classList.remove('invalid')
        }, 2000)

        return
    }

    const newTech = {
        title: title.value,
        description: description.value,
        done: false,
        type: title.value.toLowerCase()
    }

    technologies.push(newTech)
    title.value = ''
    description.value = ''
    saveState()
    init()
}

function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(technologies))
}

function getState() {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
}

init()