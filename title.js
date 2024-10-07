import { Paragraph, TextRun } from "docx";
var Title = /** @class */ (function () {
    function Title(coupleLetter, title) {
        this.coupleLetter = coupleLetter;
        this.title = title;
    }
    Title.prototype.asString = function () {
        return "".concat(this.coupleLetter.toUpperCase(), " - ").concat(this.title.toUpperCase());
    };
    Title.prototype.getRenderedHtml = function () {
        var paragraph = document.createElement("p");
        paragraph.classList.add("title");
        var strong = document.createElement("strong");
        strong.textContent = this.asString();
        paragraph.textContent = this.asString();
        return paragraph;
    };
    Title.prototype.getRenderedDocxParagraph = function () {
        return [
            new Paragraph({
                children: [
                    new TextRun({
                        text: this.asString(),
                    }),
                ],
                style: "title"
            })
        ];
    };
    return Title;
}());
export { Title };
