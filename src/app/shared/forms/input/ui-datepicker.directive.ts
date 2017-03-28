import {Directive, ElementRef, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DatePipe } from '@angular/common';

declare var $:any;

@Directive({
  selector: '[saUiDatepicker]',
  providers: [DatePipe]
})
export class UiDatepickerDirective implements OnInit {

  @Input() saUiDatepicker:any;

  @Output() change = new EventEmitter();

  constructor(private el:ElementRef) {
  }

  ngOnInit() {
    let onSelectCallbacks = [];
    let saUiDatepicker = this.saUiDatepicker || {};
    let element = $(this.el.nativeElement);

    //Primera solucion
    $(this.el.nativeElement).datepicker({
      onSelect: (dateText,index) => {
        if(dateText !== index.lastVal){
          this.change.emit(dateText);
          //$(this).off( "focus" );
          //$('#datepickerHasta').focus();
        }
      },
      onClose: function (dateText, inst) {
        /*if (!document.all)
          this.select();*/
        $(this).focusNextInputField();
      }
    });
    $.fn.focusNextInputField = function() {
      return this.each(function() {
        var fields = $(this).parents('form:eq(0),body').find('button,input,textarea,select');
        var index = fields.index( this );
        if(fields.eq(index).attr('id')!=null && fields.eq(index).attr('id')!='' && fields.eq(index).attr('id')!='undefined' &&
            (fields.eq(index).attr('id').includes("desde") || fields.eq(index).attr('id').includes("Desde"))) {
          fields.eq(index + 1).focus();
        }
        if ( index > -1 && ( index + 1 ) < fields.length ) {
        }
        return false;
      });
    };
    //Tercera
    /*$(this.el.nativeElement).datepicker({
      onSelect: function(dateText) {
        document.all ? $(this).get(0).fireEvent("onchange") : this.change(dateText);
        $(this).off( "focus" );
      },
      onClose: function (dateText, inst) {
        if (!document.all)
          this.select();
      }
    });*/

    $(this.el.nativeElement).datepicker('option', 'dateFormat', "dd/mm/yy");


    $(this.el.nativeElement).datepicker( "option", "monthNames", ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"]);

    $(this.el.nativeElement).datepicker( "option", "dayNamesMin", ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]);

    if (saUiDatepicker.minRestrict) {
      onSelectCallbacks.push((selectedDate)=> {
        $(saUiDatepicker.minRestrict).datepicker('option', 'minDate', selectedDate);
      });
    }
    if (saUiDatepicker.maxRestrict) {
      onSelectCallbacks.push((selectedDate)=> {
        $(saUiDatepicker.maxRestrict).datepicker('option', 'maxDate', selectedDate);
      });
    }

    //Let others know about changes to the data field
    onSelectCallbacks.push((selectedDate) => {
      element.triggerHandler("change");

      let form = element.closest('form');

      if (typeof form.bootstrapValidator == 'function') {
        try {
          form.bootstrapValidator('revalidateField', element);
        } catch (e) {
        }
      }
    });

    let options = $.extend(saUiDatepicker, {
      prevText: '<i class="fa fa-pencil"></i>',
      nextText: '<i class="fa fa-step-forward"></i>',
      onSelect: (selectedDate) =>{
        onSelectCallbacks.forEach((callback) =>{
          callback.call(callback, selectedDate)
        })
      }
    });

    element.datepicker(options);


  }

}
