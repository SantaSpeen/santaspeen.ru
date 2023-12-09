function renderNotes(){
    // Find all elements with the specified text content
    var noteStartList = findElementsByTextContent("{ note }");
    var endNoteList = findElementsByTextContent("{ endnote }");

    // Check if the lists have the same length
    if (noteStartList.length === endNoteList.length) {
        // Process each pair of elements
        for (var i = 0; i < noteStartList.length; i++) {
            transformNotesBlock(noteStartList[i], endNoteList[i]);
        }
    }

    // Function to find elements by their text content
    function findElementsByTextContent(text) {
    var elements = document.getElementsByTagName('*');
    var matchingElements = [];
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent === text) {
        matchingElements.push(elements[i]);
        }
    }
    return matchingElements;
    }

    // Function to transform a block of notes
    function transformNotesBlock(noteStart, endNote) {
    // Create a new div element with the class "notes"
    var divNotes = document.createElement('div');
    divNotes.className = 'notes';

    // Move elements to the new div
    var currentElement = noteStart;
    while (currentElement && currentElement.nextSibling !== endNote) {
        divNotes.appendChild(currentElement.nextSibling);
    }

    // Insert the new div before the endNote
    endNote.parentNode.insertBefore(divNotes, endNote);

    // Remove the noteStart and endNote elements
    noteStart.parentNode.removeChild(noteStart);
    endNote.parentNode.removeChild(endNote);
    }
}

function renderIdLinks(){
    var headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(function(heading) {
        var headingText = heading.innerText.trim();
        var headingId = headingText.replace(/\s+/g, '-').toLowerCase();
        heading.id = headingId;

        var linkContainer = document.createElement("a");
        linkContainer.href = "#" + headingId;
        linkContainer.classList.add("heading-link");

        var linkText = document.createTextNode(headingText);
        linkContainer.appendChild(linkText);

        var svgIcon = document.createElement("span");
        svgIcon.classList.add("link-icon");
        linkContainer.appendChild(svgIcon);

        var newHeading = document.createElement(heading.tagName);
        newHeading.id = heading.id;
        newHeading.tabIndex = -1;
        newHeading.appendChild(linkContainer);

        heading.parentNode.replaceChild(newHeading, heading);
    });
}

function renderColorCircles(){
    function addColorCircle(match) {
        return match + ' <span class="color-circle" style="background-color:' + match + '"></span>';
    }
    var codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(function(codeBlock) {
        if (codeBlock.classList.length === 0) {
            codeBlock.classList.add('mono');
            codeBlock.innerHTML = codeBlock.textContent.replace(/(?:#(?:[0-9a-fA-F]{3}){1,2})|(?:rgb\(\s?\d+\s?,\s?\d+\s?,\s?\d+\s?\))|(?:hsl\(\s?\d+\s?,\s?\d+%?\s?,\s?\d+%?\s?\))/g, addColorCircle);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    hljs.highlightAll();    
    renderNotes();
    renderIdLinks();
    renderColorCircles();
});
