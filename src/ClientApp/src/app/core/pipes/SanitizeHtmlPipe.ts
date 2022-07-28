import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {

  constructor(private _sanitizer:DomSanitizer) {
  }

  transform(v:string):SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(v);

// return this._sanitizer.bypassSecurityTrustHtml(v);
// return this._sanitizer.bypassSecurityTrustScript(v);
// return this._sanitizer.bypassSecurityTrustStyle(v);
// return this._sanitizer.bypassSecurityTrustUrl(v);
// return this._sanitizer.bypassSecurityTrustResourceUrl(v);
  }
}
