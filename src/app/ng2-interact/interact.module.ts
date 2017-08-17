import { NgModule } from "@angular/core";
import { InteractDraggableDirective } from "./draggable.directive";
import { InteractDropzoneDirective } from "./dropzone.directive";
import { InteractResizableDirective } from "./resizable.directive";

@NgModule({
    imports: [],
    declarations: [
        InteractDraggableDirective,
        InteractDropzoneDirective,
        InteractResizableDirective
    ],
    exports: [
        InteractDraggableDirective,
        InteractDropzoneDirective,
        InteractResizableDirective
    ]
})
export class NgInteractModule { }