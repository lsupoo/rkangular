import { Smartadmin4Page } from './app.po';

describe('smartadmin4 App', () => {
  let page: Smartadmin4Page;

  beforeEach(() => {
    page = new Smartadmin4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
