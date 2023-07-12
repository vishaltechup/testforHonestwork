import { Component } from "@angular/core";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styles: [
        `@media (min-width: 68em) {
            .s-layout__content {
               margin-left: 15em;
            }
        }`
    ]
})
export class LayoutComponent {
    
}