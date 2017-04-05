import {Directive, ElementRef, OnInit, Input, EventEmitter,Output} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[smartClockpicker]'
})
export class SmartClockpickerDirective implements OnInit {

  @Input() smartClockpicker: any;

  @Output() change = new EventEmitter();

  constructor(private el:ElementRef) {
  }

  ngOnInit() {
    //System.import('script!clockpicker/dist/bootstrap-clockpicker.min.js').then(()=> {
    System.import('script-loader!clockpicker/dist/bootstrap-clockpicker.min.js').then(()=> {
      this.render()
    })
  }


  render() {
    $(this.el.nativeElement).clockpicker(this.smartClockpicker || {
          placement: 'bottom',
          donetext: 'Done',
          afterDone: () => {
            this.change.emit(this.el.nativeElement.value);
          }
        });

  }

}
