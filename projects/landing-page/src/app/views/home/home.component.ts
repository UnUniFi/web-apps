import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('toggled') myNameElem?: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  toggler() {
    //getValue() {
    console.log('may', this.myNameElem);

    const toggledIsActive = this.myNameElem?.nativeElement.classList.contains('d-none');
    //const hamSmallIsActive = this.hamburgerSmall.nativeElement.classList.contains('is-active');
    //const menuShow = this.menu.nativeElement.classList.contains('show');

    //this.myNameElem?.nativeElement?.innerHTML  = "I am changed by ElementRef & ViewChild";
    //this.myNameElem?.nativeElement?.getElementById('toggled').classList.toggle('d-none');
    console.log('gine');

    if (toggledIsActive) {
      this.renderer.removeClass(this.myNameElem?.nativeElement, 'is-active');
    } else {
      this.renderer.addClass(this.myNameElem?.nativeElement, 'is-active');
    }
  }
}
