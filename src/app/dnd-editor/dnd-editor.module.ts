import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DndEditorCompontent } from "./dnd-editor.component";
import { ElementListComponent } from "./element-list/element-list.component";
import { NgInteractModule } from "../ng2-interact/interact.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ElementDropzoneComponent } from "./element-dropzone/element-dropzone.component";
import { DndEditorService } from "./dnd-editor.service";
import { ElementContainerComponent } from "./element-container/element-container.component";
import { PropertyListComponent } from "./property-list/property-list.component";
import { ElementPropertyInputComponent } from "./property-list/property-input/property-input.component";
import { ElementPropertyInputListComponent } from "./property-list/property-input-list/property-input-list.component";
import { TextPropertyInputComponent } from "./property-list/property-input/property-input-components/text-property-input/text-property-input.component";

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        NgInteractModule
    ],
    declarations: [
        DndEditorCompontent,
        ElementListComponent,
        ElementDropzoneComponent,
        ElementContainerComponent,
        PropertyListComponent,
        ElementPropertyInputComponent,
        ElementPropertyInputListComponent,
        TextPropertyInputComponent
    ],
    providers: [
        DndEditorService
    ],
    entryComponents: [
        ElementContainerComponent,
        TextPropertyInputComponent
    ],
    exports: [
        DndEditorCompontent,
        ElementDropzoneComponent
    ]
})
export class DndEditorModule { }