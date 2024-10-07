import { Title } from "./title";
import { Authors } from "./authors";
import { Stage } from "./stage";
var ScreenPlay = /** @class */ (function () {
    function ScreenPlay() {
        this.title = new Title("X", "No title");
        this.elements = [];
        this.authors = new Authors("");
        this.stage = new Stage();
    }
    return ScreenPlay;
}());
export { ScreenPlay };
