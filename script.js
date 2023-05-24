class Book {
    constructor(title, author, pagesRead, imgUrl) {
        this.title = title
        this.author = author
        this.pagesRead = pagesRead
        this.read = undefined
        this.imgUrl = imgUrl
        this.submittedAt = new Date()
    }

    markAsRead() {
        this.read = true
    }

    markAsUnread() {
        this.read = false
    }
}

let library = []

if (localStorage.getItem("library") && localStorage.getItem("library") !== "[]") {
    library = JSON.parse(localStorage.getItem("library"))
    document.querySelector(".empty-library").style.display = "none"
    updateLibrary()
}

function updateClearButton() {
    const clearBtn = document.querySelector("#clear")
    console.log(library.length)
    if (library.length > 0) {
        clearBtn.style.display = "block"
    } else {
        clearBtn.style.display = "none"
    }
}

function submitData() {
    const getTitle = document.querySelector("#book-name").value
    const getAuthor = document.querySelector("#author").value
    const getPagesRead = document.querySelector("#pagesRead").value
    const getImgUrl = document.querySelector("#imgUrl").value

    const book = new Book(getTitle, getAuthor, getPagesRead, getImgUrl)

    if (document.querySelector("#checkbox").checked) {
        book.markAsRead()
    } else {
        book.markAsUnread()
    }

    library.push(book)

    localStorage.setItem("library", JSON.stringify(library))

    updateLibrary()
    updateClearButton()
}

function updateLibrary() {
    const displayArea = document.querySelector("#submitted-data")
    displayArea.innerHTML = ""

    library = library.map(book => {
        book.submittedAt = new Date(book.submittedAt)
        return book
      });

    library.sort((a, b) => b.submittedAt - a.submittedAt)

    for (const book of library) {
        let readStatus = "Unfinished"
        if (book.read) {
            readStatus = "Finished"
        }
        
        const submittedDate = book.submittedAt.toLocaleString("en-UK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        
        //Generate individual tiles with book information in the DOM
        //Main div -> div.data-grid
        const dataGrid = document.createElement("div")
        dataGrid.classList.add("data-grid")
        
        //div.title-author elements
        const titleAuthor = document.createElement("div")
        titleAuthor.classList.add("title-author")
        const bookTitle = document.createElement("h2")
        bookTitle.textContent = book.title
        titleAuthor.appendChild(bookTitle)
        const bookAuthor = document.createElement("p")
        bookAuthor.textContent = book.author
        titleAuthor.appendChild(bookAuthor)
        dataGrid.appendChild(titleAuthor)
        
        //div.book-info elements
        const bookInfo = document.createElement("div")
        bookInfo.classList.add("book-info")
        const bookInfoNestedDiv = document.createElement("div")
        const pagesReadPElem = document.createElement("p")
        pagesReadPElem.innerHTML = `<span>Pages Read:</span> <br>${book.pagesRead}`
        bookInfoNestedDiv.appendChild(pagesReadPElem)
        const readStatusPElem = document.createElement("p")
        readStatusPElem.innerHTML = `<span>Status:</span><br>${readStatus}`
        bookInfoNestedDiv.appendChild(readStatusPElem)
        bookInfo.appendChild(bookInfoNestedDiv)
        dataGrid.appendChild(bookInfo)
        
        //img element 
        const imgElem = document.createElement("img")
        if (!book.imgUrl) {
            imgElem.src = "icons/book.png"
        } else {
            imgElem.src = book.imgUrl
        }
        bookInfo.appendChild(imgElem)
        dataGrid.appendChild(bookInfo)
        
        //div.submitted-date elements
        const submittedDateDiv = document.createElement("div")
        submittedDateDiv.classList.add("submitted-date")
        const submittedDatePElem = document.createElement("p")
        submittedDatePElem.innerHTML = `<span>Submitted:</span> ${submittedDate}`
        submittedDateDiv.appendChild(submittedDatePElem)
        const iElem = document.createElement("i")
        iElem.classList.add("fa", "fa-trash-can")
        iElem.id = "delete"
        iElem.onclick = () => deleteTile(library.indexOf(book))
        submittedDateDiv.appendChild(iElem)
        dataGrid.appendChild(submittedDateDiv)
        
        //Append entire div.data-grid to displayArea
        displayArea.appendChild(dataGrid)
    }

}


function clearData() {
    library.splice(0, library.length)
    localStorage.setItem("library", JSON.stringify(library))

    updateLibrary()
    updateClearButton()
}

function deleteTile(index) {
    const dataGridIndex = document.querySelectorAll(".data-grid")[index];
    dataGridIndex.classList.add("fadeOut")
    setTimeout(function() {
        if(library.length === 1) {
            document.querySelector(".empty-library").style.display = "block"
            localStorage.removeItem("library")
            clearData()
        }
        library.splice(index, 1)
    
        localStorage.setItem("library", JSON.stringify(library))
    
        updateLibrary()
    }, 500) 
}


//Event Listeners
const form = document.querySelector("#form")
const inputs = document.querySelectorAll("input")

window.addEventListener("DOMContentLoaded", () => {
    updateClearButton()
})

form.addEventListener("submit", e => {
    e.preventDefault()
    const styles = {
        filter: "none",
        pointerEvents: "all"
    }

    document.querySelector("#formDiv").style.display = "none"
    for (const property in styles) {
        document.querySelector(".container").style[property] = styles[property]
    }
    document.querySelector(".empty-library").style.display = "none"

    submitData()
    
})

const addBookBtn = document.querySelector("#addBook")
const submit = document.querySelector("#submit")
const exitWindow = document.querySelector("#exitWindow")
const clearBtn = document.querySelector("#clear")
const deleteBtn = document.querySelector("#delete")

addBookBtn.addEventListener("click", handleEvent)
submit.addEventListener("click", handleEvent)
clearBtn.addEventListener("click", handleEvent)

exitWindow.addEventListener("click", handleEvent)
document.body.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        exitWindow.click()
    }
})

function handleEvent(e) {
    switch (e.target.id) {
        case "addBook":
            document.querySelector("#formDiv").style.display = "flex"
            document.querySelector(".container").style.filter = "blur(5px)"
            document.querySelector(".container").style.pointerEvents = "none"

            form.reset()
            break;
        case "exitWindow": 
            document.querySelector("#formDiv").style.display = "none"
            document.querySelector(".container").style.filter = "none"
            document.querySelector(".container").style.pointerEvents = "all"
            break;
        case "clear": 
            const confirmClear = confirm("Are you sure you want to clear your library?")
            if (confirmClear) {
                clearData()
                document.querySelector(".empty-library").style.display = "block"
            }
            break;  
    }
}
