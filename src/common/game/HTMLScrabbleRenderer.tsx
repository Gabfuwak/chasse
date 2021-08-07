
export default function RawHTMLRenderer() {
    return (
        <div>
            <p>
                Epic renderer
            </p>
        </div>
    );
}

interface CellData {
    letter: string
}

function ScrabbleCell({letter}: CellData) {
    return (
        <div>
            {letter}
        </div>
    );
}