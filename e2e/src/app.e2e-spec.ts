import { AppPage } from './app.po';

describe('Strongbox', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display logo', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Strongbox');
  });
});
