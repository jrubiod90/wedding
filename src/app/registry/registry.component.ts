import { Component} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css']
})
export class RegistryComponent {
  name = '';
  surnames = '';
  email = '';
  attendance: boolean | null = null;
  menu: string | null = 'normal';
  allergies = '';
  suggestedSongs = '';
  needsAssistance: boolean | null = false;
  companionsCount = 0;
  companions: { name: string; surnames: string; menu: string; needsAssistance: boolean; attendance: boolean, allergies: string }[] = [];
  formMessage = '';
  azureFunctionUrl = 'https://rspvfunctionapp.azurewebsites.net/api/InsertGuest';

  dietaryPreferences = {
    none: false,
    vegan: false,
    vegetarian: false,
    other: false
  };

  updateCompanionsFields() {
    if (this.companionsCount > 4) {
      this.companionsCount = 4;
    }
    this.companions = Array.from({ length: this.companionsCount }, () => ({ name: '', surnames: '', menu: 'normal', needsAssistance: false, attendance: null,  allergies: '' }));
  }

  async submitForm() {
    if (this.attendance === null) {
      this.formMessage = 'Por favor, selecciona si asistirás.';
      return;
    }
  
  if (!this.name) {
    this.formMessage = 'Por favor, completa el campo Nombre.';
    return;
  }
  if (!this.surnames) {
    this.formMessage = 'Por favor, completa el campo Apellidos.';
    return;
  }
  if (!this.email) {
    this.formMessage = 'Por favor, completa el campo Email.';
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(this.email)) {
    this.formMessage = 'Por favor, ingresa un correo electrónico válido.';
    return;
  }

  if (this.companionsCount > 0) {
    for (let i = 0; i < this.companions.length; i++) {
      const companion = this.companions[i];
      if (!companion.name) {
        this.formMessage = `Por favor, completa el campo Nombre para el acompañante ${i + 1}.`;
        return;
      }
      if (!companion.surnames) {
        this.formMessage = `Por favor, completa el campo Apellidos para el acompañante ${i + 1}.`;
        return;
      }
    }
  }
    const formData = {
      name: this.name,
      surnames: this.surnames,
      email: this.email,
      attendance: this.attendance,
      menu: this.menu,
      allergies: this.allergies ? this.allergies : '',
      suggestedSongs: this.suggestedSongs ? this.suggestedSongs : '',
      needsAssistance: this.needsAssistance ? this.needsAssistance : false,
      companions: this.companions ? this.companions : []
    };
  
    try {
      const response = await fetch(this.azureFunctionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-functions-key': 'Eu5xq1v8WYMvPhUtV9gwCK3xhA_YwWnHA2So4PCXIvm-AzFuSd2L8Q==' },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        this.formMessage = 'Hubo un problema al enviar los datos del invitado principal.';
        return;
      }
  
      for (const companion of this.companions) {
        const companionData = {
          name: companion.name,
          surnames: companion.surnames,
          email: this.email,
          menu: companion.menu,
          attendance: this.attendance,
          needsAssistance: companion.needsAssistance ? companion.needsAssistance : false,
          allergies: companion.allergies ? companion.allergies : ''
        };
  
        const companionResponse = await fetch(this.azureFunctionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-functions-key': 'Eu5xq1v8WYMvPhUtV9gwCK3xhA_YwWnHA2So4PCXIvm-AzFuSd2L8Q==' },
          body: JSON.stringify(companionData)
        });
  
        if (!companionResponse.ok) {
          this.formMessage = `Hubo un problema al enviar los datos del acompañante ${companion.name}.`;
          return;
        }
      }
  
      this.formMessage = '¡Gracias por confirmar tu asistencia!';
      this.resetForm();
  
    } catch (error) {
      this.formMessage = 'Error al enviar los datos. Revisa tu conexión.';
    }
  }
  

  resetForm() {
    this.name = '';
    this.surnames = '';
    this.email = '';
    this.attendance = null;
    this.menu = 'normal';
    this.allergies = '';
    this.suggestedSongs = '';
    this.needsAssistance = false;
    this.companionsCount = 0;
    this.companions = [];
  }
}
