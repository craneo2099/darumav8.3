import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  public pages: Array<{titulo: string, color: string, componente: string, icon: string}> = [];

  constructor(private storage: Storage) {
    this.storage.create();
  }
}
