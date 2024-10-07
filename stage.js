import { Paragraph, TextRun } from "docx";
var Stage = /** @class */ (function () {
    function Stage(intOrExt, dayOrNight, place) {
        if (intOrExt === void 0) { intOrExt = "INT"; }
        if (dayOrNight === void 0) { dayOrNight = "JOUR"; }
        if (place === void 0) { place = ""; }
        this.intOrExt = intOrExt;
        this.dayOrNight = dayOrNight;
        this.place = place;
    }
    Stage.prototype.asString = function () {
        return "".concat(this.intOrExt, " / ").concat(this.dayOrNight, " - ").concat(this.place);
    };
    Stage.prototype.getRenderedHtml = function () {
        var p = document.createElement("strong");
        p.classList.add("title");
        if (p) {
            p.textContent += this.asString();
        }
        return p;
    };
    Stage.prototype.getRenderedDocxParagraph = function () {
        return [
            new Paragraph({
                children: [
                    new TextRun({
                        text: this.asString(),
                        break: 1
                    }),
                ],
                style: "title"
            })
        ];
    };
    return Stage;
}());
export { Stage };
