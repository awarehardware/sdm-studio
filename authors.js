import { Paragraph, TextRun } from "docx";
var Authors = /** @class */ (function () {
    function Authors(content) {
        this.content = content;
    }
    Authors.prototype.isMultiple = function () {
        return this.content.includes('&');
    };
    Authors.prototype.getPrefixString = function () {
        if (this.isMultiple()) {
            return "Auteurs :";
        }
        else {
            return "Auteur :";
        }
    };
    Authors.prototype.asString = function () {
        return "".concat(this.getPrefixString(), " ").concat(this.content);
    };
    Authors.prototype.getRenderedHtml = function () {
        var p = document.createElement("p");
        p.classList.add("dialogue-text");
        if (p) {
            p.textContent += this.asString();
        }
        return p;
    };
    Authors.prototype.getRenderedDocxParagraph = function () {
        return [
            new Paragraph({
                children: [
                    new TextRun({
                        text: this.asString(),
                        break: 1
                    }),
                ],
                style: "text"
            })
        ];
    };
    return Authors;
}());
export { Authors };
