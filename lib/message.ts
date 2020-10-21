import { readFileSync } from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import { GENERIC_MAIL, RAW_MAIL, VIEW_BASED_MAIL } from "./constants";
import { MailData, MailType } from "./interfaces";
import { MailmanService } from "./service";
import { GENERIC_VIEW } from "./views/mail";

export class MailMessage {
  private mailSubject?: string;
  private viewFile?: string;
  private templateString?: string;
  private payload?: Record<string, any>;
  private mailType: MailType;
  private compiledHtml: string;

  private constructor() {
    this.compiledHtml = "";
    this.mailType = RAW_MAIL;
  }

  /**
   * static method to create new instance of the MailMessage class
   */
  static init(): MailMessage {
    return new MailMessage();
  }

  /**
   * Define subject of the mail
   * @param subject
   */
  subject(subject: string): this {
    this.mailSubject = subject;
    return this;
  }

  /**
   * Define the view to be used for the mail
   * @param viewFile
   * @param payload
   */
  view(viewFile: string, payload?: Record<string, any>): this {
    this.mailType = VIEW_BASED_MAIL;
    this.viewFile = viewFile;
    this.payload = payload;
    return this;
  }

  /**
   * Define the template string to be used for the mail
   * @param template
   * @param payload
   */
  raw(template: string, payload?: Record<string, any>): this {
    this.mailType = RAW_MAIL;
    this.templateString = template;
    this.payload = payload;
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding the greeting to the generic mail
   * @param greeting
   */
  greeting(greeting: string): this {
    this._setGenericMailProperties();
    this.payload!.genericFields.push({ greeting });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a text line to the generic mail
   * @param line
   */
  line(line: string): this {
    this._setGenericMailProperties();
    this.payload!.genericFields.push({ line });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a url action to the generic mail
   * @param text
   * @param link
   */
  action(text: string, link: string): this {
    this._setGenericMailProperties();
    this.payload!.genericFields.push({ action: { text, link } });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * @param greeting
   */
  private _setGenericMailProperties() {
    this.mailType = GENERIC_MAIL;
    if (!this.payload || !this.payload.genericFields) {
      this.payload = { genericFields: [] };
    }
  }

  /**
   * Method to compile templates
   */
  private _compileTemplate(): string {
    if (this.compiledHtml) return this.compiledHtml;

    if (this.mailType === GENERIC_MAIL) {
      const template = Handlebars.compile(GENERIC_VIEW);
      this.compiledHtml = template(this.payload);
      return this.compiledHtml;
    }

    if (this.mailType === VIEW_BASED_MAIL && this.viewFile) {
      const config = MailmanService.getConfig();
      const template = Handlebars.compile(
        readFileSync(path.join(config.path || "", this.viewFile), "utf-8")
      );
      this.compiledHtml = template(this.payload);
      return this.compiledHtml;
    }

    if (this.mailType === RAW_MAIL && this.templateString) {
      const template = Handlebars.compile(this.templateString);
      this.compiledHtml = template(this.payload);
      return this.compiledHtml;
    }

    return this.compiledHtml;
  }

  /**
   * Returns the maildata payload
   */
  getMailData(): MailData {
    return { subject: this.mailSubject, html: this._compileTemplate() };
  }
}
