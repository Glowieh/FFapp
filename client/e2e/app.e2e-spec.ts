import { FFappPage } from './app.po';

describe('ffapp App', () => {
  let page: FFappPage;

  beforeEach(() => {
    page = new FFappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
