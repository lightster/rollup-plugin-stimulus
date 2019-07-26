import { Application } from 'stimulus';
import controllers from 'stimulus-controllers';

const application = Application.start('fake-element');
application.load(controllers);

export default controllers;
