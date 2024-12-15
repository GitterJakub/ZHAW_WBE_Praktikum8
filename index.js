// Generate the board
function showBoard() {
    const board = document.getElementById("board");

    // Create a 6x7 grid (6 rows, 7 columns)
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const field = elt("div", {className: "field"});
            field.addEventListener("click", () => {
                console.log(`Row: ${row}, Col: ${col}`);
            });

            // Add sample pieces as an example (blue at row 2, col 3; red at row 4, col 5)
            if (row === 1 && col === 2) {
                field.appendChild(elt("div", { className: "piece blue" }));
            } else if (row === 3 && col === 4) {
                field.appendChild(elt("div", { className: "piece red" }));
            }

            // Append the field to the board
            board.appendChild(field);
        }
    }
}

function elt (type, props, ...children) {
    let dom = document.createElement(type);
    if (props) Object.assign(dom, props);
    for (let child of children) {
        if (typeof child != 'string') dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    return dom;

}


showBoard();