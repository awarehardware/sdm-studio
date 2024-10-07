import { Paragraph, TextRun } from "docx";
var Direction = /** @class */ (function () {
    function Direction(content) {
        this.content = content;
    }
    Direction.prototype.getRenderedHtml = function () {
        var p = document.createElement("p");
        p.classList.add("direction");
        if (p) {
            p.textContent += "".concat(this.content);
        }
        return p;
    };
    Direction.prototype.getRenderedDocxParagraph = function () {
        return [
            new Paragraph({
                children: [
                    new TextRun({
                        text: this.content,
                        break: 1
                    }),
                ],
                style: "direction"
            })
        ];
    };
    return Direction;
}());
export { Direction };
