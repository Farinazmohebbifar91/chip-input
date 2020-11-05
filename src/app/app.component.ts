import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  languageCtrl = new FormControl();
  filteredLanguages: Observable<string[]>;
  languages: string[] = [];
  allLanguages: string[] = ['JavaScript', 'Java', 'Go', 'Python', 'Ruby', 'Objective C'];

  @ViewChild('languageInput', {static: true}) languageInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: true}) matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredLanguages = this.languageCtrl.valueChanges.pipe(
        startWith(null),
        map((language: string | null) => language ? this._filter(language) : this.allLanguages.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our language
    if ((value || '').trim()) {
      this.languages.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.languageCtrl.setValue(null);
  }

  remove(language: string): void {
    const index = this.languages.indexOf(language);

    if (index >= 0) {
      this.languages.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.languages.push(event.option.viewValue);
    this.languageInput.nativeElement.value = '';
    this.languageCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allLanguages.filter(language => language.toLowerCase().indexOf(filterValue) === 0);
  }
}
