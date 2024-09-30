import { saveAs } from "file-saver";
import { ScreenPlay } from "./screenplay"
import { AlignmentType, Document, Packer } from "docx";

const GENERATED_DOCX_STYLES = {
    paragraphStyles: [
        {
            id: "character",
            name: "character",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
                bold: true,
                font: "Times New Roman",
                size: 26
            },
            paragraph: {
                alignment: AlignmentType.CENTER,
            }
        },
        {
            id: "title",
            name: "title",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
                bold: true,
                font: "Times New Roman",
                size: 26
            },
            paragraph: {
                alignment: AlignmentType.LEFT,
            }
        },
        {
            id: "text",
            name: "text",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
                bold: false,
                font: "Times New Roman",
                size: 26
            },
            paragraph: {
                alignment: AlignmentType.LEFT,
            }
        },
        {
            id: "direction",
            name: "direction",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
                bold: false,
                italics: true,
                font: "Times New Roman",
                size: 26
            },
            paragraph: {
            }
        }

    ]
}

export async function generateDoc(screenplay: ScreenPlay) {
    // Get the text from the input field
    const section_children = [];

    // Render title
    section_children.push(...screenplay.title.getRenderedDocxParagraph());
    
    // Render screenplay elements
    for (let i = 0; i < screenplay.elements.length; i++) {
        section_children.push(...screenplay.elements[i].getRenderedDocxParagraph());
    }

    const docTitle = screenplay.title.asString();

    // The first argument is an ID you use to apply the style to paragraphs
    // The second argument is a human-friendly name to show in the UI
    let doc = new Document({
        creator: "",
        title: docTitle,
        description: "",
        sections: [{
            children: section_children
        }],
        styles: GENERATED_DOCX_STYLES
    });

    // Pack the document into a blob and trigger download
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${docTitle}.docx`);
}
