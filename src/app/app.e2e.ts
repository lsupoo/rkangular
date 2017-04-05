import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result  = 'RunaKuna – Sistema de Recursos Humanos – V1.0 ';
    expect(subject).toEqual(result);
  });


});
